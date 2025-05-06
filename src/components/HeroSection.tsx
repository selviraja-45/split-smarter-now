
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Animated background blobs */}
      <div className="blob w-72 h-72 top-20 left-[10%] animate-blob opacity-70"></div>
      <div className="blob w-96 h-96 top-40 right-[15%] animate-blob animation-delay-2000 opacity-70"></div>
      <div className="blob w-72 h-72 bottom-40 left-[20%] animate-blob animation-delay-4000 opacity-70"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Split smarter. <br />
              <span className="text-primary">Spend better.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700">
              Share group expenses with ease.
            </p>
            <Button size="lg" className="text-lg px-8 py-6">
              Start Tracking Expenses
            </Button>
          </div>

          <div className="w-full lg:w-1/2 animate-float">
            {/* Mock UI for the app */}
            <div className="relative flex justify-center">
              {/* Desktop mockup */}
              <div className="hidden md:block bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 w-[90%] max-w-lg">
                <div className="bg-gray-100 p-2 flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-lg mb-1">Trip to Bali</h3>
                      <p className="text-sm text-gray-600">5 members</p>
                    </div>
                    <div className="bg-primary text-white rounded-full px-4 py-1 text-sm font-medium">Active</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Dinner at Beach Club</p>
                            <p className="text-sm text-gray-500">Paid by Alex</p>
                          </div>
                        </div>
                        <p className="font-bold">$120.50</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Taxi to Hotel</p>
                            <p className="text-sm text-gray-500">Paid by You</p>
                          </div>
                        </div>
                        <p className="font-bold">$45.00</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <p>You paid</p>
                        <p className="font-medium">$45.00</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Your share</p>
                        <p className="font-medium">$33.10</p>
                      </div>
                      <div className="flex justify-between text-primary font-medium">
                        <p>You are owed</p>
                        <p>$11.90</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mobile mockup (shown only on mobile views) */}
              <div className="md:hidden bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 w-full max-w-[280px]">
                <div className="bg-gray-100 p-2 flex items-center justify-between">
                  <div className="text-sm font-medium">9:41</div>
                  <div className="flex space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                    </svg>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                    </svg>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">Trip to Bali</h3>
                  <div className="bg-primary text-white rounded-full px-3 py-1 text-xs font-medium w-fit mb-4">Active</div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">Dinner at Beach Club</p>
                          <p className="text-xs text-gray-500">Paid by Alex</p>
                        </div>
                        <p className="font-bold text-sm">$120</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">Taxi to Hotel</p>
                          <p className="text-xs text-gray-500">Paid by You</p>
                        </div>
                        <p className="font-bold text-sm">$45</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-2">Summary</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <p>You are owed</p>
                        <p className="text-primary font-medium">$11.90</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
