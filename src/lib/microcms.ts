import { createClient } from 'microcms-js-sdk';

// microCMSのクライアントを作成
export const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN || 'kuyuri-iroha',
  apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY || '',
});

// APIキーが設定されていない場合のエラーチェック
if (typeof process !== 'undefined' && !process.env.NEXT_PUBLIC_MICROCMS_API_KEY) {
  console.warn('Warning: NEXT_PUBLIC_MICROCMS_API_KEY is not set in environment variables');
}

// 型定義
export type About = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
  description: string;
  icon?: {
    url: string;
    width: number;
    height: number;
  };
};

export type Project = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  description: string;
  mainVisual?: {
    url: string;
    width: number;
    height: number;
  };
  date?: string;
  genre?: string[];
  skill?: string[];
  images?: {
    url: string;
    width: number;
    height: number;
  }[];
  url?: string;
  github?: string;
};

// aboutの取得
export const getAbout = async () => {
  try {
    const data = await client.get<About>({
      endpoint: 'about',
    });
    return data;
  } catch (error) {
    console.error('Error fetching about data:', error);
    throw error;
  }
};

// projectsの取得（一覧）
export const getProjects = async (limit: number = 100) => {
  try {
    const data = await client.get<{ contents: Project[] }>({
      endpoint: 'projects',
      queries: {
        limit: limit,
        orders: '-date' // 日付の降順（新しい順）でソート
      },
    });
    return data.contents;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// projectの取得（詳細）
export const getProjectById = async (id: string) => {
  try {
    const data = await client.get<Project>({
      endpoint: 'projects',
      contentId: id,
    });
    return data;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    throw error;
  }
};