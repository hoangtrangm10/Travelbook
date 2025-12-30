"""
Amadeus API integration service for real travel data.
Sign up for free API keys at: https://developers.amadeus.com/
"""

import os
import requests
from typing import Optional, Dict, List, Any
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class AmadeusService:
    """
    Service for fetching real travel data from Amadeus API.
    
    Free tier includes:
    - Flight Offers Search (500 free requests/month)
    - Hotel Search (500 free requests/month)
    - Airport & City Search
    - Flight Inspiration Search
    
    Setup:
    1. Go to https://developers.amadeus.com/
    2. Create a free account
    3. Create an app to get API Key and Secret
    4. Add to your .env file:
       AMADEUS_API_KEY=your_api_key
       AMADEUS_API_SECRET=your_api_secret
    """
    
    # Use test environment for development (free)
    AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token"
    BASE_URL = "https://test.api.amadeus.com"
    
  
    def __init__(self):
        self.api_key = os.getenv('AMADEUS_API_KEY', '')
        self.api_secret = os.getenv('AMADEUS_API_SECRET', '')
        self._access_token = None
        self._token_expires = None
    
    def _get_access_token(self) -> Optional[str]:
        """Get OAuth2 access token from Amadeus"""
        # Return cached token if still valid
        if self._access_token and self._token_expires and datetime.now() < self._token_expires:
            return self._access_token
        
        if not self.api_key or not self.api_secret:
            logger.warning("Amadeus API credentials not configured")
            return None
        
        try:
            response = requests.post(
                self.AUTH_URL,
                data={
                    'grant_type': 'client_credentials',
                    'client_id': self.api_key,
                    'client_secret': self.api_secret
                },
                headers={'Content-Type': 'application/x-www-form-urlencoded'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                self._access_token = data['access_token']
                # Token expires in 'expires_in' seconds, subtract 60 for safety margin
                expires_in = data.get('expires_in', 1799) - 60
                self._token_expires = datetime.now() + timedelta(seconds=expires_in)
                logger.info("Amadeus access token obtained successfully")
                return self._access_token
            else:
                logger.error(f"Failed to get Amadeus token: {response.status_code} - {response.text}")
                
        except Exception as e:
            logger.error(f"Error getting Amadeus access token: {e}")
        
        return None
    
    def _make_request(self, endpoint: str, params: Dict = None) -> Optional[Dict]:
        """Make authenticated request to Amadeus API"""
        token = self._get_access_token()
        if not token:
            return None
        
        try:
            url = f"{self.BASE_URL}{endpoint}"
            response = requests.get(
                url,
                params=params,
                headers={'Authorization': f'Bearer {token}'},
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Amadeus API error: {response.status_code} - {response.text}")
                
        except Exception as e:
            logger.error(f"Error calling Amadeus API: {e}")
        
        return None
    
    def get_city_code(self, city_name: str) -> Optional[str]:
        """Get IATA city code for a city name"""
        data = self._make_request(
            "/v1/reference-data/locations",
            params={
                'keyword': city_name,
                'subType': 'CITY,AIRPORT',
                'page[limit]': 1
            }
        )
        
        if data and data.get('data'):
            return data['data'][0].get('iataCode')
        return None
    
    def search_flights(
        self,
        origin: str,
        destination: str,
        departure_date: str,
        return_date: str = None,
        adults: int = 1,
        max_results: int = 10
    ) -> List[Dict]:
        """
        Search for flight offers.
        
        Args:
            origin: Origin city name or IATA code (e.g., 'Paris' or 'PAR')
            destination: Destination city name or IATA code
            departure_date: Date in YYYY-MM-DD format
            return_date: Optional return date for round trips
            adults: Number of adult passengers
            max_results: Maximum number of results
        
        Returns:
            List of flight offers with prices
        """
        # Get IATA codes if city names provided
        origin_code = origin if len(origin) == 3 else self.get_city_code(origin)
        dest_code = destination if len(destination) == 3 else self.get_city_code(destination)
        
        if not origin_code or not dest_code:
            logger.warning(f"Could not find IATA codes for {origin} or {destination}")
            return []
        
        params = {
            'originLocationCode': origin_code,
            'destinationLocationCode': dest_code,
            'departureDate': departure_date,
            'adults': adults,
            'max': max_results,
            'currencyCode': 'USD'
        }
        
        if return_date:
            params['returnDate'] = return_date
        
        data = self._make_request("/v2/shopping/flight-offers", params)
        
        if not data or not data.get('data'):
            return []
        
        flights = []
        for i, offer in enumerate(data['data']):
            # Parse flight segments
            segments = offer.get('itineraries', [{}])[0].get('segments', [])
            first_segment = segments[0] if segments else {}
            last_segment = segments[-1] if segments else {}
            
            # Calculate total duration
            duration_str = offer.get('itineraries', [{}])[0].get('duration', 'PT0H')
            duration_minutes = self._parse_duration(duration_str)
            
            flights.append({
                'id': i + 1,
                'type': 'flight',
                'name': f"Flight {first_segment.get('carrierCode', '')} {first_segment.get('number', '')}",
                'provider': first_segment.get('carrierCode', 'Unknown Airline'),
                'price_per_person': float(offer.get('price', {}).get('grandTotal', 0)),
                'currency': offer.get('price', {}).get('currency', 'USD'),
                'duration_minutes': duration_minutes,
                'origin': origin_code,
                'destination': dest_code,
                'departure_time': first_segment.get('departure', {}).get('at', '')[:16].replace('T', ' '),
                'arrival_time': last_segment.get('arrival', {}).get('at', '')[:16].replace('T', ' '),
                'stops': len(segments) - 1,
                'description': f"Flight from {origin} to {destination}",
                'booking_class': offer.get('travelerPricings', [{}])[0].get('fareDetailsBySegment', [{}])[0].get('cabin', 'ECONOMY'),
                'is_real_data': True
            })
        
        return sorted(flights, key=lambda x: x['price_per_person'])
    
    def search_hotels(
        self,
        city: str,
        check_in: str,
        check_out: str,
        adults: int = 1,
        rooms: int = 1,
        max_results: int = 10
    ) -> List[Dict]:
        """
        Search for hotel offers.
        
        Args:
            city: City name or IATA code
            check_in: Check-in date (YYYY-MM-DD)
            check_out: Check-out date (YYYY-MM-DD)
            adults: Number of adults
            rooms: Number of rooms
            max_results: Maximum results
        
        Returns:
            List of hotel offers with prices
        """
        # First, get city code
        city_code = city if len(city) == 3 else self.get_city_code(city)
        
        if not city_code:
            logger.warning(f"Could not find IATA code for {city}")
            return []
        
        # Step 1: Get hotels by city
        hotels_data = self._make_request(
            "/v1/reference-data/locations/hotels/by-city",
            params={
                'cityCode': city_code,
                'radius': 10,
                'radiusUnit': 'KM',
                'hotelSource': 'ALL'
            }
        )
        
        if not hotels_data or not hotels_data.get('data'):
            return []
        
        # Get first N hotel IDs
        hotel_ids = [h['hotelId'] for h in hotels_data['data'][:min(max_results, 20)]]
        
        if not hotel_ids:
            return []
        
        # Step 2: Get hotel offers
        offers_data = self._make_request(
            "/v3/shopping/hotel-offers",
            params={
                'hotelIds': ','.join(hotel_ids[:10]),  # API limit
                'adults': adults,
                'checkInDate': check_in,
                'checkOutDate': check_out,
                'roomQuantity': rooms,
                'currency': 'USD'
            }
        )
        
        if not offers_data or not offers_data.get('data'):
            # Fallback: return hotel list without prices
            return self._format_hotels_without_prices(hotels_data['data'][:max_results], city)
        
        hotels = []
        for i, hotel_offer in enumerate(offers_data['data']):
            hotel = hotel_offer.get('hotel', {})
            offers = hotel_offer.get('offers', [])
            first_offer = offers[0] if offers else {}
            
            price = float(first_offer.get('price', {}).get('total', 0))
            nights = (datetime.strptime(check_out, '%Y-%m-%d') - datetime.strptime(check_in, '%Y-%m-%d')).days
            price_per_night = round(price / nights, 2) if nights > 0 else price
            
            hotels.append({
                'id': i + 1,
                'name': hotel.get('name', 'Unknown Hotel'),
                'star_rating': self._estimate_star_rating(hotel.get('rating', 0)),
                'price_per_night': price_per_night,
                'total_price': price,
                'currency': first_offer.get('price', {}).get('currency', 'USD'),
                'rating': float(hotel.get('rating', 0)) if hotel.get('rating') else None,
                'reviews_count': None,
                'amenities': self._parse_amenities(first_offer.get('room', {}).get('description', {})),
                'address': hotel.get('address', {}).get('lines', [''])[0] if hotel.get('address') else '',
                'description': first_offer.get('room', {}).get('description', {}).get('text', ''),
                'latitude': hotel.get('latitude'),
                'longitude': hotel.get('longitude'),
                'is_real_data': True
            })
        
        return sorted(hotels, key=lambda x: x['price_per_night'])
    
    def _format_hotels_without_prices(self, hotels_data: List[Dict], city: str) -> List[Dict]:
        """Format hotel list when price data is unavailable"""
        hotels = []
        for i, hotel in enumerate(hotels_data):
            hotels.append({
                'id': i + 1,
                'name': hotel.get('name', 'Unknown Hotel'),
                'star_rating': self._estimate_star_rating(hotel.get('rating', 0)),
                'price_per_night': None,  # Price not available
                'currency': 'USD',
                'address': f"{city}",
                'description': f"Hotel in {city}",
                'is_real_data': True,
                'price_available': False
            })
        return hotels
    
    def _parse_duration(self, duration_str: str) -> int:
        """Parse ISO 8601 duration to minutes (e.g., 'PT2H30M' -> 150)"""
        import re
        hours = 0
        minutes = 0
        
        hour_match = re.search(r'(\d+)H', duration_str)
        min_match = re.search(r'(\d+)M', duration_str)
        
        if hour_match:
            hours = int(hour_match.group(1))
        if min_match:
            minutes = int(min_match.group(1))
        
        return hours * 60 + minutes
    
    def _estimate_star_rating(self, rating: Any) -> int:
        """Estimate star rating from hotel rating"""
        if not rating:
            return 3
        try:
            r = float(rating)
            if r >= 4.5:
                return 5
            elif r >= 4.0:
                return 4
            elif r >= 3.0:
                return 3
            elif r >= 2.0:
                return 2
            else:
                return 1
        except (ValueError, TypeError):
            return 3
    
    def _parse_amenities(self, description: Dict) -> List[str]:
        """Extract amenities from room description"""
        text = description.get('text', '') if description else ''
        
        amenity_keywords = {
            'wifi': 'Free WiFi',
            'breakfast': 'Breakfast Included',
            'pool': 'Pool',
            'gym': 'Gym',
            'spa': 'Spa',
            'parking': 'Parking',
            'air': 'Air Conditioning',
            'tv': 'TV',
            'minibar': 'Minibar',
            'safe': 'Safe',
        }
        
        amenities = []
        text_lower = text.lower()
        for keyword, amenity in amenity_keywords.items():
            if keyword in text_lower:
                amenities.append(amenity)
        
        return amenities if amenities else ['Standard Room']
    
    def is_configured(self) -> bool:
        """Check if Amadeus API is properly configured"""
        return bool(self.api_key and self.api_secret)
    
    def test_connection(self) -> Dict[str, Any]:
        """Test the Amadeus API connection"""
        if not self.is_configured():
            return {
                'success': False,
                'message': 'Amadeus API credentials not configured. Set AMADEUS_API_KEY and AMADEUS_API_SECRET.'
            }
        
        token = self._get_access_token()
        if token:
            return {
                'success': True,
                'message': 'Successfully connected to Amadeus API'
            }
        else:
            return {
                'success': False,
                'message': 'Failed to authenticate with Amadeus API. Check your credentials.'
            }
