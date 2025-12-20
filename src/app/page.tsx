import { getProjects, getAbout } from '@/lib/content';
import ProjectCard from '@/components/ProjectCard';
import Image from 'next/image';
import Link from 'next/link';
import HeroBackground from '@/components/HeroBackground';

export default async function Home() {
  const [projects, about] = await Promise.all([getProjects(), getAbout()]);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />
        <HeroBackground />

        <div className="relative z-20 text-center max-w-5xl mx-auto px-6 space-y-8">
          <div className="space-y-4">
            <p className="text-gray-400 text-sm md:text-base font-bold tracking-[0.4em] uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Technical Artist / VFX Engineer
            </p>
            <h1 className="font-bold text-white tracking-tight leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 flex flex-col items-center">
              {(() => {
                const match = about.name.match(/^(.*?)[\uff08\(](.*?)[\uff09\)]$/);
                if (match) {
                  return (
                    <>
                      <span className="text-5xl md:text-8xl">{match[1]}</span>
                      <span className="text-2xl md:text-3xl mt-2 text-gray-400 font-normal">{match[2]}</span>
                    </>
                  );
                }
                return <span className="text-5xl md:text-8xl">{about.name}</span>;
              })()}
            </h1>
          </div>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed animate-in fade-in slide-in-from-bottom+8 duration-1000 delay-200">
            イマーシブ体験を支える<br className="md:hidden" />リアルタイムVFXと演出設計。<br />
            技術と芸術の境界を溶かすエンジニアリング。
          </p>

          <div className="pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/20"
            >
              View Projects
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col md:flex-row gap-10 items-center">
            {about.icon && (
              <div className="relative shrink-0 w-32 h-32 md:w-40 md:h-40">
                <div className="absolute -inset-2 bg-gradient-to-tr from-gray-500 to-gray-700 rounded-full blur-xl opacity-40 animate-pulse"></div>
                <Image
                  src={about.icon.url}
                  alt={about.name}
                  fill
                  className="rounded-full object-cover border-2 border-white/20 relative z-10"
                />
              </div>
            )}
            <div className="text-center md:text-left space-y-4">
              <h2 className="flex flex-col items-center md:items-start font-bold text-white">
                {(() => {
                  const match = about.name.match(/^(.*?)[\uff08\(](.*?)[\uff09\)]$/);
                  if (match) {
                    return (
                      <>
                        <span className="text-2xl md:text-3xl">{match[1]}</span>
                        <span className="text-sm md:text-base mt-0.5 text-gray-400 font-normal">{match[2]}</span>
                      </>
                    );
                  }
                  return <span className="text-2xl md:text-3xl">{about.name}</span>;
                })()}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {about.summary[0]}
              </p>
              <Link href="/about" className="inline-block text-white hover:text-gray-300 font-medium border-b border-white/30 hover:border-white pb-0.5 transition-colors">
                Read full profile →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section id="projects" className="max-w-7xl mx-auto px-6">
        <div className="mb-12 flex items-end justify-between border-b border-white/10 pb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Selected Works</h2>
            <p className="text-gray-400 text-sm">Recent projects & collaborations</p>
          </div>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
            <p className="text-gray-500">プロジェクトがありません</p>
          </div>
        )}
      </section>
    </div>
  );
}
