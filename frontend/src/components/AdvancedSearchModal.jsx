import { useState } from 'react';
import { X, Sparkles, MapPin, Navigation, Compass, Users, DollarSign, Calendar, Send, Loader2, Hotel } from 'lucide-react';
import { generateAITravelPlan } from '../services/api';

const TRAVEL_TYPES = [
  { id: 'nature', label: 'Nature', emoji: '🏞️', description: 'Hiking, beaches, national parks' },
  { id: 'culture', label: 'Culture', emoji: '🏛️', description: 'Museums, history, architecture' },
  { id: 'food', label: 'Food', emoji: '🍜', description: 'Local cuisine, food tours, markets' },
  { id: 'adventure', label: 'Adventure', emoji: '🎯', description: 'Extreme sports, water activities' },
  { id: 'relaxation', label: 'Relaxation', emoji: '🧘', description: 'Spa, resorts, wellness' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🎉', description: 'Bars, clubs, entertainment' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', description: 'Kid-friendly, theme parks' },
  { id: 'romantic', label: 'Romantic', emoji: '💕', description: 'Couples activities, fine dining' },
];

const HOTEL_TYPES = [
  { id: 'luxury', label: 'Luxury', emoji: '🏰', description: '5-star hotels, premium amenities', priceRange: '$$$$$' },
  { id: 'boutique', label: 'Boutique', emoji: '🏨', description: 'Unique, stylish, personalized', priceRange: '$$$$' },
  { id: 'resort', label: 'Resort', emoji: '🌴', description: 'All-inclusive, pools, activities', priceRange: '$$$$' },
  { id: 'mid-range', label: 'Mid-Range', emoji: '🛏️', description: 'Comfortable, good value', priceRange: '$$$' },
  { id: 'budget', label: 'Budget', emoji: '💰', description: 'Affordable, clean, basic', priceRange: '$$' },
  { id: 'hostel', label: 'Hostel', emoji: '🎒', description: 'Social, backpacker-friendly', priceRange: '$' },
  { id: 'apartment', label: 'Apartment', emoji: '🏠', description: 'Self-catering, home-like', priceRange: '$$$' },
  { id: 'unique', label: 'Unique Stays', emoji: '🏕️', description: 'Treehouses, igloos, caves', priceRange: '$$$$' },
];

function AdvancedSearchModal({ isOpen, onClose, onPlanGenerated }) {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    travel_types: [], // Changed to array for multiple selection
    hotel_preference: '', // Hotel preference
    num_days: 5,
    num_people: 2,
    budget: 2000,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Toggle travel type selection (for multiple)
  const toggleTravelType = (typeId) => {
    setFormData(prev => {
      const currentTypes = prev.travel_types;
      if (currentTypes.includes(typeId)) {
        return { ...prev, travel_types: currentTypes.filter(t => t !== typeId) };
      } else {
        return { ...prev, travel_types: [...currentTypes, typeId] };
      }
    });
  };

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Convert travel_types array to comma-separated string for backend
      const submitData = {
        ...formData,
        travel_type: formData.travel_types.join(',') || 'culture',
        hotel_preference: formData.hotel_preference || 'mid-range',
        user_set_budget: true, // User explicitly set budget in advanced planning
      };
      console.log('Submitting travel plan:', submitData);
      const result = await generateAITravelPlan(submitData);
      console.log('Result:', result);
      if (result && result.success) {
        onPlanGenerated(result);
        onClose();
        // Reset form
        setStep(0);
        setFormData({
          origin: '',
          destination: '',
          travel_types: [],
          hotel_preference: '',
          num_days: 5,
          num_people: 2,
          budget: 2000,
        });
      } else {
        setError('Failed to generate plan. Please try again.');
      }
    } catch (error) {
      console.error('Failed to generate plan:', error);
      setError(error.response?.data?.error || 'Failed to generate travel plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return formData.origin.trim().length > 0;
      case 1: return formData.destination.trim().length > 0;
      case 2: return formData.travel_types.length > 0; // At least one selected
      case 3: return formData.hotel_preference.length > 0; // Hotel preference selected
      case 4: return formData.num_days > 0 && formData.num_people > 0;
      case 5: return formData.budget > 0;
      default: return true;
    }
  };

  // Reset when modal closes
  const handleClose = () => {
    setStep(0);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Navigation className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900">Where are you traveling from?</h3>
              <p className="text-gray-500">Enter your departure city</p>
            </div>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => handleChange('origin', e.target.value)}
              placeholder="e.g., New York, London, Tokyo"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-lg"
              autoFocus
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900">Where would you like to go?</h3>
              <p className="text-gray-500">Enter your dream destination</p>
            </div>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => handleChange('destination', e.target.value)}
              placeholder="e.g., Paris, Bali, Rome"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-lg"
              autoFocus
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Compass className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900">What type of experience?</h3>
              <p className="text-gray-500">Select one or more travel styles</p>
              {formData.travel_types.length > 0 && (
                <p className="text-primary-500 text-sm mt-2">
                  {formData.travel_types.length} selected
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {TRAVEL_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => toggleTravelType(type.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.travel_types.includes(type.id)
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="text-2xl mb-1">{type.emoji}</div>
                    {formData.travel_types.includes(type.id) && (
                      <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="font-semibold text-gray-900">{type.label}</div>
                  <div className="text-xs text-gray-500">{type.description}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Hotel className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900">Where would you like to stay?</h3>
              <p className="text-gray-500">Choose your preferred accommodation style</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {HOTEL_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleChange('hotel_preference', type.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.hotel_preference === type.id
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="text-2xl mb-1">{type.emoji}</div>
                    <span className="text-xs font-medium text-primary-600">{type.priceRange}</span>
                  </div>
                  <div className="font-semibold text-gray-900">{type.label}</div>
                  <div className="text-xs text-gray-500">{type.description}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900">Trip Details</h3>
              <p className="text-gray-500">How long and how many travelers?</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Days
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={formData.num_days}
                  onChange={(e) => handleChange('num_days', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-bold text-primary-500 w-16 text-center">
                  {formData.num_days} days
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Travelers
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleChange('num_people', Math.max(1, formData.num_people - 1))}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold"
                >
                  -
                </button>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className="text-lg font-bold">{formData.num_people}</span>
                </div>
                <button
                  onClick={() => handleChange('num_people', Math.min(20, formData.num_people + 1))}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <DollarSign className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900">What's your budget?</h3>
              <p className="text-gray-500">Total budget for the entire trip (USD)</p>
            </div>
            
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => handleChange('budget', parseInt(e.target.value) || 0)}
                placeholder="2000"
                min="100"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-lg"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {[500, 1000, 2000, 5000, 10000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleChange('budget', amount)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.budget === amount
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ${amount.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-600">
                <strong>Daily budget:</strong> ${Math.round(formData.budget / formData.num_days).toLocaleString()}/day
              </p>
              <p className="text-sm text-gray-600">
                <strong>Per person:</strong> ${Math.round(formData.budget / formData.num_people).toLocaleString()}/person
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Sparkles className="w-12 h-12 text-accent-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900">Ready to Generate Your Plan!</h3>
              <p className="text-gray-500">Review your trip details</p>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">From:</span>
                <span className="font-medium">{formData.origin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To:</span>
                <span className="font-medium">{formData.destination}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Styles:</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {formData.travel_types.map(type => {
                    const typeInfo = TRAVEL_TYPES.find(t => t.id === type);
                    return (
                      <span key={type} className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm capitalize">
                        {typeInfo?.emoji} {type}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Accommodation:</span>
                <span className="font-medium capitalize">
                  {HOTEL_TYPES.find(h => h.id === formData.hotel_preference)?.emoji}{' '}
                  {formData.hotel_preference.replace('-', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{formData.num_days} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Travelers:</span>
                <span className="font-medium">{formData.num_people} people</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Budget:</span>
                <span className="font-medium">${formData.budget.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent-500" />
            <span className="font-bold text-lg">Smart Travel Planner</span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-4 pt-4">
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i <= step ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Step {step + 1} of 7</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t bg-gray-50">
          {step > 0 && (
            <button
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
          )}
          
          {step < 6 ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex-1 px-6 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-6 py-2 bg-accent-500 text-gray-900 rounded-lg font-bold hover:bg-accent-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate My Trip Plan
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdvancedSearchModal;
