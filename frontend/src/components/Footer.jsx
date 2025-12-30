import { Plane } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-primary-500 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Plane className="w-6 h-6" />
              <span className="text-xl font-bold">TravelBook</span>
            </div>
            <p className="text-sm text-gray-300">
              Find the best deals on hotels, flights, and attractions for your next adventure.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Safety Information</a></li>
              <li><a href="#" className="hover:text-white">Cancellation Options</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-400 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2024 TravelBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
