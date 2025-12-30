import { DollarSign, Hotel, Plane, Car, Camera, Calculator, ArrowRight, AlertTriangle } from 'lucide-react';

function PriceSummary({ summary, selectedHotel, selectedTransport, selectedLocalTransport, selectedAttractions = [], userBudget = 0 }) {
  const { trip_details, price_breakdown } = summary;
  
  // Calculate actual selected prices
  const hotelTotal = selectedHotel 
    ? selectedHotel.price_per_night * trip_details.nights * trip_details.rooms 
    : price_breakdown.hotel_min;
  
  const transportTotal = selectedTransport 
    ? selectedTransport.price_per_person * trip_details.people 
    : price_breakdown.transport_min;
  
  const localTransportTotal = selectedLocalTransport 
    ? (selectedLocalTransport.total_price || selectedLocalTransport.price_per_person * trip_details.nights)
    : (price_breakdown.local_transport_min || 0);
  
  const attractionsTotal = selectedAttractions.length > 0
    ? selectedAttractions.reduce((sum, a) => sum + (a.price_per_person * trip_details.people), 0)
    : price_breakdown.attractions_estimated;
  
  const grandTotal = hotelTotal + transportTotal + localTransportTotal + attractionsTotal;
  
  // Check if budget is exceeded
  const budgetExceeded = userBudget > 0 && grandTotal > userBudget;
  const overBudgetAmount = budgetExceeded ? grandTotal - userBudget : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5" />
        Trip Summary
      </h2>

      {/* Budget Warning */}
      {budgetExceeded && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-semibold text-sm">Budget Exceeded!</p>
              <p className="text-red-600 text-xs mt-1">
                Your budget: <strong>${userBudget.toLocaleString()}</strong>
              </p>
              <p className="text-red-600 text-xs">
                Over by: <strong>${overBudgetAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Route Display */}
      {(trip_details.origin || summary.origin?.name) && (
        <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-primary-50 rounded-lg text-primary-700 font-medium">
          <span>{trip_details.origin || summary.origin?.name || 'Your City'}</span>
          <ArrowRight className="w-4 h-4" />
          <span>{summary.destination?.name}</span>
        </div>
      )}

      {/* Trip Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Trip Details</h3>
        <div className="space-y-1 text-sm text-gray-600">
          {(trip_details.origin && trip_details.origin !== 'Not specified') && (
            <p><strong>From:</strong> {trip_details.origin}</p>
          )}
          <p><strong>To:</strong> {summary.destination?.name}</p>
          <p><strong>Check-in:</strong> {trip_details.check_in}</p>
          <p><strong>Check-out:</strong> {trip_details.check_out}</p>
          <p><strong>Duration:</strong> {trip_details.nights} night{trip_details.nights > 1 ? 's' : ''}</p>
          <p><strong>Travelers:</strong> {trip_details.people} guest{trip_details.people > 1 ? 's' : ''}</p>
          <p><strong>Rooms:</strong> {trip_details.rooms}</p>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-4">
        <h3 className="font-semibold text-gray-700">Price Breakdown</h3>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Hotel className="w-4 h-4 text-primary-500" />
            <span>Accommodation</span>
          </div>
          <span className="font-medium">${hotelTotal.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-primary-500" />
            <span>Getting There</span>
          </div>
          <span className="font-medium">${transportTotal.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-primary-500" />
            <span>Getting Around</span>
          </div>
          <span className="font-medium">${localTransportTotal.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary-500" />
            <span>Attractions</span>
          </div>
          <span className="font-medium">${attractionsTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-500">
              ${grandTotal.toFixed(2)}
            </div>
            <span className="text-xs text-gray-500">{price_breakdown.currency}</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          *Prices shown are estimates. Final prices may vary.
        </p>
      </div>
    </div>
  );
}

export default PriceSummary;
