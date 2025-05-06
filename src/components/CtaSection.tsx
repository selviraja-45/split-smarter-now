
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-primary text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Splitting Smarter Today</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Join thousands of users who are already saving time and reducing money-related tension with friends and groups
        </p>
        <Button size="lg" variant="outline" className="bg-white hover:bg-gray-100 text-primary hover:text-primary border-white text-lg px-8">
          Get Started for Free
        </Button>
        <p className="mt-6 text-sm opacity-80">No ads. No fees. Just convenience.</p>
      </div>
    </section>
  );
};

export default CtaSection;
