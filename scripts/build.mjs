import { readFileSync, writeFileSync } from 'fs';
import AdmZip from 'adm-zip';

const semver = new RegExp('^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$');

const nextVersion = process.env.VERSION;
const manifestUrl = process.env.MANIFEST;
const downloadUrl = process.env.DOWNLOAD;

if (!semver.test(nextVersion)) {
  console.error('Invalid version number');
  process.exit(1);
}

const packageFile = JSON.parse(readFileSync(`${process.cwd()}/package.json`));
const moduleFile = JSON.parse(readFileSync(`${process.cwd()}/module.json`));

packageFile.version = nextVersion;
moduleFile.version = nextVersion;
moduleFile.manifest = manifestUrl;
moduleFile.download = downloadUrl;

writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(packageFile, null, 2));
writeFileSync(`${process.cwd()}/module.json`, JSON.stringify(moduleFile, null, 2));

const module = new AdmZip();
module.addLocalFolder(`${process.cwd()}/lang/pt-BR`, 'lang/pt-BR');
module.addLocalFile(`${process.cwd()}/module.json`);
module.writeZip(`${process.cwd()}/module.zip`);
