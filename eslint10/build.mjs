import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(projectDir, 'dist');
const packageJsonPath = path.join(projectDir, 'package.json');

const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

if (!Array.isArray(packageJson.files)) {
  throw new TypeError('package.json files must be an array.');
}

await rm(distDir, { force: true, recursive: true });
await mkdir(distDir, { recursive: true });

for (const entry of packageJson.files) {
  if (typeof entry !== 'string' || entry.length === 0) {
    throw new TypeError('package.json files entries must be non-empty strings.');
  }

  const sourcePath = path.resolve(projectDir, entry);
  const destinationPath = path.resolve(distDir, entry);

  if (!sourcePath.startsWith(`${projectDir}${path.sep}`)) {
    throw new Error(`Refusing to copy files entry outside project: ${entry}`);
  }

  if (!destinationPath.startsWith(`${distDir}${path.sep}`)) {
    throw new Error(`Refusing to write files entry outside dist: ${entry}`);
  }

  await mkdir(path.dirname(destinationPath), { recursive: true });
  await cp(sourcePath, destinationPath, { force: true, recursive: true, verbatimSymlinks: true });
}

const distPackageJson = { ...packageJson };
delete distPackageJson.private;
delete distPackageJson.script;
delete distPackageJson.scripts;
delete distPackageJson.devDependencies;

await writeFile(path.join(distDir, 'package.json'), `${JSON.stringify(distPackageJson, null, 2)}\n`);

console.log(`Built ${packageJson.files.length} package files entries into dist.`);
