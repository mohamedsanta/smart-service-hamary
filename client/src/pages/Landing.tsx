import { Header } from '../components/shared/Header';
import { Hero } from '../components/landing/Hero';
import { WhyHamary } from '../components/landing/WhyHamary';
import { Journey } from '../components/landing/Journey';
import { Pricing } from '../components/landing/Pricing';
import { BookingForm } from '../components/landing/BookingForm';
import { TrustSection } from '../components/landing/TrustSection';
import { FAQ } from '../components/landing/FAQ';
import { Footer } from '../components/landing/Footer';

export default function Landing() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhyHamary />
        <Journey />
        <Pricing />
        <BookingForm />
        <TrustSection />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
