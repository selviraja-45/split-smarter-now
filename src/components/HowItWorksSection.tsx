
const steps = [
  {
    number: 1,
    title: "Create/Join a Group",
    description: "Invite friends using a simple code.",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=500",
  },
  {
    number: 2,
    title: "Add Expenses",
    description: "Select who paid and who participated. Upload the bill.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=500",
  },
  {
    number: 3,
    title: "Settle Easily",
    description: "We'll show the optimized payment plan.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=500",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Split expenses in just three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step connector line - visible on all screens now */}
              {index < steps.length - 1 && (
                <div className="flex absolute top-24 left-[52%] w-[120%] h-[2px] items-center">
                  <div className="w-full border-t-3 border-dashed border-gray-300"></div>
                  <div className="absolute right-0 w-3 h-3 rounded-full bg-primary -mt-1.5"></div>
                </div>
              )}
              
              <div className="flex flex-col items-center text-center">
                {/* Step number */}
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-6 z-10">
                  {step.number}
                </div>
                
                {/* Illustration */}
                <div className="bg-gray-100 w-48 h-48 rounded-full flex items-center justify-center mb-6 overflow-hidden">
                  <img 
                    src={step.image} 
                    alt={`Step ${step.number}: ${step.title}`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                {/* Text content */}
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
