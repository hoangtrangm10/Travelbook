import { X, MapPin, Navigation, Calendar, Users, DollarSign, Hotel, Plane, Camera, Sparkles, AlertTriangle } from 'lucide-react';
import HotelCard from './HotelCard';
import TransportCard from './TransportCard';
import AttractionCard from './AttractionCard';

function TravelPlanModal({ isOpen, onClose, plan }) {
  if (!isOpen || !plan) return null;

  const planData = plan.plan || plan;
  const recommendations = plan.recommendations || {};

  // Render structured itinerary (array format)
  const renderStructuredItinerary = (itinerary) => {
    if (!itinerary || !Array.isArray(itinerary)) return null;
    
    return itinerary.map((day, dayIndex) => (
      <div key={dayIndex} className="mb-6 last:mb-0">
        <h3 className="text-lg font-bold text-primary-600 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            {day.day}
          </span>
          {day.title}
        </h3>
        <div className="space-y-3 ml-10">
          {day.activities && day.activities.map((activity, actIndex) => (
            <div key={actIndex} className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{activity.time}</p>
                  <p className="font-semibold text-gray-900">{activity.activity}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                  activity.estimated_cost > 0 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {activity.estimated_cost > 0 
                    ? `$${Math.round(activity.estimated_cost)}` 
                    : 'Free'}
                </span>
              </div>
            </div>
          ))}
          <div className="text-right text-sm font-medium text-gray-700">
            Day Total: ${Math.round(day.day_total || 0)}
          </div>
        </div>
      </div>
    ));
  };

  // Parse the itinerary text into sections (fallback for text format)
  const renderItinerary = (itinerary) => {
    if (!itinerary) return null;
    
    // If itinerary is an array, use structured rendering
    if (Array.isArray(itinerary)) {
      return renderStructuredItinerary(itinerary);
    }
    
    // Fallback for text-based itinerary
    const lines = String(itinerary).split('\n');
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('## ')) {
        return (
          <h3 key={index} className="text-lg font-bold text-primary-600 mt-4 mb-2">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h2 key={index} className="text-xl font-bold text-gray-900 mt-2 mb-3">
            {line.replace('# ', '')}
          </h2>
        );
      }
      // Bold text
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className="font-semibold text-gray-800 mt-3">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      // List items
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 text-gray-700 list-disc">
            {line.replace('- ', '')}
          </li>
        );
      }
      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      // Regular text
      return (
        <p key={index} className="text-gray-700">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">Your AI Travel Plan</h2>
              <p className="text-primary-100 text-sm">
                {planData?.origin} → {planData?.destination}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Trip Overview */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <Navigation className="w-6 h-6 text-primary-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">From</p>
                <p className="font-semibold">{planData?.origin}</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <MapPin className="w-6 h-6 text-primary-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">To</p>
                <p className="font-semibold">{planData?.destination}</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <Calendar className="w-6 h-6 text-primary-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-semibold">{planData?.num_days} Days</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <DollarSign className="w-6 h-6 text-primary-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Budget</p>
                <p className="font-semibold">${planData?.budget?.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              {planData?.travel_types && Array.isArray(planData.travel_types) ? (
                planData.travel_types.map((type, index) => (
                  <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium capitalize">
                    {type}
                  </span>
                ))
              ) : (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium capitalize">
                  {planData?.travel_type} Trip
                </span>
              )}
              {planData?.hotel_preference && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium capitalize">
                  <Hotel className="w-4 h-4 inline mr-1" />
                  {planData.hotel_preference.replace('-', ' ')}
                </span>
              )}
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                <Users className="w-4 h-4 inline mr-1" />
                {planData?.num_people} travelers
              </span>
            </div>
            
            {/* Budget Warning */}
            {planData?.budget_exceeded && planData?.budget_warning && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-red-700 font-semibold">⚠️ Budget Exceeded!</p>
                    <p className="text-red-600 text-sm mt-1">{planData.budget_warning.message}</p>
                    <p className="text-red-500 text-xs mt-1">{planData.budget_warning.suggestion}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                        Your Budget: <strong>${planData.budget?.toLocaleString()}</strong>
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                        Trip Cost: <strong>${planData.budget_warning.required_budget?.toLocaleString()}</strong>
                      </span>
                      <span className="px-2 py-1 bg-red-200 text-red-800 rounded font-semibold">
                        Over by: ${planData.budget_warning.over_amount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Itinerary */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-500" />
              Your Personalized Itinerary
            </h3>
            <div className="bg-white border rounded-lg p-4 prose prose-sm max-w-none">
              {renderItinerary(planData?.itinerary)}
            </div>
          </div>

          {/* Recommended Hotel */}
          {planData?.recommended_hotel && (
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-primary-500" />
                  Recommended Accommodation
                </h3>
                {planData?.hotel_preference && (
                  <span className="text-sm text-gray-500 capitalize">
                    {planData.hotel_preference_description || `${planData.hotel_preference.replace('-', ' ')} style`}
                  </span>
                )}
              </div>
              <HotelCard 
                hotel={planData.recommended_hotel} 
                isSelected={true}
                onSelect={() => {}}
              />
            </div>
          )}

          {/* Recommended Transport */}
          {planData?.recommended_transport && (
            <div className="px-6 pb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Plane className="w-5 h-5 text-primary-500" />
                Recommended Transport
              </h3>
              <TransportCard 
                transport={planData.recommended_transport}
                isSelected={true}
                onSelect={() => {}}
              />
            </div>
          )}

          {/* Top Attractions */}
          {planData?.top_attractions && planData.top_attractions.length > 0 && (
            <div className="px-6 pb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary-500" />
                Must-Visit Attractions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {planData.top_attractions.slice(0, 4).map((attraction, index) => (
                  <AttractionCard
                    key={attraction.id || index}
                    attraction={attraction}
                    isSelected={false}
                    onSelect={() => {}}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Cost Summary */}
          {planData?.cost_breakdown && (
            <div className="px-6 pb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary-500" />
                Estimated Costs
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Hotel</p>
                    <p className="font-bold text-lg text-gray-900">
                      ${planData.cost_breakdown.hotel?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-gray-400">{planData.num_days} nights</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Transport</p>
                    <p className="font-bold text-lg text-gray-900">
                      ${planData.cost_breakdown.transport?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-gray-400">{planData.num_people} people</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center shadow-sm border border-blue-200">
                    <p className="text-xs text-blue-600 mb-1">Activities Budget</p>
                    <p className="font-bold text-lg text-blue-700">
                      ${planData.cost_breakdown.activities_budget?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-blue-500">Remaining from budget</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center shadow-sm border border-green-200">
                    <p className="text-xs text-green-600 mb-1">Activities Actual</p>
                    <p className="font-bold text-lg text-green-700">
                      ${planData.cost_breakdown.activities_actual?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-green-500">
                      ${planData.cost_breakdown.activities_per_person || 0}/person × {planData.num_people}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Estimated</span>
                  <span className={`font-bold text-2xl ${planData.budget_exceeded ? 'text-red-600' : 'text-primary-600'}`}>
                    ${planData.cost_breakdown.estimated_total?.toLocaleString() || 0}
                  </span>
                </div>
                {planData.cost_breakdown.remaining_budget !== undefined && (
                  <div className="mt-2 text-right">
                    <span className={`text-sm ${planData.cost_breakdown.remaining_budget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {planData.cost_breakdown.remaining_budget >= 0 
                        ? `$${planData.cost_breakdown.remaining_budget.toLocaleString()} remaining in budget`
                        : `$${Math.abs(planData.cost_breakdown.remaining_budget).toLocaleString()} over budget`
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Generated by AI • Prices are estimates
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default TravelPlanModal;
