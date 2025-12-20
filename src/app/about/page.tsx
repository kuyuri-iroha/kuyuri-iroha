import Image from 'next/image';
import { getAbout, SkillMatrixItem } from '@/lib/content';

const LevelBadge = ({ level }: { level: SkillMatrixItem['level'] }) => {
  const styles = {
    Captivating: 'bg-white/20 text-white border-white/50',
    Experienced: 'bg-white/10 text-gray-300 border-white/20',
    Beginner: 'bg-white/5 text-gray-400 border-white/10',
    Learning: 'bg-white/5 text-gray-500 border-white/10',
    None: 'bg-transparent text-gray-600 border-gray-800',
  };

  const labels = {
    Captivating: '★ (得意)',
    Experienced: '● (経験あり)',
    Beginner: '▲ (独学/基礎)',
    Learning: '▲ (独学/基礎)',
    None: '✕',
  };

  return (
    <span className={`px-2 py-0.5 text-xs rounded border ${styles[level]}`}>
      {labels[level]}
    </span>
  );
};

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 space-y-20">
      {/* Hero Section */}
      <section className="glass-panel rounded-3xl p-10 md:p-12">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {about.icon && (
            <div className="relative shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-400 rounded-3xl blur opacity-30"></div>
              <Image
                src={about.icon.url}
                alt={about.name}
                width={about.icon.width}
                height={about.icon.height}
                className="relative h-48 w-48 rounded-3xl object-cover border border-white/10"
                priority
              />
            </div>
          )}

          <div className="space-y-6 flex-grow">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">
                Profile
              </p>
              <h1 className="font-bold text-white tracking-tight flex flex-col items-start">
                {(() => {
                  const match = about.name.match(/^(.*?)[\uff08\(](.*?)[\uff09\)]$/);
                  if (match) {
                    return (
                      <>
                        <span className="text-4xl md:text-5xl">{match[1]}</span>
                        <span className="text-xl md:text-2xl mt-1 text-gray-400 font-normal">{match[2]}</span>
                      </>
                    );
                  }
                  return <span className="text-4xl md:text-5xl">{about.name}</span>;
                })()}
              </h1>
            </div>

            <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
              {about.summary.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Hobbies */}
            {about.hobbies && about.hobbies.length > 0 && (
              <div className="pt-4 border-t border-white/10">
                <span className="text-sm text-gray-400 mr-3">HOBBIES:</span>
                {about.hobbies.map(hobby => (
                  <span key={hobby} className="inline-block mr-3 text-sm text-gray-300 font-mono">
                    #{hobby}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Skills Matrix */}
      <section>
        <div className="mb-8 pl-2 border-l-4 border-white/20">
          <h2 className="text-3xl font-bold text-white">Skill Matrix</h2>
          <p className="text-gray-400 mt-1">技術領域と習熟度</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {about.skillMatrix?.map((category) => (
            <div key={category.category} className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-white/5">
                {category.category}
              </h3>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-gray-200 text-sm">{item.name}</span>
                    <LevelBadge level={item.level} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Background & Value */}
      <div className="grid md:grid-cols-2 gap-8">
        <section className="glass-panel rounded-3xl p-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
            Background
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            {about.background.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-3xl p-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
            Value Statement
          </h2>
          <p className="text-gray-300 leading-relaxed mb-8">
            {about.valueStatement}
          </p>

          <div className="space-y-3">
            {about.contacts.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              >
                <span className="text-sm text-gray-400">{contact.label}</span>
                <span className="text-white font-mono">{contact.value}</span>
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* Case Studies */}
      <section>
        <div className="mb-8 pl-2 border-l-4 border-white/20">
          <h2 className="text-3xl font-bold text-white">Case Studies</h2>
          <p className="text-gray-400 mt-1">代表的な実績</p>
        </div>

        <div className="grid gap-6 py-4">
          {about.caseStudies.map((study) => (
            <div
              key={study.title}
              className="glass-panel rounded-2xl p-6 transition-all hover:bg-white/5"
            >
              <h3 className="text-xl font-bold text-white mb-2">{study.title}</h3>
              <p className="text-gray-400">{study.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
