import NavbarComponent from '../components/landing/NavbarComponent';
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import CultureSection from '../components/landing/CultureSection';
import HelpSection from '../components/landing/HelpSection';
import BenefitsSection from '../components/landing/BenefitsSection';
import PlansSection from '../components/landing/PlansSection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <NavbarComponent />
      <HeroSection />
      <AboutSection />
      <CultureSection />
      <HelpSection />
      <BenefitsSection />
      <PlansSection />
      <Footer />
    </>
  );
}