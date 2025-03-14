import { HomePageView } from '@/components/home-page-view';

export const metadata = {
  title: 'Based Helper',
  image: '/og-image.png',
  description:
    'Based Helper is a smart token allocation tool that helps you allocate your ETH into trending tokens we think looking juicy',
};

export default function Home() {
  return <HomePageView />;
}
