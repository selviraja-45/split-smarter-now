
import { Users, DollarSign, Receipt, Globe, ChartBar, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Users,
    title: "Group-Based Tracking",
    description: "Organize expenses per group with simple invite codes.",
  },
  {
    icon: DollarSign,
    title: "Smart Settlements",
    description: "We'll tell you who owes whom with minimal transfers.",
  },
  {
    icon: Receipt,
    title: "Bill Image Uploads",
    description: "Upload receipts for better transparency and record-keeping.",
  },
  {
    icon: Globe,
    title: "Multi-Currency Support",
    description: "Convert & split expenses across currencies effortlessly.",
  },
  {
    icon: ChartBar,
    title: "Visual Insights",
    description: "Interactive charts to see where the money went.",
  },
  {
    icon: Bell,
    title: "Notifications & Reminders",
    description: "Stay updated with real-time notifications and monthly summaries.",
  },
];

const FeatureSection = () => {
  return (
    <section id="features" className="py-24 px-6 md:px-12 lg:px-24 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to track and split expenses without the headache
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="feature-card border border-gray-200 shadow-md hover:shadow-xl">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                  <feature.icon className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
