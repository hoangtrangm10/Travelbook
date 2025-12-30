import { Star, MapPin, Clock, Ticket, Camera, TreePine, Building, UtensilsCrossed, ShoppingBag, Compass } from 'lucide-react';

const categoryIcons = {
  landmark: Building,
  museum: Camera,
  nature: TreePine,
  entertainment: Ticket,
  food: UtensilsCrossed,
  shopping: ShoppingBag,
  adventure: Compass,
  cultural: Building,
  beach: TreePine,
  nightlife: Ticket,
};

function AttractionCard({ attraction, people = 1 }) {
  const totalPrice = attraction.price_per_person * people;
  const IconComponent = categoryIcons[attraction.category] || Camera;

  const getCategoryLabel = (category) => {
    const labels = {
      landmark: 'Landmark',
      museum: 'Museum',
      nature: 'Nature',
      entertainment: 'Entertainment',
      food: 'Food & Dining',
      shopping: 'Shopping',
      adventure: 'Adventure',
      cultural: 'Cultural',
      beach: 'Beach',
      nightlife: 'Nightlife',
    };
    return labels[category] || category;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
      {/* Image */}
      <div className="h-40 relative">
        <img
          src={attraction.image_url || `https://picsum.photos/seed/${attraction.name}/400/200`}
          alt={attraction.name}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 left-2 badge badge-primary flex items-center gap-1">
          <IconComponent className="w-3 h-3" />
          {getCategoryLabel(attraction.category)}
        </span>
        {attraction.price_per_person === 0 && (
          <span className="absolute top-2 right-2 badge badge-success">
            FREE
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{attraction.name}</h3>
        
        {/* Rating */}
        {attraction.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{attraction.rating?.toFixed(1)}</span>
            {attraction.reviews_count && (
              <span className="text-xs text-gray-500">
                ({attraction.reviews_count} reviews)
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {attraction.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {attraction.description}
          </p>
        )}

        {/* Duration */}
        {attraction.duration_hours && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Clock className="w-4 h-4 mr-1" />
            Duration: {attraction.duration_hours}h
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            {people} person{people > 1 ? 's' : ''}
          </span>
          <div className="text-right">
            {attraction.price_per_person > 0 ? (
              <>
                <div className="text-lg font-bold text-gray-900">
                  ${totalPrice.toFixed(2)}
                </div>
                <span className="text-xs text-gray-500">
                  ${attraction.price_per_person}/person
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-green-600">Free Entry</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttractionCard;
