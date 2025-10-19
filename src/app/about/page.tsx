import Image from 'next/image';
import { getAbout } from '@/lib/content';

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
      <section className="rounded-3xl border border-gray-100 bg-white/80 p-10 shadow-sm backdrop-blur dark:border-gray-700/60 dark:bg-gray-900/70">
        <div className="grid gap-10 md:grid-cols-[minmax(0,240px),1fr]">
          {about.icon && (
            <Image
              src={about.icon.url}
              alt={about.name}
              width={about.icon.width}
              height={about.icon.height}
              className="mx-auto h-48 w-48 rounded-3xl object-cover md:mx-0 md:h-60 md:w-60"
              priority
            />
          )}

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-blue-500 dark:text-blue-300">
                Profile
              </p>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{about.name}</h1>
            </div>

            <div className="grid gap-4 text-base leading-relaxed text-gray-700 dark:text-gray-200">
              {about.summary.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <article className="rounded-3xl border border-gray-100 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-gray-700/60 dark:bg-gray-900/70">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
            Background
          </h2>
          <h3 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">歩んできた道</h3>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-200">
            {about.background.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-gray-100 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-gray-700/60 dark:bg-gray-900/70">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
            Value
          </h2>
          <h3 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">提供できる価値</h3>
          <p className="mt-5 text-base leading-relaxed text-gray-700 dark:text-gray-200">
            {about.valueStatement}
          </p>

          <dl className="mt-8 grid gap-5 rounded-2xl border border-gray-100 bg-gray-50/80 p-6 text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-200">
            {about.contacts.map((contact) => (
              <div key={contact.label} className="space-y-1">
                <dt className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  {contact.label}
                </dt>
                <dd>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="font-semibold text-blue-600 hover:underline dark:text-blue-300"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <span className="font-semibold">{contact.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </article>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills & Tools</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              イマーシブ体験の実装に直結する実務スキル
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-gray-700/60 dark:bg-gray-900/70">
          <ul className="grid gap-3 text-base leading-relaxed text-gray-700 dark:text-gray-200 sm:grid-cols-2">
            {about.skills.map((skill) => (
              <li key={skill} className="rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Case Studies</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            代表的なイマーシブコンテンツと貢献内容
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {about.caseStudies.map((study) => (
            <article
              key={study.title}
              className="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900/70"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {study.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {study.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="rounded-3xl border border-blue-100 bg-blue-50/80 p-8 text-center shadow-sm backdrop-blur dark:border-blue-900/50 dark:bg-blue-900/20">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-200">
            Let&apos;s Build Immersive Experiences Together
          </h2>
          <p className="mt-3 text-base leading-relaxed text-blue-800 dark:text-blue-100">
            {about.message}
          </p>
        </div>
      </section>
    </div>
  );
}
