import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/lib/microcms';

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        {project.mainVisual ? (
          <Image
            src={project.mainVisual.url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {project.description.replace(/<\/?[^>]+(>|$)/g, "")}
        </p>
        
        {/* ジャンル */}
        {project.genre && project.genre.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {project.genre.map((g) => (
              <span
                key={g}
                className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
              >
                {g}
              </span>
            ))}
          </div>
        )}
        
        {/* スキル */}
        {project.skill && project.skill.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.skill.map((s) => (
              <span
                key={s}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        )}
        <Link
          href={`/projects/${project.id}`}
          className="inline-block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          詳細を見る
        </Link>
      </div>
    </div>
  );
}