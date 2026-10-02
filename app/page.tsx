import About from '@/components/About';
import Cursor from '@/components/Cursor';
import Cta from '@/components/Cta';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Loader from '@/components/Loader';
import Since from '@/components/Since';
import SmoothScroll from '@/components/SmoothScroll';
import Work from '@/components/Work';

export default function Home() {
  return (
    <>
      <Loader />
      <div className="frame" aria-hidden="true" />
      <SmoothScroll />
      <Cursor />
      <div id="top" />
      <Header />
      <main>
        <Hero />
        <About />
        <Work />
        <Since />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
