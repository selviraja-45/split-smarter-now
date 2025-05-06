
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import DemoSection from "@/components/DemoSection";
import AudienceSection from "@/components/AudienceSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <HowItWorksSection />
      <DemoSection />
      <AudienceSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
