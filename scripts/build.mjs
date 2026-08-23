import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const output = path.join(root, 'dist');
const assetsOutput = path.join(output, 'assets');
const sourceFiles = ['index.html', 'style.css', 'overrides.css', 'script.js'];
const imagePattern = /\.(?:png|jpe?g|webp)(?:\?.*)?$/i;
const imageFilePattern = /\.(?:png|jpe?g|webp)$/i;

const toPosix = value => value.split(path.sep).join('/');
const relativeToRoot = value => toPosix(path.relative(root, value));
const isFile = async value => { try { return (await fs.stat(value)).isFile(); } catch { return false; } };
const walkImages = async directory => {
  const images = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) images.push(...await walkImages(location));
    else if (entry.isFile() && imageFilePattern.test(entry.name)) images.push(location);
  }
  return images;
};
const decodePath = value => { try { return decodeURIComponent(value); } catch { return value; } };
const resolveSource = async reference => {
  const sourcePath = decodePath(reference.replace(/\?.*$/, '')).replaceAll('/', path.sep);
  const candidates = [path.join(root, sourcePath), path.join(root, 'Project', sourcePath)];
  if (reference === 'Level%20up/maze.png') candidates.push(path.join(root, 'Project', 'Level up', 'cemetery maze.png'));
  for (const candidate of candidates) if (await isFile(candidate)) return path.resolve(candidate);
  throw new Error(`Referenced image was not found: ${reference}`);
};
const extractReferences = content => {
  const references = [];
  for (const match of content.matchAll(/(?:src|data-full)="([^"]+)"/g)) references.push(match[1]);
  for (const match of content.matchAll(/url\((?:'|")?([^)'"`]+)(?:'|")?\)/g)) references.push(match[1]);
  return references;
};

await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(assetsOutput, { recursive: true });
const contents = Object.fromEntries(await Promise.all(sourceFiles.map(async file => [file, await fs.readFile(path.join(root, file), 'utf8')])));
const references = new Set([...extractReferences(contents['index.html']), ...extractReferences(contents['style.css']), ...extractReferences(contents['overrides.css'])]);
for (const directory of [path.join(root, 'Project', 'Bridge', 'draft'), path.join(root, 'Project', 'Level up'), path.join(root, 'About', 'Painting & sketch')]) {
  for (const image of await walkImages(directory)) references.add(relativeToRoot(image));
}

const sourceToOutput = new Map();
const referenceToOutput = new Map();
let assetCount = 0;
for (const reference of [...references].sort()) {
  if (!imagePattern.test(reference) || /^(?:https?:|data:|#)/i.test(reference)) continue;
  const source = await resolveSource(reference);
  if (!sourceToOutput.has(source)) {
    const outputPath = `assets/media-${String(++assetCount).padStart(3, '0')}.jpg`;
    try {
      await sharp(source).rotate().resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true }).flatten({ background: '#ffffff' }).jpeg({ quality: 85, chromaSubsampling: '4:2:0' }).toFile(path.join(output, outputPath));
    } catch (error) {
      throw new Error(`Unable to process ${relativeToRoot(source)}. Check that Git LFS is enabled in Vercel.\n${error.message}`);
    }
    sourceToOutput.set(source, outputPath);
  }
  referenceToOutput.set(reference, sourceToOutput.get(source));
}
for (const [reference, outputPath] of referenceToOutput) {
  for (const file of ['index.html', 'style.css', 'overrides.css']) contents[file] = contents[file].replaceAll(reference, outputPath);
}

const manifest = Object.fromEntries([...sourceToOutput.entries()].map(([source, outputPath]) => [relativeToRoot(source), outputPath]));
const resolver = `const assetManifest = ${JSON.stringify(manifest)};\nconst resolveAssetPath = path => {
  const [rawPath, query = ''] = path.split(/(\\?.*)/, 2);
  const canonicalPath = decodeURIComponent(rawPath)
    .replace(/^Bridge\\//, 'Project/Bridge/')
    .replace(/^Level up\\//, 'Project/Level up/')
    .replace(/^Painting & sketch\\//, 'About/Painting & sketch/')
    .replace('Project/Level up/maze.png', 'Project/Level up/cemetery maze.png');
  const asset = assetManifest[canonicalPath];
  return asset ? \`${'${asset}'}${'${query}'}\` : path;
};\n\n`;
contents['script.js'] = contents['script.js'].replace(/^const resolveAssetPath = path => path.*?;\r?\n/s, resolver);
if (!contents['script.js'].startsWith('const assetManifest =')) throw new Error('The asset resolver could not be injected into script.js.');
const version = new Date().toISOString().replace(/\D/g, '');
contents['index.html'] = contents['index.html'].replace('href="style.css"', `href="style.css?v=${version}"`).replace('href="overrides.css"', `href="overrides.css?v=${version}"`).replace('src="script.js"', `src="script.js?v=${version}"`);
await Promise.all(sourceFiles.map(file => fs.writeFile(path.join(output, file), contents[file])));
await fs.copyFile(path.join(root, 'Open Graph.png'), path.join(output, 'Open Graph.png'));
console.log(`Built ${assetCount} optimized images in dist/`);
