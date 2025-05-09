import Image from 'next/image';
import Link from 'next/link';
import { getProjectById, getProjects } from '@/lib/microcms';
import parse from 'html-react-parser';
import { notFound } from 'next/navigation';

// 静的パラメータの生成
export async function generateStaticParams() {
  const projects = await getProjects();
  
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    // paramsは既にオブジェクトなのでawaitする必要はない
    const project = await getProjectById(params.id);

    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-6">
          <Link href="/" className="text-blue-500 hover:underline flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            プロジェクト一覧に戻る
          </Link>
        </div>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {project.mainVisual && (
            <div className="relative h-64 w-full">
              <Image
                src={project.mainVisual.url}
                alt={project.title}
                fill
                sizes="100vw"
                priority
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
            
            {project.date && (
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {new Date(project.date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                })}
              </p>
            )}
            
            <div className="text-gray-600 dark:text-gray-300 text-lg mb-6">
              {project.description.replace(/<\/?[^>]+(>|$)/g, "")}
            </div>

            {/* ジャンル */}
            {project.genre && project.genre.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-3">ジャンル</h2>
                <div className="flex flex-wrap gap-2">
                  {project.genre.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* スキル */}
            {project.skill && project.skill.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">使用技術</h2>
                <div className="flex flex-wrap gap-2">
                  {project.skill.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mb-8">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  サイトを見る
                </a>
              )}
              
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
                >
                  GitHub
                </a>
              )}
            </div>

            {/* 画像ギャラリー */}
            {project.images && project.images.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">ギャラリー</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.images.map((image, index) => (
                    <div key={index} className="relative h-64 w-full rounded-lg overflow-hidden">
                      <Image
                        src={image.url}
                        alt={`${project.title} - 画像 ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    );
  } catch (error) {
    notFound();
  }
}