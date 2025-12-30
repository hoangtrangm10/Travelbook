import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Hotel, Plane, Car, Camera, AlertCircle } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import HotelCard from '../components/HotelCard';
import TransportCard from '../components/TransportCard';
import LocalTransportCard from '../components/LocalTransportCard';
import AttractionCard from '../components/AttractionCard';
import PriceSummary from '../components/PriceSummary';
import LoadingSpinner from '../components/LoadingSpinner';
import AITripRecommendation from '../components/AITripRecommendation';
import { searchTravel } from '../services/api';

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('hotels');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedLocalTransport, setSelectedLocalTransport] = useState(null);
  const [selectedAttractions, setSelectedAttractions] = useState([]);

  const searchData = {
    origin: searchParams.get('origin') || '',
    destination: searchParams.get('destination') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    people: parseInt(searchParams.get('people') || '2'),
    rooms: parseInt(searchParams.get('rooms') || '1'),
    budget: searchParams.get('budget') || '',
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchData.destination) {
        setError('Please enter a destination');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await searchTravel(searchData);
        setResults(data);
        
        // Set default selections
        if (data.hotels?.length > 0) {
          setSelectedHotel(data.hotels[0]);
        }
        if (data.transports?.length > 0) {
          setSelectedTransport(data.transports[0]);
        }
        if (data.local_transports?.length > 0) {
          setSelectedLocalTransport(data.local_transports[0]);
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to fetch travel recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams.toString()]);

  const toggleAttraction = (attraction) => {
    setSelectedAttractions((prev) => {
      const exists = prev.find((a) => a.id === attraction.id);
      if (exists) {
        return prev.filter((a) => a.id !== attraction.id);
      }
      return [...prev, attraction];
    });
  };

  const nights = results?.summary?.trip_details?.nights || 1;

  const tabs = [
    { id: 'hotels', label: 'Hotels', icon: Hotel, count: results?.hotels?.length || 0 },
    { id: 'transport', label: 'Getting There', icon: Plane, count: results?.transports?.length || 0 },
    { id: 'local', label: 'Getting Around', icon: Car, count: results?.local_transports?.length || 0 },
    { id: 'attractions', label: 'Attractions', icon: Camera, count: results?.attractions?.length || 0 },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-primary-500 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <SearchForm initialValues={searchData} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <LoadingSpinner message={`Searching for trips to ${searchData.destination}...`} />
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {results && !loading && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Travel to {results.summary?.destination?.name || searchData.destination}
                </h1>
                <p className="text-gray-600">
                  {results.summary?.trip_details?.nights} nights · {results.summary?.trip_details?.people} guests · {results.summary?.trip_details?.rooms} room(s)
                </p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-500'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-sm">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Hotels Tab */}
              {activeTab === 'hotels' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {results.hotels?.length || 0} hotels found
                  </h2>
                  {results.hotels?.map((hotel, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedHotel(hotel)}
                      className={`cursor-pointer rounded-lg transition-all ${
                        selectedHotel?.id === hotel.id
                          ? 'ring-2 ring-primary-500'
                          : ''
                      }`}
                    >
                      <HotelCard
                        hotel={hotel}
                        nights={nights}
                        rooms={searchData.rooms}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Transport Tab - Getting There (Inter-city) */}
              {activeTab === 'transport' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Getting to {results.summary?.destination?.name || searchData.destination}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {results.transports?.length || 0} options from {searchData.origin || 'your city'}
                    </p>
                  </div>
                  {results.transports?.map((transport, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedTransport(transport)}
                      className={`cursor-pointer rounded-lg transition-all ${
                        selectedTransport?.id === transport.id
                          ? 'ring-2 ring-primary-500'
                          : ''
                      }`}
                    >
                      <TransportCard
                        transport={transport}
                        people={searchData.people}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Local Transport Tab - Getting Around */}
              {activeTab === 'local' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Getting around in {results.summary?.destination?.name || searchData.destination}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {results.local_transports?.length || 0} local transport options for {nights} days
                    </p>
                  </div>
                  {results.local_transports?.map((transport, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedLocalTransport(transport)}
                      className={`cursor-pointer rounded-lg transition-all ${
                        selectedLocalTransport?.id === transport.id
                          ? 'ring-2 ring-primary-500'
                          : ''
                      }`}
                    >
                      <LocalTransportCard
                        transport={transport}
                        nights={nights}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Attractions Tab */}
              {activeTab === 'attractions' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {results.attractions?.length || 0} things to do
                    </h2>
                    {selectedAttractions.length > 0 && (
                      <span className="text-sm text-primary-500">
                        {selectedAttractions.length} selected
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.attractions?.map((attraction, index) => (
                      <div
                        key={index}
                        onClick={() => toggleAttraction(attraction)}
                        className={`cursor-pointer rounded-lg transition-all ${
                          selectedAttractions.find((a) => a.id === attraction.id)
                            ? 'ring-2 ring-primary-500'
                            : ''
                        }`}
                      >
                        <AttractionCard
                          attraction={attraction}
                          people={searchData.people}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Price Summary & AI Trip */}
            <div className="lg:w-80 space-y-4 lg:sticky lg:top-4 lg:self-start">
              <PriceSummary
                summary={results.summary}
                selectedHotel={selectedHotel}
                selectedTransport={selectedTransport}
                selectedLocalTransport={selectedLocalTransport}
                selectedAttractions={selectedAttractions}
                userBudget={searchData.budget ? parseInt(searchData.budget) : 0}
              />
              
              {/* AI Trip Plan Button - Under Price Summary */}
              <AITripRecommendation searchData={searchData} results={results} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResultsPage;
