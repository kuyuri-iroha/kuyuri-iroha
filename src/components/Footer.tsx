export default function Footer() {
  return (
    <footer className="w-full py-6 px-6 md:px-12 bg-background border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Kuyuri Iroha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}