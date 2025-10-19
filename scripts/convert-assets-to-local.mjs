import fs from 'fs';
import path from 'path';
import { load as loadYaml, dump as dumpYaml } from 'js-yaml';

const rootDir = process.cwd();

const publicDir = path.join(rootDir, 'public', 'images');
const aboutPath = path.join(rootDir, 'src', 'content', 'about.yml');
const projectsDir = path.join(rootDir, 'src', 'content', 'projects');

const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const getExtension = (assetUrl) => {
  const { pathname } = new URL(assetUrl);
  const ext = path.extname(pathname);
  return ext || '.jpg';
};

const downloadAsset = async (assetUrl, outputPath) => {
  const response = await fetch(assetUrl);
  if (!response.ok) {
    throw new Error(`Failed to download ${assetUrl}: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
};

const readYaml = (filePath) => loadYaml(fs.readFileSync(filePath, 'utf8'));
const writeYaml = (filePath, data) =>
  fs.writeFileSync(filePath, `${dumpYaml(data, { lineWidth: 80, noRefs: true })}\n`);

const processAbout = async () => {
  const aboutRaw = readYaml(aboutPath);
  if (!aboutRaw.icon?.url) {
    return aboutRaw;
  }

  const ext = getExtension(aboutRaw.icon.url);
  const outputDir = path.join(publicDir, 'about');
  ensureDir(outputDir);

  const filename = `icon${ext}`;
  const outputPath = path.join(outputDir, filename);
  const publicPath = `/images/about/${filename}`;

  await downloadAsset(aboutRaw.icon.url, outputPath);
  aboutRaw.icon.url = publicPath;

  return aboutRaw;
};

const processProjects = async () => {
  const files = fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith('.yml') || file.endsWith('.yaml'));

  const processed = [];

  for (const file of files) {
    const projectPath = path.join(projectsDir, file);
    const project = readYaml(projectPath);
    const projectDir = path.join(publicDir, 'projects', project.id);
    ensureDir(projectDir);

    if (project.mainVisual?.url) {
      const ext = getExtension(project.mainVisual.url);
      const filename = `main${ext}`;
      const outputPath = path.join(projectDir, filename);
      const publicPath = `/images/projects/${project.id}/${filename}`;

      await downloadAsset(project.mainVisual.url, outputPath);
      project.mainVisual.url = publicPath;
    }

    if (Array.isArray(project.images)) {
      project.images = await Promise.all(
        project.images.map(async (image, index) => {
          if (!image?.url) {
            return image;
          }
          const ext = getExtension(image.url);
          const filename = `gallery-${index + 1}${ext}`;
          const outputPath = path.join(projectDir, filename);
          const publicPath = `/images/projects/${project.id}/${filename}`;

          await downloadAsset(image.url, outputPath);
          return {
            ...image,
            url: publicPath,
          };
        })
      );
    }

    processed.push({ project, projectPath });
  }

  return processed;
};

const main = async () => {
  ensureDir(publicDir);

  const aboutData = await processAbout();
  const projectsData = await processProjects();

  writeYaml(aboutPath, aboutData);
  projectsData.forEach(({ project, projectPath }) => writeYaml(projectPath, project));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
