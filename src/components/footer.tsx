import { ConnectButton } from '@/components/connect-button';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className=" py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/jonathangus/based-helper"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-gray-600"
            >
              GitHub
            </Link>
            <Link
              href="https://x.com/based_helper"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-gray-600"
            >
              Twitter
            </Link>
            <Link
              href="https://hey.xyz/u/based_helper"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-gray-600"
            >
              Lens
            </Link>
          </div>

          <ConnectButton linkPage />
        </div>
      </div>
    </footer>
  );
}
