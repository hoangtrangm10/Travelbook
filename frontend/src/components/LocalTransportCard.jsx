import { Car, Train, Bike, Bus, Clock, DollarSign, MapPin } from 'lucide-react';

const typeIcons = {
  car_rental: Car,
  taxi: Car,
  metro: Train,
  shuttle: Bus,
  bike: Bike,
  scooter: Bike,
};

const typeColors = {
  car_rental: 'bg-blue-100 text-blue-700',
  taxi: 'bg-yellow-100 text-yellow-700',
  metro: 'bg-green-100 text-green-700',
  shuttle: 'bg-purple-100 text-purple-700',
  bike: 'bg-orange-100 text-orange-700',
  scooter: 'bg-pink-100 text-pink-700',
};

function LocalTransportCard({ transport, nights = 1 }) {
  const Icon = typeIcons[transport.type] || Car;
  const colorClass = typeColors[transport.type] || 'bg-gray-100 text-gray-700';

  const formatType = (type) => {
    return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${colorClass}`}>
          <Icon className="w-7 h-7" />
        </div>

        {/* Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${colorClass} mb-1`}>
                {formatType(transport.type)}
              </span>
              <h3 className="font-semibold text-gray-900">{transport.name}</h3>
              <p className="text-sm text-gray-500">by {transport.provider}</p>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-xl font-bold text-primary-600">
                ${transport.total_price?.toFixed(2) || transport.price_per_person?.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {transport.price_note || `$${transport.price_per_person}/day`}
              </p>
            </div>
          </div>

          {/* Location info */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>Available in {transport.destination}</span>
            </div>
            {transport.per_day && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{nights} day rental</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 mt-2">{transport.description}</p>
        </div>
      </div>
    </div>
  );
}

export default LocalTransportCard;
