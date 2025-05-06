
const screenshots = [
  {
    title: "Adding an Expense",
    image: "/placeholder.svg",
    description: "Enter payment details and split among participants",
  },
  {
    title: "Settlement Breakdown",
    image: "/placeholder.svg",
    description: "See who owes whom with optimized transfers",
  },
  {
    title: "Bill Upload",
    image: "/placeholder.svg",
    description: "Attach receipts to expenses for transparency",
  },
  {
    title: "Expense Analysis",
    image: "/placeholder.svg",
    description: "Visualize spending patterns with interactive charts",
  },
];

const DemoSection = () => {
  return (
    <section id="demo" className="py-24 px-6 md:px-12 lg:px-24 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See It In Action</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how SplitSmarter makes expense tracking effortless
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {screenshots.map((item, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="h-60 bg-gray-200 relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
