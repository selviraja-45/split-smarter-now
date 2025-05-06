
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="py-4 px-6 md:px-12 lg:px-24 w-full absolute top-0 left-0 right-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-bold text-primary">SplitSmarter</span>
        </div>
        
        <div className="hidden md:flex space-x-8 items-center">
          <a href="#features" className="text-gray-700 hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors">How it Works</a>
          <a href="#demo" className="text-gray-700 hover:text-primary transition-colors">Demo</a>
          <Button>Get Started</Button>
        </div>
        
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-primary focus:outline-none"
          >
            {!isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden mt-4 py-4 bg-white rounded-md shadow-lg">
          <div className="flex flex-col space-y-4 px-4">
            <a href="#features" className="text-gray-700 hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors">How it Works</a>
            <a href="#demo" className="text-gray-700 hover:text-primary transition-colors">Demo</a>
            <Button className="w-full">Get Started</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
