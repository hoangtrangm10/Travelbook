import { Star, MapPin, Wifi, Car, Waves, Utensils } from 'lucide-react';

const amenityIcons = {
  'Free WiFi': Wifi,
  'Parking': Car,
  'Pool': Waves,
  'Restaurant': Utensils,
};

function HotelCard({ hotel, nights = 1, rooms = 1 }) {
  const totalPrice = hotel.price_per_night * nights * rooms;
  
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getRatingLabel = (rating) => {
    if (rating >= 9) return 'Exceptional';
    if (rating >= 8) return 'Excellent';
    if (rating >= 7) return 'Very Good';
    if (rating >= 6) return 'Good';
    return 'Pleasant';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-1/3 h-48 md:h-auto relative">
          <img
            src={hotel.image_url || `https://picsum.photos/seed/${hotel.name}/400/300`}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          {hotel.discount && (
            <span className="absolute top-2 left-2 badge badge-success">
              {hotel.discount}% OFF
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-primary-500 hover:text-primary-600 cursor-pointer">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(hotel.star_rating)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <div>
                      <span className="text-sm text-gray-600">{getRatingLabel(hotel.rating)}</span>
                      <span className="text-xs text-gray-400 block">{hotel.reviews_count} reviews</span>
                    </div>
                    <span className="bg-primary-500 text-white px-2 py-1 rounded-md font-bold">
                      {hotel.rating?.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {hotel.address}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {hotel.description}
              </p>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2 mb-3">
                {hotel.amenities?.slice(0, 4).map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity];
                  return (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {IconComponent && <IconComponent className="w-3 h-3" />}
                      {amenity}
                    </span>
                  );
                })}
                {hotel.amenities?.length > 4 && (
                  <span className="text-xs text-primary-500">
                    +{hotel.amenities.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end justify-between pt-3 border-t border-gray-100">
              <div>
                <span className="text-sm text-gray-500">
                  {nights} night{nights > 1 ? 's' : ''}, {rooms} room{rooms > 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  ${hotel.price_per_night}/night
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ${totalPrice.toFixed(2)}
                </div>
                <span className="text-xs text-gray-500">Includes taxes & fees</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;
