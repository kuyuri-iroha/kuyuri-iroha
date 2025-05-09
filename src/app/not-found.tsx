import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">ページが見つかりません</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
        お探しのページは存在しないか、移動または削除された可能性があります。
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
      >
        ホームに戻る
      </Link>
    </div>
  );
}