import fs from 'fs';
import path from 'path';
import { load as loadYaml, dump as dumpYaml } from 'js-yaml';
import KuroshiroModule from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content');
const PROJECTS_DIR = path.join(CONTENT_ROOT, 'projects');
const IMAGES_ROOT = path.join(process.cwd(), 'public', 'images', 'projects');

const readProject = (filePath) => loadYaml(fs.readFileSync(filePath, 'utf8'));
const writeProject = (filePath, data) =>
  fs.writeFileSync(filePath, `${dumpYaml(data, { lineWidth: 80, noRefs: true })}\n`);

const formatDateId = (dateString) => {
  if (!dateString) {
    return 'undated';
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.valueOf())) {
    return 'undated';
  }
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const baseTitle = (title) => {
  if (!title) return 'project';
  const quoteMatch = title.match(/[「『](.+?)[」』]/g);
  if (quoteMatch && quoteMatch.length > 0) {
    return quoteMatch[quoteMatch.length - 1].replace(/[「」『』]/g, '');
  }
  return title;
};

const slugify = (text) =>
  text
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_')
    .toLowerCase();

const ensureUnique = (baseId, used) => {
  let candidate = baseId;
  let counter = 2;
  while (used.has(candidate)) {
    candidate = `${baseId}_${counter}`;
    counter += 1;
  }
  used.add(candidate);
  return candidate;
};

const convertTitleToRomaji = async (kuroshiro, title) => {
  if (!title) return 'project';
  try {
    const converted = await kuroshiro.convert(title, {
      to: 'romaji',
      mode: 'normal',
      romajiSystem: 'passport',
    });
    return converted || title;
  } catch (error) {
    console.warn(`Failed to convert title "${title}" to romaji:`, error.message);
    return title;
  }
};

const calculateNewIds = async (projects, kuroshiro) => {
  const used = new Set();
  const mapped = [];

  for (const { filePath, data } of projects) {
    const dateId =
      formatDateId(data.date) ||
      formatDateId(data.publishedAt) ||
      formatDateId(data.createdAt) ||
      'undated';

    const titleBasis = baseTitle(data.title);
    const romajiTitle = await convertTitleToRomaji(kuroshiro, titleBasis);
    const slugComponent = slugify(romajiTitle).slice(0, 60) || 'project';

    const baseId = `${dateId}_${slugComponent}`;
    const newId = ensureUnique(baseId, used);

    mapped.push({ filePath, data, oldId: data.id, newId });
  }

  return mapped;
};

const updateImagePath = (url, oldId, newId) => {
  if (!url || typeof url !== 'string') return url;
  return url.replace(`/projects/${oldId}/`, `/projects/${newId}/`);
};

const renameProjectAssets = (oldId, newId) => {
  if (oldId === newId) return;
  const oldDir = path.join(IMAGES_ROOT, oldId);
  const newDir = path.join(IMAGES_ROOT, newId);
  if (!fs.existsSync(oldDir)) return;
  fs.mkdirSync(path.dirname(newDir), { recursive: true });
  fs.renameSync(oldDir, newDir);
};

const main = async () => {
  if (!fs.existsSync(PROJECTS_DIR)) {
    console.error('Projects directory not found:', PROJECTS_DIR);
    process.exit(1);
  }

  const projectFiles = fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith('.yml') || file.endsWith('.yaml'))
    .map((file) => ({
      filePath: path.join(PROJECTS_DIR, file),
      data: readProject(path.join(PROJECTS_DIR, file)),
    }));

  const Kuroshiro = KuroshiroModule.default || KuroshiroModule;
  const kuroshiro = new Kuroshiro();
  await kuroshiro.init(new KuromojiAnalyzer());

  const mappedProjects = await calculateNewIds(projectFiles, kuroshiro);

  mappedProjects.forEach(({ filePath, data, oldId, newId }) => {
    data.id = newId;

    if (data.mainVisual?.url) {
      data.mainVisual.url = updateImagePath(data.mainVisual.url, oldId, newId);
    }

    if (Array.isArray(data.images)) {
      data.images = data.images.map((image) => ({
        ...image,
        url: updateImagePath(image.url, oldId, newId),
      }));
    }

    const newFilePath = path.join(PROJECTS_DIR, `${newId}.yml`);

    writeProject(newFilePath, data);

    if (newFilePath !== filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    renameProjectAssets(oldId, newId);
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
