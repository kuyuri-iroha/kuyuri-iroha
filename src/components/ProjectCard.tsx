import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/lib/content';

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block h-full"
    >
      <div className="glass-panel rounded-2xl overflow-hidden h-full hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/5 flex flex-col">
        <div className="relative h-56 w-full overflow-hidden">
          {project.mainVisual ? (
            <Image
              src={project.mainVisual.url}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <span className="text-gray-600 font-mono">NO VISUAL</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-80" />

          <div className="absolute bottom-4 left-4 right-4">
            {project.genre && project.genre.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {project.genre.slice(0, 2).map((g) => (
                  <span
                    key={g}
                    className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-white/10 text-white backdrop-blur rounded border border-white/10"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
            <h3 className="text-xl font-bold text-white leading-tight group-hover:text-gray-300 transition-colors">
              {project.title}
            </h3>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 font-mono">
            <span>{project.date ? new Date(project.date).getFullYear() : '---'}</span>
            <span>/</span>
            <span className="truncate max-w-[150px]">{project.company}</span>
          </div>

          <p className="text-sm text-gray-400 line-clamp-3 mb-4 leading-relaxed flex-grow">
            {project.description.replace(/<\/?[^>]+(>|$)/g, "")}
          </p>

          <div className="pt-4 border-t border-white/5 mt-auto">
            <div className="flex flex-wrap gap-2">
              {project.role && project.role.slice(0, 1).map(r => (
                <span key={r} className="text-xs text-white/50 border border-white/10 px-2 py-0.5 rounded flex items-center bg-white/5 font-medium">
                  {r}
                </span>
              ))}
              {project.skill && project.skill.length > 0 && (
                <>
                  <span className="text-gray-600 text-xs">•</span>
                  <span className="text-xs text-gray-500">
                    {project.skill.slice(0, 2).join(', ')}
                    {project.skill.length > 2 && '...'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
