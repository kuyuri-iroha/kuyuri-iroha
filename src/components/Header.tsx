import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full py-4 px-6 md:px-12 bg-background">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Kuyuri Iroha
        </Link>
      </div>
    </header>
  );
}