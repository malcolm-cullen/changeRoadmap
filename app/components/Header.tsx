import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b-2 border-plum">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/homechoice-logo.svg"
            alt="HomeChoice"
            width={140}
            height={17}
            priority
          />
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm text-[#333333] hover:text-plum font-medium">
            Submit Request
          </Link>
          <Link
            href="/roadmap"
            className="px-4 py-2 bg-plum text-white text-sm font-bold rounded hover:bg-plum-dark"
          >
            View Roadmap
          </Link>
        </nav>
      </div>
    </header>
  );
}
