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
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-black text-white border-b border-white/10">
        <div className="absolute inset-0 opacity-40">
          {data.heroImage && (
            <Image
              src={data.heroImage}
              alt="Hero Background"
              fill
              className="object-cover grayscale"
              priority
            />
          )}
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            {data.pageTitle}
          </h1>
          <p className="mt-6 text-xl font-medium text-gray-300 md:text-2xl">
            {data.subTitle}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Philosophy / Introduction */}
        <section className="mb-24 text-center">
          <p className="mx-auto max-w-3xl text-2xl font-bold leading-relaxed text-white">
            {data.lead}
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {data.points.map((point) => (
              <div key={point.title} className="rounded-2xl bg-white/5 p-8 shadow-sm border border-white/10">
                <h3 className="mb-4 text-xl font-bold text-white">
                  {point.title}
                </h3>
                <p className="text-gray-400">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Services / Products */}
        <section className="space-y-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              解決策のご提案
            </h2>
            <p className="mt-4 text-gray-400">
              貴社のビジネス課題に合わせて、最適なソリューションを提供します
            </p>
          </div>

          {data.services.map((service) => {
            const relatedProjects = allProjects.filter((p) =>
              service.relatedProjectIds?.includes(p.id)
            );

            return (
              <div
                key={service.id}
                className="flex flex-col gap-8 overflow-hidden rounded-3xl bg-white/5 p-8 shadow-lg md:p-12 border border-white/10"
              >
                <div className="w-full">
                  <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-2xl font-bold leading-tight text-white md:text-3xl">
                      {service.catchphrase}
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl bg-white/5 p-6 border border-white/5">
                      <p className="text-sm font-bold text-gray-300">課題</p>
                      <p className="mt-2 text-gray-400">{service.problem}</p>
                    </div>

                    <div className="rounded-xl bg-white/10 p-6 border border-white/10">
                      <p className="text-sm font-bold text-white">解決策</p>
                      <p className="mt-2 text-gray-300">{service.solution}</p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-6 border border-white/5">
                      <p className="text-sm font-bold text-gray-300">導入メリット</p>
                      <p className="mt-2 text-gray-400">{service.benefit}</p>
                    </div>
                  </div>

                  {relatedProjects.length > 0 && (
                    <div className="mt-8 border-t border-white/10 pt-8">
                      <p className="mb-4 text-sm font-bold text-gray-500">
                        関連実績
                      </p>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {relatedProjects.map((project) => (
                          <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                            className="group block"
                          >
                            <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-800">
                              {project.mainVisual && (
                                <Image
                                  src={project.mainVisual.url}
                                  alt={project.title}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                />
                              )}
                            </div>
                            <p className="mt-2 text-xs font-bold text-gray-400 line-clamp-2 group-hover:text-white transition-colors">
                              {project.title}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {/* CTA */}
        <section className="mt-32 rounded-3xl bg-white text-black px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">お問い合わせ</h2>
          <p className="mx-auto mt-6 max-w-2xl whitespace-pre-wrap text-lg text-gray-600">
            {data.contactMessage}
          </p>
          <div className="mt-10">
            <a
              href="mailto:kuyuri.iroha@gmail.com"
              className="inline-block rounded-full bg-black px-8 py-4 font-bold text-white transition-colors hover:bg-gray-800"
            >
              相談してみる
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
