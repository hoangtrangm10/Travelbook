import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, MapPin, Calendar, Users, DollarSign, Clock, Loader2, RefreshCw, X, Hotel, Plane } from 'lucide-react';
import { generateAITravelPlan } from '../services/api';

function AITripRecommendation({ searchData, results }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState(null);
  const [error, setError] = useState(null);

  // Calculate number of days from search data
  const calculateDays = () => {
    if (searchData.checkIn && searchData.checkOut) {
      const checkIn = new Date(searchData.checkIn);
      const checkOut = new Date(searchData.checkOut);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    }
    return 3; // Default to 3 days
  };

  // Calculate estimated budget based on results
  const estimateBudget = () => {
    if (searchData.budget) {
      return parseInt(searchData.budget);
    }
    
    let budget = 0;
    const nights = calculateDays();
    const people = searchData.people || 2;
    
    // Estimate from hotels
    if (results?.hotels?.[0]) {
      budget += results.hotels[0].price_per_night * nights;
    } else {
      budget += 150 * nights; // Default hotel cost
    }
    
    // Estimate from transport
    if (results?.transports?.[0]) {
      budget += results.transports[0].price_per_person * people;
    } else {
      budget += 300 * people; // Default transport cost
    }
    
    // Add buffer for attractions and food
    budget += 100 * nights * people;
    
    return Math.ceil(budget);
  };

  const generatePlan = async () => {
    if (!searchData.destination) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if user explicitly set a budget
      const userSetBudget = searchData.budget && parseInt(searchData.budget) > 0;
      const budget = userSetBudget ? parseInt(searchData.budget) : estimateBudget();
      
      const planData = {
        origin: searchData.origin || 'Your City',
        destination: searchData.destination,
        travel_type: 'culture,food', // Default to culture and food
        hotel_preference: 'mid-range',
        num_days: calculateDays(),
        num_people: searchData.people || 2,
        budget: budget,
        user_set_budget: userSetBudget, // Flag to indicate if user explicitly set budget
      };
      
      console.log('Generating AI trip plan:', planData);
      const result = await generateAITravelPlan(planData);
      
      if (result && result.success) {
        setTripPlan(result.plan);
      } else {
        setError('Unable to generate recommendations');
      }
    } catch (err) {
      console.error('AI Plan generation error:', err);
      setError('Failed to generate AI recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    setIsOpen(true);
    if (!tripPlan && !isLoading) {
      generatePlan();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!searchData.destination) return null;

  // Show button when not open - styled as a card to match PriceSummary
  if (!isOpen) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-500" />
          AI Trip Planner
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Get a personalized itinerary with recommended activities, timing, and tips for your {searchData.destination} trip.
        </p>
        <button
          onClick={handleButtonClick}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg py-3 px-4 font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="w-5 h-5" />
          Generate AI Trip Plan
        </button>
      </div>
    );
  }

  // Show LARGE modal when open
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4 text-white">
            <div className="p-3 bg-white/20 rounded-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-bold text-2xl">AI Trip Recommendation</h2>
              <p className="text-primary-100 text-lg">
                Smart itinerary for your {searchData.destination} trip
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-3 hover:bg-white/10 rounded-xl transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-16 h-16 text-primary-500 animate-spin mb-4" />
              <p className="text-gray-600 text-xl">Creating your personalized trip plan...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="text-center py-16">
              <p className="text-red-500 text-xl mb-4">{error}</p>
              <button
                onClick={generatePlan}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-lg font-medium"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            </div>
          )}

          {tripPlan && !isLoading && (
            <div className="space-y-6">
              {/* Budget Warning */}
              {tripPlan.budget_exceeded && tripPlan.budget_warning && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-red-800 mb-1">
                        ⚠️ Budget Exceeded
                      </h3>
                      <p className="text-red-700 mb-2">
                        {tripPlan.budget_warning.message}
                      </p>
                      <p className="text-red-600 text-sm mb-3">
                        {tripPlan.budget_warning.suggestion}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg">
                          Your Budget: <strong>${tripPlan.budget?.toLocaleString()}</strong>
                        </span>
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg">
                          Trip Cost: <strong>${tripPlan.budget_warning.required_budget?.toLocaleString()}</strong>
                        </span>
                        <span className="px-3 py-1 bg-red-200 text-red-800 rounded-lg font-semibold">
                          Over by: ${tripPlan.budget_warning.over_amount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Trip Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <MapPin className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-bold text-lg">{tripPlan.destination}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Calendar className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-bold text-lg">{tripPlan.num_days} Days</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Users className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Travelers</p>
                  <p className="font-bold text-lg">{tripPlan.num_people} People</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <DollarSign className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Est. Budget</p>
                  <p className="font-bold text-lg">${tripPlan.budget?.toLocaleString()}</p>
                </div>
              </div>

              {/* Accommodation Details */}
              {tripPlan.accommodation && (
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <h3 className="font-bold text-xl text-blue-900 mb-4 flex items-center gap-2">
                    <Hotel className="w-6 h-6 text-blue-600" />
                    Your Accommodation
                  </h3>
                  <div className="flex flex-col md:flex-row gap-4">
                    {tripPlan.accommodation.image && (
                      <div className="md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={tripPlan.accommodation.image} 
                          alt={tripPlan.accommodation.hotel_name}
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900 mb-2">
                        {tripPlan.accommodation.hotel_name}
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        {tripPlan.accommodation.stars && (
                          <span className="text-yellow-500">
                            {'★'.repeat(tripPlan.accommodation.stars)}
                          </span>
                        )}
                        {tripPlan.accommodation.rating > 0 && (
                          <span className="text-sm bg-blue-600 text-white px-2 py-0.5 rounded">
                            {tripPlan.accommodation.rating}/10
                          </span>
                        )}
                        <span className="text-sm text-gray-500 capitalize">
                          {tripPlan.accommodation.hotel_type} hotel
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-gray-500">Check-in</p>
                          <p className="font-semibold text-green-600">{tripPlan.accommodation.check_in_time}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-gray-500">Check-out</p>
                          <p className="font-semibold text-red-600">{tripPlan.accommodation.check_out_time}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-gray-600">
                          ${tripPlan.accommodation.price_per_night}/night × {tripPlan.accommodation.total_nights} nights
                        </span>
                        <span className="font-bold text-lg text-blue-700">
                          ${tripPlan.accommodation.total_cost?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Itinerary - Show ALL days */}
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary-500" />
                  Complete Itinerary
                </h3>
                <div className="space-y-4">
                  {tripPlan.itinerary?.map((day, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          {day.day}
                        </span>
                        <span className="font-bold text-xl text-gray-900">{day.title}</span>
                      </div>
                      <div className="ml-12 space-y-3">
                        {day.activities?.map((activity, actIndex) => (
                          <div key={actIndex} className="flex items-start gap-4 border-l-3 border-primary-300 pl-4 py-2">
                            <span className="text-primary-600 font-semibold whitespace-nowrap min-w-[80px]">
                              {activity.time?.split(' ')[0] || 'Activity'}
                            </span>
                            <div className="flex-1">
                              <p className="text-gray-900 font-medium text-lg">{activity.activity}</p>
                              {activity.description && (
                                <p className="text-gray-500 mt-1">{activity.description}</p>
                              )}
                              <span className={`inline-block mt-1 px-2 py-1 rounded-lg text-sm font-medium ${
                                activity.estimated_cost > 0 
                                  ? 'bg-primary-100 text-primary-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {activity.estimated_cost > 0 
                                  ? `~$${Math.round(activity.estimated_cost)}` 
                                  : 'Free'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              {tripPlan.tips && tripPlan.tips.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-5">
                  <h3 className="font-bold text-xl text-amber-800 mb-3">💡 Travel Tips</h3>
                  <ul className="text-amber-700 space-y-2">
                    {tripPlan.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3 text-lg">
                        <span className="text-amber-500 text-xl">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cost Breakdown */}
              {tripPlan.cost_breakdown && (
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold text-xl text-gray-900 mb-4">Estimated Costs</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white rounded-xl">
                      <p className="text-gray-500 mb-1">Hotel</p>
                      <p className="font-bold text-2xl text-gray-900">${tripPlan.cost_breakdown.hotel?.toLocaleString() || 0}</p>
                      <p className="text-xs text-gray-400 mt-1">{tripPlan.num_days} nights</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl">
                      <p className="text-gray-500 mb-1">Transport</p>
                      <p className="font-bold text-2xl text-gray-900">${tripPlan.cost_breakdown.transport?.toLocaleString() || 0}</p>
                      <p className="text-xs text-gray-400 mt-1">{tripPlan.num_people} people</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-blue-600 mb-1">Activities Budget</p>
                      <p className="font-bold text-2xl text-blue-700">${tripPlan.cost_breakdown.activities_budget?.toLocaleString() || 0}</p>
                      <p className="text-xs text-blue-500 mt-1">Remaining from budget</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                      <p className="text-green-600 mb-1">Activities Actual</p>
                      <p className="font-bold text-2xl text-green-700">${tripPlan.cost_breakdown.activities_actual?.toLocaleString() || 0}</p>
                      <p className="text-xs text-green-500 mt-1">
                        ${tripPlan.cost_breakdown.activities_per_person || 0}/person × {tripPlan.num_people}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t-2 border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-xl">Total Estimated</span>
                    <span className={`font-bold text-3xl ${tripPlan.budget_exceeded ? 'text-red-600' : 'text-primary-600'}`}>
                      ${tripPlan.cost_breakdown.estimated_total?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 flex justify-between items-center">
          <button
            onClick={generatePlan}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 text-primary-600 hover:bg-primary-100 rounded-xl transition-colors font-medium"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            Regenerate Plan
          </button>
          <button
            onClick={handleClose}
            className="px-8 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AITripRecommendation;
