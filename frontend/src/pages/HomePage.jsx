import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import AdvancedSearchModal from '../components/AdvancedSearchModal';
import TravelPlanModal from '../components/TravelPlanModal';
import { MapPin, Star, Plane, Hotel, Camera, Sparkles } from 'lucide-react';

const popularDestinations = [
  { name: 'Paris', country: 'France', image: 'https://picsum.photos/seed/paris/400/300', rating: 9.2 },
  { name: 'Tokyo', country: 'Japan', image: 'https://picsum.photos/seed/tokyo/400/300', rating: 9.0 },
  { name: 'New York', country: 'USA', image: 'https://picsum.photos/seed/newyork/400/300', rating: 8.8 },
  { name: 'London', country: 'UK', image: 'https://picsum.photos/seed/london/400/300', rating: 8.9 },
  { name: 'Barcelona', country: 'Spain', image: 'https://picsum.photos/seed/barcelona/400/300', rating: 8.7 },
  { name: 'Sydney', country: 'Australia', image: 'https://picsum.photos/seed/sydney/400/300', rating: 8.6 },
];

const features = [
  {
    icon: Hotel,
    title: 'Best Hotels',
    description: 'Find the perfect accommodation for any budget',
  },
  {
    icon: Plane,
    title: 'Easy Transport',
    description: 'Book flights, trains, and more in one place',
  },
  {
    icon: Camera,
    title: 'Top Attractions',
    description: 'Discover must-see places and activities',
  },
];

function HomePage() {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showTravelPlan, setShowTravelPlan] = useState(false);
  const [travelPlan, setTravelPlan] = useState(null);

  const handlePlanGenerated = (plan) => {
    setTravelPlan(plan);
    setShowAdvancedSearch(false);
    setShowTravelPlan(true);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Next Adventure
            </h1>
            <p className="text-xl text-gray-200">
              Search hotels, transport, and attractions all in one place
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <SearchForm />
          </div>

          {/* AI Advanced Search Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAdvancedSearch(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Sparkles className="w-6 h-6" />
              AI Advanced Search
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full ml-2">Powered by AI</span>
            </button>
            <p className="text-gray-200 mt-3 text-sm">
              Let our AI plan your perfect trip based on your preferences
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Popular Destinations
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((destination, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden card-hover cursor-pointer"
              >
                <div className="h-48 relative">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{destination.name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      {destination.country}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-primary-500 text-white px-2 py-1 rounded flex items-center gap-1">
                    <Star className="w-4 h-4 fill-white" />
                    {destination.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Get personalized recommendations for hotels, transport, and attractions based on your preferences.
          </p>
          <a
            href="#top"
            className="inline-block bg-accent-500 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-accent-600 transition-colors mr-4"
          >
            Search Now
          </a>
          <button
            onClick={() => setShowAdvancedSearch(true)}
            className="inline-flex items-center gap-2 bg-white text-primary-500 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Try AI Planner
          </button>
        </div>
      </section>

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onPlanGenerated={handlePlanGenerated}
      />

      {/* Travel Plan Modal */}
      <TravelPlanModal
        isOpen={showTravelPlan}
        onClose={() => setShowTravelPlan(false)}
        plan={travelPlan}
      />
    </div>
  );
}

export default HomePage;
