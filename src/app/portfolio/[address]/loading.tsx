import { Spinner } from '@/components/spinner';

export default function LoadingPage() {
  return (
    <div className="flex flex-row items-center gap-6 justify-center h-screen">
      <p>Loading...</p>
      <Spinner />
    </div>
  );
}
