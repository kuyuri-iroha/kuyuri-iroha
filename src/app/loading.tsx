export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-foreground rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">読み込み中...</p>
    </div>
  );
}