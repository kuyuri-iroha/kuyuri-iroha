import { getProjects, getAbout } from '@/lib/content';
import ProjectCard from '@/components/ProjectCard';
import Image from 'next/image';

export default async function Home() {
  const [projects, about] = await Promise.all([getProjects(), getAbout()]);

  // デバッグ用：プロジェクトデータをコンソールに出力
  console.log('Projects data:', JSON.stringify(projects, null, 2));

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      <section className="text-center mb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Kuyuri Iroha</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            イマーシブ体験を支えるリアルタイムVFXと演出設計
          </p>
        </div>
      </section>

      <section className="mb-16">
        <div className="rounded-3xl border border-gray-100 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-gray-700/60 dark:bg-gray-900/70">
          <div className="grid gap-10 md:grid-cols-[minmax(0,220px),1fr]">
            {about.icon && (
              <Image
                src={about.icon.url}
                alt={about.name}
                width={about.icon.width}
                height={about.icon.height}
                className="mx-auto h-40 w-40 rounded-3xl object-cover md:mx-0 md:h-48 md:w-48"
                priority
              />
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{about.name}</h3>
              </div>

              <div className="space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-200">
                {about.summary.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <dl className="grid gap-4 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
                {about.contacts.map((contact) => (
                  <div key={contact.label} className="space-y-1">
                    <dt className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                      {contact.label}
                    </dt>
                    <dd>
                      {contact.href ? (
                        <a
                          href={contact.href}
                          className="font-medium text-blue-600 hover:underline dark:text-blue-300"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <span className="font-medium">{contact.value}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">プロジェクト</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Recent works & collaborations
          </span>
        </div>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-gray-500 dark:text-gray-400">
            プロジェクトがありません
          </p>
        )}
      </section>
    </div>
  );
}
