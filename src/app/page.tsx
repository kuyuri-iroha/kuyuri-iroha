import { getProjects, getAbout } from '@/lib/microcms';
import ProjectCard from '@/components/ProjectCard';
import Image from 'next/image';
import parse from 'html-react-parser';

export default async function Home() {
  const projects = await getProjects();
  const about = await getAbout();
  
  // デバッグ用：プロジェクトデータをコンソールに出力
  console.log('Projects data:', JSON.stringify(projects, null, 2));

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <section className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Kuyuri Iroha</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            ポートフォリオサイトへようこそ
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 border-b pb-2">自己紹介</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {about.icon && (
              <div className="w-48 h-48 relative rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={about.icon.url}
                  alt={about.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 192px"
                  priority
                  className="object-cover"
                />
              </div>
            )}
            
            <div>
              <h3 className="text-xl font-bold mb-4">{about.name}</h3>
              
              <div className="prose dark:prose-invert max-w-none">
                {typeof about.description === 'string' ? parse(about.description) : about.description}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-8 border-b pb-2">プロジェクト</h2>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-center py-12 text-gray-500">
            プロジェクトがありません
          </p>
        )}
      </section>
    </div>
  );
}
