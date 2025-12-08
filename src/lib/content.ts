import fs from 'fs';
import path from 'path';
import { load as loadYaml } from 'js-yaml';

export type ImageAsset = {
  url: string;
  width: number;
  height: number;
};

export type ContactLink = {
  label: string;
  value: string;
  href?: string;
};

export type CaseStudy = {
  title: string;
  detail: string;
};

export type About = {
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  revisedAt?: string;
  name: string;
  summary: string[];
  background: string[];
  skills: string[];
  caseStudies: CaseStudy[];
  valueStatement: string;
  contacts: ContactLink[];
  message: string;
  icon?: ImageAsset;
};

export type Project = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  description: string;
  mainVisual?: ImageAsset;
  date?: string;
  genre?: string[];
  skill?: string[];
  images?: ImageAsset[];
  url?: string;
  github?: string;
};

export type Service = {
  id: string;
  title: string;
  catchphrase: string;
  problem: string;
  solution: string;
  benefit: string;
  image?: ImageAsset;
  relatedProjectIds: string[];
};

export type Point = {
  title: string;
  description: string;
};

export type BusinessPageData = {
  pageTitle: string;
  subTitle: string;
  heroImage: string;
  lead: string;
  points: Point[];
  services: Service[];
  contactMessage: string;
};

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content');
const ABOUT_PATH = path.join(CONTENT_ROOT, 'about.yml');
const BUSINESS_PATH = path.join(CONTENT_ROOT, 'business.yml');
const PROJECTS_DIR = path.join(CONTENT_ROOT, 'projects');

const ensureFileExists = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Content file not found: ${filePath}`);
  }
};

const readYaml = <T>(filePath: string): T => {
  ensureFileExists(filePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  return loadYaml(raw) as T;
};

const loadProjects = (): Project[] => {
  if (!fs.existsSync(PROJECTS_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith('.yml') || file.endsWith('.yaml'));

  const projects = files.map((file) => readYaml<Project>(path.join(PROJECTS_DIR, file)));

  return projects.sort((a, b) => {
    const getTime = (value?: string) => (value ? new Date(value).getTime() : 0);
    return getTime(b.date) - getTime(a.date);
  });
};

const aboutData = readYaml<About>(ABOUT_PATH);
const businessData = fs.existsSync(BUSINESS_PATH) ? readYaml<BusinessPageData>(BUSINESS_PATH) : undefined;
const projectsData = loadProjects();

export const about: About = aboutData;
export const projects: Project[] = projectsData;

export const getAbout = async (): Promise<About> => aboutData;

export const getBusinessPageData = async (): Promise<BusinessPageData | undefined> => businessData;

export const getProjects = async (): Promise<Project[]> => projectsData;

export const getProjectById = async (id: string): Promise<Project | undefined> =>
  projectsData.find((project) => project.id === id);
