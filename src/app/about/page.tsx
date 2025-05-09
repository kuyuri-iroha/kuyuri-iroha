import Image from 'next/image';
import { getAbout } from '@/lib/microcms';
import parse from 'html-react-parser';

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">自己紹介</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {about.icon && (
            <div className="w-48 h-48 relative rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={about.icon.url}
                alt={about.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div>
            <h2 className="text-2xl font-bold mb-4">{about.name}</h2>
            
            <div className="prose dark:prose-invert max-w-none">
              {typeof about.description === 'string' ? parse(about.description) : about.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}