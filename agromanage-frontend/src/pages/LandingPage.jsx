import NavbarComponent from '../components/NavbarComponent';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import CultureSection from '../components/CultureSection';
import HelpSection from '../components/HelpSection';
import BenefitsSection from '../components/BenefitsSection';
import PlansSection from '../components/PlansSection';
import Footer from '../components/Footer';

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