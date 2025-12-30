import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

function Header() {
  return (
    <header className="bg-primary-500 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Plane className="w-8 h-8" />
            <span className="text-2xl font-bold">TravelBook</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/" className="hover:text-accent-500 transition-colors">
              Hotels
            </Link>
            <Link to="/" className="hover:text-accent-500 transition-colors">
              Flights
            </Link>
            <Link to="/" className="hover:text-accent-500 transition-colors">
              Attractions
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
