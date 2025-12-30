import { Plane, Train, Bus, Car, CarTaxiFront, Ship, Clock, Users, ArrowRight } from 'lucide-react';

const transportIcons = {
  flight: Plane,
  train: Train,
  bus: Bus,
  car_rental: Car,
  taxi: CarTaxiFront,
  ferry: Ship,
};

function TransportCard({ transport, people = 1 }) {
  const totalPrice = transport.price_per_person * people;
  const IconComponent = transportIcons[transport.type] || Car;

  const formatDuration = (minutes) => {
    if (!minutes) return 'Varies';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTypeLabel = (type) => {
    const labels = {
      flight: 'Flight',
      train: 'Train',
      bus: 'Bus',
      car_rental: 'Car Rental',
      taxi: 'Transfer',
      ferry: 'Ferry',
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 card-hover">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="bg-primary-100 p-3 rounded-lg">
          <IconComponent className="w-6 h-6 text-primary-500" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <span className="badge badge-primary mb-2">
                {getTypeLabel(transport.type)}
              </span>
              <h3 className="font-semibold text-gray-900">{transport.name}</h3>
              {transport.provider && (
                <p className="text-sm text-gray-500">by {transport.provider}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">
                ${totalPrice.toFixed(2)}
              </div>
              <span className="text-xs text-gray-500">
                ${transport.price_per_person}/person
              </span>
            </div>
          </div>

          {/* Route: Origin → Destination */}
          {(transport.origin || transport.destination) && (
            <div className="flex items-center gap-2 mt-3 text-sm font-medium text-primary-600 bg-primary-50 px-3 py-2 rounded-md">
              <span>{transport.origin || 'Your City'}</span>
              <ArrowRight className="w-4 h-4" />
              <span>{transport.destination}</span>
              {transport.departure_time && (
                <span className="ml-auto text-gray-500">Departs: {transport.departure_time}</span>
              )}
            </div>
          )}

          {/* Details */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            {transport.duration_minutes && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDuration(transport.duration_minutes)}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {people} traveler{people > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransportCard;
