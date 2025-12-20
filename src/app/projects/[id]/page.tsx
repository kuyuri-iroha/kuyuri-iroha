import Image from 'next/image';
import Link from 'next/link';
import { getProjectById, getProjects } from '@/lib/content';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    id: project.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="pb-20">
      {/* Hero Header */}
      <div className="relative h-[50vh] w-full bg-gray-900 border-b border-white/10">
        {project.mainVisual ? (
          <>
            <Image
              src={project.mainVisual.url}
              alt={project.title}
              fill
              priority
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        )}

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 mb-6 hover:text-white transition-colors uppercase tracking-widest"
          >
            ← Back to Projects
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-xl max-w-4xl leading-tight">
            {project.title}
          </h1>
          {project.genre && (
            <div className="flex flex-wrap gap-2 mb-2">
              {project.genre.map((g) => (
                <span key={g} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm text-gray-200 backdrop-blur-sm">
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid lg:grid-cols-[1fr,320px] gap-12">

          {/* Main Content */}
          <div className="space-y-12">
            <div className="glass-panel p-8 rounded-3xl">
              <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-white pl-4">Project Overview</h2>
              <div
                className="prose prose-invert prose-lg max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
            </div>

            {/* Gallery */}
            {project.images && project.images.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-l-4 border-white pl-4">Gallery</h2>
                <div className="grid gap-6">
                  {project.images.map((image, index) => (
                    <div key={index} className="relative rounded-2xl overflow-hidden border border-white/5 bg-gray-900 group">
                      <Image
                        src={image.url}
                        alt={`${project.title} shot ${index + 1}`}
                        width={image.width ?? 1920}
                        height={image.height ?? 1080}
                        className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Metadata */}
          <div className="space-y-8">
            <div className="glass-panel p-6 rounded-2xl sticky top-24">
              <h3 className="text-lg font-bold text-white mb-6 pb-2 border-b border-white/10">Project Details</h3>

              <dl className="space-y-5">
                {project.company && (
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-gray-500 mb-1">Company / Team</dt>
                    <dd className="text-white font-medium">{project.company}</dd>
                  </div>
                )}

                {project.role && project.role.length > 0 && (
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-gray-500 mb-1">Role</dt>
                    <dd className="text-white font-medium">
                      {project.role.join(', ')}
                    </dd>
                  </div>
                )}

                {project.period && (
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-gray-500 mb-1">Period</dt>
                    <dd className="text-gray-300 font-mono text-sm">
                      {project.period.start} - {project.period.end}
                    </dd>
                  </div>
                )}

                {project.teamSize && (
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-gray-500 mb-1">Team Size</dt>
                    <dd className="text-gray-300">{project.teamSize}</dd>
                  </div>
                )}

                {project.employmentType && (
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-gray-500 mb-1">Employment</dt>
                    <dd className="text-gray-300 text-sm">{project.employmentType}</dd>
                  </div>
                )}

                {project.skill && (
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-gray-500 mb-2">Tech Stack</dt>
                    <dd className="flex flex-wrap gap-2">
                      {project.skill.map(s => (
                        <span key={s} className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded border border-white/10">
                          {s}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}

                <div className="pt-6 mt-6 border-t border-white/10 flex flex-col gap-3">
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-white text-black hover:bg-gray-200 text-center rounded-xl font-bold transition-colors">
                      Visit Site
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-white/5 hover:bg-white/10 text-white text-center rounded-xl font-bold transition-colors border border-white/10">
                      GitHub
                    </a>
                  )}
                </div>
              </dl>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
