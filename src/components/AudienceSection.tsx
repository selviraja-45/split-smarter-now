
import { Users, Briefcase } from "lucide-react";

const audiences = [
  {
    icon: Users,
    title: "Roommates",
    description: "Track shared household expenses, bills, and groceries",
  },
  {
    icon: Users,
    title: "Friends on Trips",
    description: "Split travel costs, meals, and activities on vacations",
  },
  {
    icon: Briefcase,
    title: "Project Teammates",
    description: "Manage project expenses and team budgets",
  },
  {
    icon: Users,
    title: "Event Organizers",
    description: "Coordinate expenses for parties, gatherings and events",
  },
];

const AudienceSection = () => {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ideal For</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            SplitSmarter helps all kinds of groups manage their shared finances
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {audiences.map((audience, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <audience.icon className="text-primary w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">{audience.title}</h3>
              <p className="text-gray-600">{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
