import { getBusinessPageData, getProjects } from '@/lib/content';
import Image from 'next/image';
import Link from 'next/link';

export default async function BusinessPage() {
  const [data, allProjects] = await Promise.all([
    getBusinessPageData(),
    getProjects(),
  ]);

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">コンテンツを読み込めませんでした。</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-40">
          {data.heroImage && (
            <Image
              src={data.heroImage}
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            {data.pageTitle}
          </h1>
          <p className="mt-6 text-xl font-medium text-blue-200 md:text-2xl">
            {data.subTitle}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Philosophy / Introduction */}
        <section className="mb-24 text-center">
          <p className="mx-auto max-w-3xl text-2xl font-bold leading-relaxed text-slate-800 dark:text-slate-100">
            {data.lead}
          </p>
          
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {data.points.map((point) => (
              <div key={point.title} className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-900">
                <h3 className="mb-4 text-xl font-bold text-blue-600 dark:text-blue-400">
                  {point.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Services / Products */}
        <section className="space-y-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              解決策のご提案
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              御社のビジネス課題に合わせて、最適なソリューションを提供します
            </p>
          </div>

          {data.services.map((service, index) => {
            const relatedProjects = allProjects.filter((p) =>
              service.relatedProjectIds?.includes(p.id)
            );

            return (
              <div 
                key={service.id} 
                className={`flex flex-col gap-12 overflow-hidden rounded-3xl bg-white shadow-lg dark:bg-slate-900 md:flex-row ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="relative h-64 w-full md:h-auto md:w-1/2">
                  <Image
                    src={service.image.url}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12">
                  <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-2xl font-bold leading-tight text-slate-900 dark:text-white">
                      {service.catchphrase}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
                      <p className="text-sm font-bold text-red-600 dark:text-red-400">課題</p>
                      <p className="mt-1 text-slate-700 dark:text-slate-300">{service.problem}</p>
                    </div>
                    
                    <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">解決策</p>
                      <p className="mt-1 text-slate-700 dark:text-slate-300">{service.solution}</p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">導入メリット</p>
                      <p className="text-slate-600 dark:text-slate-400">{service.benefit}</p>
                    </div>

                    {relatedProjects.length > 0 && (
                      <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
                        <p className="mb-4 text-sm font-bold text-slate-500 dark:text-slate-400">
                          関連実績
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          {relatedProjects.map((project) => (
                            <Link
                              key={project.id}
                              href={`/projects/${project.id}`}
                              className="group block"
                            >
                              <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-100">
                                {project.mainVisual && (
                                  <Image
                                    src={project.mainVisual.url}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                  />
                                )}
                              </div>
                              <p className="mt-2 text-xs font-bold text-slate-700 line-clamp-2 group-hover:text-blue-600 dark:text-slate-300">
                                {project.title}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* CTA */}
        <section className="mt-32 rounded-3xl bg-blue-600 px-6 py-16 text-center text-white">
          <h2 className="text-3xl font-bold">お問い合わせ</h2>
          <p className="mx-auto mt-6 max-w-2xl whitespace-pre-wrap text-lg text-blue-100">
            {data.contactMessage}
          </p>
          <div className="mt-10">
            <a 
              href="mailto:kuyuri.iroha@gmail.com"
              className="inline-block rounded-full bg-white px-8 py-4 font-bold text-blue-600 transition-colors hover:bg-blue-50"
            >
              相談してみる
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
