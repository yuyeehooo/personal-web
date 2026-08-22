param(
  [Parameter(Mandatory = $true)]
  [string]$OutputPath
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = $PSScriptRoot
$output = [IO.Path]::GetFullPath($OutputPath)

if (Test-Path -LiteralPath $output) {
  Remove-Item -LiteralPath $output -Recurse -Force
}
New-Item -ItemType Directory -Path $output | Out-Null
$assetDirectory = Join-Path $output 'assets'
New-Item -ItemType Directory -Path $assetDirectory | Out-Null

$files = @('index.html', 'style.css', 'overrides.css', 'script.js')
$contents = @{}
foreach ($file in $files) {
  $contents[$file] = Get-Content -LiteralPath (Join-Path $root $file) -Raw
}

$references = [System.Collections.Generic.List[string]]::new()
foreach ($match in [regex]::Matches($contents['index.html'], '(?:src|data-full)="([^"]+)"')) {
  $references.Add($match.Groups[1].Value)
}
foreach ($cssFile in @('style.css', 'overrides.css')) {
  foreach ($match in [regex]::Matches($contents[$cssFile], "url\((?:'|`")?([^)'`"]+)(?:'|`")?\)")) {
    $references.Add($match.Groups[1].Value)
  }
}

# JavaScript creates additional galleries after the page loads. Include the
# image collections it draws from so every generated slide is publishable.
$dynamicImageRoots = @(
  (Join-Path $root 'Project\Bridge\draft'),
  (Join-Path $root 'Project\Level up'),
  (Join-Path $root 'About\Painting & sketch')
)
foreach ($imageRoot in $dynamicImageRoots) {
  Get-ChildItem -LiteralPath $imageRoot -File -Recurse |
    Where-Object { $_.Extension -match '^\.(?:jpg|jpeg|png|webp)$' } |
    ForEach-Object {
      $references.Add(([IO.Path]::GetRelativePath($root, $_.FullName)).Replace('\', '/'))
    }
}

$jpegEncoder = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParameters = [Drawing.Imaging.EncoderParameters]::new(1)
$encoderParameters.Param[0] = [Drawing.Imaging.EncoderParameter]::new(
  [Drawing.Imaging.Encoder]::Quality,
  [long]85
)

$sourceToOutput = @{}
$referenceToOutput = @{}
$counter = 0

foreach ($reference in ($references | Sort-Object -Unique)) {
  if ($reference -notmatch '\.(?:png|jpe?g|webp)(?:\?.*)?$' -or $reference -match '^(?:https?:|data:|#)') {
    continue
  }

  $decoded = [uri]::UnescapeDataString($reference).Replace('/', [IO.Path]::DirectorySeparatorChar)
  $candidate = Join-Path $root $decoded
  if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
    $candidate = Join-Path $root (Join-Path 'Project' $decoded)
  }
  if (-not (Test-Path -LiteralPath $candidate -PathType Leaf) -and $reference -eq 'Level%20up/maze.png') {
    $candidate = Join-Path $root 'Project\Level up\cemetery maze.png'
  }
  if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
    throw "Referenced asset was not found: $reference"
  }

  $sourceKey = [IO.Path]::GetFullPath($candidate)
  if (-not $sourceToOutput.ContainsKey($sourceKey)) {
    $counter++
    $relativeOutput = "assets/media-$('{0:d3}' -f $counter).jpg"
    $destination = Join-Path $output $relativeOutput

    $sourceImage = [Drawing.Image]::FromFile($sourceKey)
    try {
      $maxDimension = 2560
      $scale = [Math]::Min(1.0, [Math]::Min($maxDimension / $sourceImage.Width, $maxDimension / $sourceImage.Height))
      $width = [Math]::Max(1, [int][Math]::Round($sourceImage.Width * $scale))
      $height = [Math]::Max(1, [int][Math]::Round($sourceImage.Height * $scale))
      $canvas = [Drawing.Bitmap]::new($width, $height)
      try {
        $graphics = [Drawing.Graphics]::FromImage($canvas)
        try {
          $graphics.Clear([Drawing.Color]::White)
          $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
          $graphics.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
          $graphics.CompositingQuality = [Drawing.Drawing2D.CompositingQuality]::HighQuality
          $graphics.DrawImage($sourceImage, 0, 0, $width, $height)
        }
        finally {
          $graphics.Dispose()
        }
        $canvas.Save($destination, $jpegEncoder, $encoderParameters)
      }
      finally {
        $canvas.Dispose()
      }
    }
    finally {
      $sourceImage.Dispose()
    }

    $sourceToOutput[$sourceKey] = $relativeOutput
  }

  $referenceToOutput[$reference] = $sourceToOutput[$sourceKey]
}

foreach ($reference in $referenceToOutput.Keys) {
  foreach ($file in @('index.html', 'style.css', 'overrides.css')) {
    $contents[$file] = $contents[$file].Replace($reference, $referenceToOutput[$reference])
  }
}

$assetManifest = [ordered]@{}
foreach ($sourceKey in $sourceToOutput.Keys) {
  $relativeSource = ([IO.Path]::GetRelativePath($root, $sourceKey)).Replace('\', '/')
  $assetManifest[$relativeSource] = $sourceToOutput[$sourceKey]
}
$manifestJson = $assetManifest | ConvertTo-Json -Compress
$resolver = "const assetManifest = $manifestJson;`r`n" + @'
const resolveAssetPath = path => {
  const [rawPath, query = ''] = path.split(/(\?.*)/, 2);
  const canonicalPath = decodeURIComponent(rawPath)
    .replace(/^Bridge\//, 'Project/Bridge/')
    .replace(/^Level up\//, 'Project/Level up/')
    .replace(/^Painting & sketch\//, 'About/Painting & sketch/')
    .replace('Project/Level up/maze.png', 'Project/Level up/cemetery maze.png');
  const asset = assetManifest[canonicalPath];
  return asset ? `${asset}${query}` : path;
};

'@
$contents['script.js'] = [regex]::Replace(
  $contents['script.js'],
  '(?s)^const resolveAssetPath = path => path.*?;\r?\n',
  $resolver,
  1
)

# A new query version ensures visitors receive the matching script and styles
# immediately when a fresh production deployment is promoted.
$assetVersion = [DateTime]::UtcNow.ToString('yyyyMMddHHmmss')
$contents['index.html'] = $contents['index.html'].
  Replace('href="style.css"', "href=`"style.css?v=$assetVersion`"").
  Replace('href="overrides.css"', "href=`"overrides.css?v=$assetVersion`"").
  Replace('src="script.js"', "src=`"script.js?v=$assetVersion`"")

foreach ($file in $files) {
  Set-Content -LiteralPath (Join-Path $output $file) -Value $contents[$file] -NoNewline -Encoding utf8
}

$outputFiles = Get-ChildItem -LiteralPath $output -File -Recurse
[pscustomobject]@{
  OptimizedAssets = $counter
  OutputFiles = $outputFiles.Count
  OutputMB = [math]::Round((($outputFiles | Measure-Object Length -Sum).Sum / 1MB), 1)
} | Format-List
