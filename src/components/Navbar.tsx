
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const navigateToAuth = () => {
    navigate("/auth");
    setIsMenuOpen(false);
  };

  return (
    <nav className="py-4 px-6 md:px-12 lg:px-24 w-full fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-primary">BudgetSplit</Link>
        </div>
        
        <div className="hidden md:flex justify-center absolute left-0 right-0 mx-auto">
          <div className="space-x-8 items-center">
            <a href="#features" className="text-gray-700 hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors">How it Works</a>
            <a href="#demo" className="text-gray-700 hover:text-primary transition-colors">Demo</a>
            {user && (
              <Link to="/dashboard" className="text-gray-700 hover:text-primary transition-colors">Dashboard</Link>
            )}
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <Button onClick={handleSignOut} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              Sign Out
            </Button>
          ) : (
            <Button 
              onClick={navigateToAuth} 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              Login
            </Button>
          )}
          {!user && (
            <Button onClick={() => navigate("/auth?tab=signup")}>Get Started</Button>
          )}
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
        <div className="md:hidden absolute left-0 right-0 mt-4 mx-6 py-4 bg-white rounded-md shadow-lg border border-gray-100">
          <div className="flex flex-col space-y-4 px-4">
            <a href="#features" className="text-gray-700 hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors">How it Works</a>
            <a href="#demo" className="text-gray-700 hover:text-primary transition-colors">Demo</a>
            {user && (
              <Link to="/dashboard" className="text-gray-700 hover:text-primary transition-colors">Dashboard</Link>
            )}
            {user ? (
              <Button onClick={handleSignOut} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full">
                Sign Out
              </Button>
            ) : (
              <Button 
                onClick={navigateToAuth} 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
              >
                Login
              </Button>
            )}
            {!user && (
              <Button onClick={() => { navigate("/auth?tab=signup"); setIsMenuOpen(false); }} className="w-full">
                Get Started
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
