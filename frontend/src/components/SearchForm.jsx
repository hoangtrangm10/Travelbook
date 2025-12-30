import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, BedDouble, MapPin, Navigation, DollarSign } from 'lucide-react';
import { format, addDays } from 'date-fns';

function SearchForm({ initialValues = {} }) {
  const navigate = useNavigate();
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);

  const [formData, setFormData] = useState({
    origin: initialValues.origin || '',
    destination: initialValues.destination || '',
    checkIn: initialValues.checkIn || format(tomorrow, 'yyyy-MM-dd'),
    checkOut: initialValues.checkOut || format(nextWeek, 'yyyy-MM-dd'),
    people: initialValues.people || 2,
    rooms: initialValues.rooms || 1,
    budget: initialValues.budget || '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination.trim()) {
      alert('Please enter a destination');
      return;
    }
    setIsLoading(true);
    
    const searchParams = new URLSearchParams({
      origin: formData.origin,
      destination: formData.destination,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      people: formData.people.toString(),
      rooms: formData.rooms.toString(),
      budget: formData.budget.toString(),
    });
    
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-white rounded-xl shadow-2xl p-6">
        {/* Row 1: Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Origin - Where from */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              From
            </label>
            <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 transition-all bg-gray-50 hover:bg-white">
              <Navigation className="w-5 h-5 text-primary-500 mr-3" />
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="City or airport"
                className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400"
              />
            </div>
          </div>

          {/* Destination - Where to */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              To
            </label>
            <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 transition-all bg-gray-50 hover:bg-white">
              <MapPin className="w-5 h-5 text-primary-500 mr-3" />
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="City or airport"
                className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 2: Dates, Guests, Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Check-in Date */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Check-in
            </label>
            <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 transition-all bg-gray-50 hover:bg-white">
              <Calendar className="w-5 h-5 text-primary-500 mr-3" />
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                min={format(today, 'yyyy-MM-dd')}
                className="w-full outline-none text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          {/* Check-out Date */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Check-out
            </label>
            <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 transition-all bg-gray-50 hover:bg-white">
              <Calendar className="w-5 h-5 text-primary-500 mr-3" />
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                min={formData.checkIn}
                className="w-full outline-none text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          {/* Guests & Rooms */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Travelers & Rooms
            </label>
            <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 transition-all bg-gray-50 hover:bg-white">
              <Users className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
              <select
                name="people"
                value={formData.people}
                onChange={handleChange}
                className="outline-none text-gray-700 bg-transparent flex-1 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-gray-400 mx-1">·</span>
              <BedDouble className="w-5 h-5 text-primary-500 mx-2 flex-shrink-0" />
              <select
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                className="outline-none text-gray-700 bg-transparent flex-1 cursor-pointer"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Budget (USD)
            </label>
            <div className="flex items-center border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 transition-all bg-gray-50 hover:bg-white">
              <DollarSign className="w-5 h-5 text-primary-500 mr-3" />
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Max budget"
                min="0"
                step="1"
                className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-6 h-6" />
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default SearchForm;
