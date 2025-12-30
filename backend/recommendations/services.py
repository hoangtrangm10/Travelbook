"""
External API integration services for travel data.
Uses mock data for hotels/transport/attractions.
Supports switching between Mock and Amadeus API for real data.
"""

import os
import requests
from typing import Optional, Dict, List, Any
from decimal import Decimal
import random
from django.conf import settings


class MockAttractionService:
    """
    Mock service for attraction data.
    Generates realistic attraction recommendations without external API.
    """
    
    ATTRACTION_TEMPLATES = [
        {'name': 'City Museum', 'category': 'museum', 'base_price': 15},
        {'name': 'Central Park', 'category': 'nature', 'base_price': 0},
        {'name': 'Historic Castle', 'category': 'landmark', 'base_price': 20},
        {'name': 'Local Market', 'category': 'shopping', 'base_price': 0},
        {'name': 'Beach Resort', 'category': 'beach', 'base_price': 10},
        {'name': 'Adventure Park', 'category': 'adventure', 'base_price': 45},
        {'name': 'Cultural Center', 'category': 'cultural', 'base_price': 12},
        {'name': 'Botanical Garden', 'category': 'nature', 'base_price': 8},
        {'name': 'Art Gallery', 'category': 'museum', 'base_price': 18},
        {'name': 'Food Street', 'category': 'food', 'base_price': 0},
        {'name': 'Historic Cathedral', 'category': 'landmark', 'base_price': 5},
        {'name': 'Zoo & Aquarium', 'category': 'entertainment', 'base_price': 25},
        {'name': 'Sunset Viewpoint', 'category': 'nature', 'base_price': 0},
        {'name': 'Night Market', 'category': 'shopping', 'base_price': 0},
        {'name': 'Water Sports Center', 'category': 'adventure', 'base_price': 35},
    ]
    
    def get_coordinates(self, city: str) -> Optional[Dict[str, float]]:
        """Return mock coordinates for a city"""
        # Generate consistent but fake coordinates based on city name
        import hashlib
        hash_val = int(hashlib.md5(city.encode()).hexdigest(), 16)
        lat = (hash_val % 18000) / 100 - 90  # -90 to 90
        lon = (hash_val % 36000) / 100 - 180  # -180 to 180
        return {
            'lat': round(lat, 4),
            'lon': round(lon, 4),
            'name': city,
            'country': 'Unknown'
        }
    
    def get_attractions(self, lat: float, lon: float, radius: int = 10000, limit: int = 20) -> List[Dict]:
        """Generate mock attractions for given coordinates"""
        # We don't actually use lat/lon, just return mock data
        return []  # Return empty - will use _generate_mock_attractions instead
    
    def get_attraction_details(self, xid: str) -> Optional[Dict]:
        """Get mock attraction details"""
        return {
            'name': 'Mock Attraction',
            'description': 'A wonderful place to visit',
            'image_url': '',
            'address': {},
            'kinds': 'tourism',
            'url': ''
        }


class MockHotelService:
    """
    Mock service for hotel data.
    In production, you could integrate with:
    - Amadeus Hotel Search API (free tier available)
    - Booking.com Affiliate API
    - Hotels.com API
    """
    
    HOTEL_TEMPLATES = [
        {"name": "Grand Plaza Hotel", "stars": 5, "base_price": 250},
        {"name": "City Center Inn", "stars": 4, "base_price": 150},
        {"name": "Budget Stay Express", "stars": 3, "base_price": 80},
        {"name": "Luxury Resort & Spa", "stars": 5, "base_price": 350},
        {"name": "Comfort Suites", "stars": 4, "base_price": 120},
        {"name": "Backpacker's Haven", "stars": 2, "base_price": 40},
        {"name": "Business Hotel Premier", "stars": 4, "base_price": 180},
        {"name": "Family Resort Paradise", "stars": 4, "base_price": 200},
        {"name": "Boutique Hotel Artisan", "stars": 4, "base_price": 160},
        {"name": "Economy Lodge", "stars": 2, "base_price": 50},
    ]
    
    AMENITIES = [
        "Free WiFi", "Pool", "Gym", "Spa", "Restaurant", "Bar",
        "Room Service", "Parking", "Airport Shuttle", "Pet Friendly",
        "Business Center", "Laundry", "Concierge", "Beach Access"
    ]
    
    def get_hotels(self, city: str, num_results: int = 10) -> List[Dict]:
        """Generate mock hotel data for a city"""
        hotels = []
        for i, template in enumerate(self.HOTEL_TEMPLATES[:num_results]):
            # Add some randomness to prices
            price_variance = random.uniform(0.8, 1.3)
            price = round(template['base_price'] * price_variance, 2)
            
            # Random amenities based on star rating
            num_amenities = min(template['stars'] * 2, len(self.AMENITIES))
            amenities = random.sample(self.AMENITIES, num_amenities)
            
            hotels.append({
                'id': i + 1,
                'name': f"{template['name']} {city}",
                'star_rating': template['stars'],
                'price_per_night': price,
                'currency': 'USD',
                'rating': round(random.uniform(6.0, 9.8), 1),
                'reviews_count': random.randint(50, 2000),
                'amenities': amenities,
                'address': f"{random.randint(1, 999)} Main Street, {city}",
                'description': f"Experience comfort and hospitality at {template['name']} located in the heart of {city}.",
                'image_url': f"https://picsum.photos/seed/{city.lower()}{i}/400/300"
            })
        
        return sorted(hotels, key=lambda x: x['price_per_night'])


class MockTransportService:
    """
    Mock service for transport data.
    Separates inter-city transport (flights, trains) from local transport (car rental, taxi).
    """
    
    # Inter-city transport: Getting FROM origin TO destination
    INTERCITY_TRANSPORT = [
        {'type': 'flight', 'name': 'Economy Flight', 'base_price': 200, 'duration_range': (60, 180)},
        {'type': 'flight', 'name': 'Business Class Flight', 'base_price': 500, 'duration_range': (60, 180)},
        {'type': 'flight', 'name': 'Premium Economy Flight', 'base_price': 350, 'duration_range': (60, 180)},
        {'type': 'train', 'name': 'High-Speed Train', 'base_price': 80, 'duration_range': (120, 360)},
        {'type': 'train', 'name': 'Standard Train', 'base_price': 40, 'duration_range': (180, 480)},
        {'type': 'bus', 'name': 'Luxury Coach', 'base_price': 50, 'duration_range': (240, 720)},
        {'type': 'bus', 'name': 'Standard Bus', 'base_price': 25, 'duration_range': (300, 840)},
    ]
    
    # Local transport: Getting around AT the destination
    LOCAL_TRANSPORT = [
        {'type': 'car_rental', 'name': 'Economy Car Rental', 'base_price': 35, 'per_day': True},
        {'type': 'car_rental', 'name': 'SUV Rental', 'base_price': 70, 'per_day': True},
        {'type': 'car_rental', 'name': 'Luxury Car Rental', 'base_price': 120, 'per_day': True},
        {'type': 'taxi', 'name': 'Airport Transfer', 'base_price': 45, 'per_day': False},
        {'type': 'taxi', 'name': 'Private Driver (Full Day)', 'base_price': 150, 'per_day': True},
        {'type': 'metro', 'name': 'Metro Day Pass', 'base_price': 10, 'per_day': True},
        {'type': 'metro', 'name': 'Weekly Transit Pass', 'base_price': 35, 'per_day': False},
        {'type': 'shuttle', 'name': 'Hotel Shuttle Service', 'base_price': 0, 'per_day': False},
        {'type': 'bike', 'name': 'Bike Rental', 'base_price': 15, 'per_day': True},
        {'type': 'scooter', 'name': 'Scooter Rental', 'base_price': 25, 'per_day': True},
    ]
    
    INTERCITY_PROVIDERS = ['SkyWings', 'AirConnect', 'GlobalAir', 'JetBlue', 'AirExpress', 'FlyDirect']
    GROUND_PROVIDERS = ['EuroRail', 'SpeedTrain', 'ExpressBus', 'TransGlobal', 'RailConnect', 'CoachLine']
    LOCAL_PROVIDERS = ['CityRentals', 'LocalMove', 'EasyRide', 'QuickTransit', 'UrbanGo', 'MetroPass']
    
    # Flight-only templates (primary transport)
    FLIGHT_OPTIONS = [
        {'type': 'flight', 'name': 'Economy Flight', 'base_price': 200, 'duration_range': (60, 180)},
        {'type': 'flight', 'name': 'Economy Plus Flight', 'base_price': 280, 'duration_range': (60, 180)},
        {'type': 'flight', 'name': 'Premium Economy Flight', 'base_price': 350, 'duration_range': (60, 180)},
        {'type': 'flight', 'name': 'Business Class Flight', 'base_price': 500, 'duration_range': (60, 180)},
        {'type': 'flight', 'name': 'First Class Flight', 'base_price': 800, 'duration_range': (60, 180)},
    ]
    
    # Ground transport alternatives (only if no flights)
    GROUND_TRANSPORT = [
        {'type': 'train', 'name': 'High-Speed Train', 'base_price': 80, 'duration_range': (120, 360)},
        {'type': 'train', 'name': 'Standard Train', 'base_price': 40, 'duration_range': (180, 480)},
        {'type': 'bus', 'name': 'Luxury Coach', 'base_price': 50, 'duration_range': (240, 720)},
        {'type': 'bus', 'name': 'Standard Bus', 'base_price': 25, 'duration_range': (300, 840)},
    ]
    
    def get_transport_options(self, origin: str, destination: str, num_results: int = 8, flights_only: bool = True) -> List[Dict]:
        """
        Generate mock inter-city transport options from origin to destination.
        
        Args:
            origin: Origin city
            destination: Destination city
            num_results: Max number of results
            flights_only: If True, only return flights. If False, include ground transport.
        """
        options = []
        origin_display = origin if origin else "Your City"
        
        # Primary: Generate flight options
        flight_templates = self.FLIGHT_OPTIONS.copy()
        random.shuffle(flight_templates)
        
        for i, template in enumerate(flight_templates[:num_results]):
            price_variance = random.uniform(0.7, 1.4)
            price = round(template['base_price'] * price_variance, 2)
            
            duration = random.randint(template['duration_range'][0], template['duration_range'][1])
            
            # Generate departure and arrival times
            departure_hour = random.randint(6, 20)
            departure_minute = random.choice([0, 15, 30, 45])
            
            options.append({
                'id': i + 1,
                'type': template['type'],
                'category': 'intercity',  # Mark as inter-city transport
                'name': template['name'],
                'provider': random.choice(self.INTERCITY_PROVIDERS),
                'price_per_person': price,
                'currency': 'USD',
                'duration_minutes': duration,
                'origin': origin_display,
                'destination': destination,
                'departure_time': f"{departure_hour:02d}:{departure_minute:02d}",
                'description': f"{template['name']} from {origin_display} to {destination}"
            })
        
        return sorted(options, key=lambda x: x['price_per_person'])
    
    def get_local_transport(self, destination: str, num_days: int = 1, num_results: int = 6) -> List[Dict]:
        """Generate mock local transport options at the destination"""
        options = []
        
        for i, template in enumerate(random.sample(self.LOCAL_TRANSPORT, min(num_results, len(self.LOCAL_TRANSPORT)))):
            price_variance = random.uniform(0.8, 1.2)
            base_price = round(template['base_price'] * price_variance, 2)
            
            # Calculate total price based on whether it's per-day pricing
            if template['per_day']:
                total_price = base_price * num_days
                price_note = f"${base_price}/day × {num_days} days"
            else:
                total_price = base_price
                price_note = "One-time fee"
            
            options.append({
                'id': 100 + i,  # Offset ID to avoid conflicts
                'type': template['type'],
                'category': 'local',  # Mark as local transport
                'name': template['name'],
                'provider': random.choice(self.LOCAL_PROVIDERS),
                'price_per_person': base_price,
                'total_price': total_price,
                'price_note': price_note,
                'per_day': template['per_day'],
                'currency': 'USD',
                'duration_minutes': None,
                'origin': destination,
                'destination': destination,
                'departure_time': None,
                'description': f"{template['name']} in {destination}"
            })
        
        return sorted(options, key=lambda x: x['total_price'])


class TravelRecommendationService:
    """
    Main service that combines all APIs to generate travel recommendations.
    
    Supports multiple API modes:
    - 'mock': Use generated test data (default)
    - 'amadeus': Use real Amadeus API for flights and hotels
    - 'hybrid': Use Amadeus for flights, mock for hotels
    
    Set API_MODE in your .env file to switch modes.
    """
    
    def __init__(self):
        self.attraction_service = MockAttractionService()
        self.hotel_service = MockHotelService()
        self.transport_service = MockTransportService()
        
        # Get API mode from settings
        self.api_mode = getattr(settings, 'API_MODE', 'mock')
        
        # Initialize Amadeus service if needed
        self.amadeus_service = None
        if self.api_mode in ['amadeus', 'hybrid']:
            try:
                from .amadeus_service import AmadeusService
                self.amadeus_service = AmadeusService()
            except ImportError:
                print("Warning: AmadeusService not available, falling back to mock data")
                self.api_mode = 'mock'
    
    def get_recommendations(
        self,
        destination: str,
        check_in: str,
        check_out: str,
        people: int = 1,
        rooms: int = 1,
        origin: str = '',
        budget: int = None
    ) -> Dict[str, Any]:
        """
        Get comprehensive travel recommendations for a destination.
        Uses configured API mode to fetch data.
        
        Args:
            budget: Maximum total budget in USD. If provided, filters results.
        """
        from datetime import datetime
        
        # Calculate nights
        check_in_date = datetime.strptime(check_in, '%Y-%m-%d')
        check_out_date = datetime.strptime(check_out, '%Y-%m-%d')
        nights = (check_out_date - check_in_date).days
        
        # Get coordinates for the destination (mock)
        coords = self.attraction_service.get_coordinates(destination)
        
        # Get hotels based on API mode
        hotels = self._get_hotels(destination, check_in, check_out, people, rooms)
        
        # Get inter-city transport (flights, trains, buses) based on API mode
        transports = self._get_transports(origin, destination, check_in, check_out, people)
        
        # Get local transport options (car rental, taxi, metro) at destination
        local_transports = self.transport_service.get_local_transport(destination, num_days=nights)
        
        # Generate mock attractions
        attractions = self._generate_mock_attractions(destination)
        
        # Apply budget filter if specified
        if budget and budget > 0:
            # Filter hotels: total cost (per night * nights * rooms) must be within budget portion
            hotel_budget = budget * 0.6  # Allocate 60% of budget to hotels (increased from 50%)
            transport_budget = budget * 0.3  # Allocate 30% to transport
            
            # Filter but keep at least some hotels
            filtered_hotels = [h for h in hotels if h['price_per_night'] * nights * rooms <= hotel_budget]
            if filtered_hotels:
                hotels = filtered_hotels
            # If no hotels match budget, keep all but sort by price
            else:
                hotels = sorted(hotels, key=lambda x: x['price_per_night'])
            
            filtered_transports = [t for t in transports if t['price_per_person'] * people <= transport_budget]
            if filtered_transports:
                transports = filtered_transports
            
            # Filter local transport too
            local_transport_budget = budget * 0.1  # 10% for local transport
            filtered_local = [lt for lt in local_transports if lt.get('total_price', 0) <= local_transport_budget]
            if filtered_local:
                local_transports = filtered_local
        
        # Calculate price summary
        cheapest_hotel = hotels[0] if hotels else None
        cheapest_transport = transports[0] if transports else None
        cheapest_local = local_transports[0] if local_transports else None
        
        hotel_total = cheapest_hotel['price_per_night'] * nights * rooms if cheapest_hotel else 0
        transport_total = cheapest_transport['price_per_person'] * people if cheapest_transport else 0
        local_transport_total = cheapest_local.get('total_price', 0) if cheapest_local else 0
        attractions_total = sum(a['price_per_person'] for a in attractions[:5]) * people
        
        summary = {
            'origin': {
                'name': origin if origin else 'Not specified'
            },
            'destination': {
                'name': destination,
                'coordinates': coords
            },
            'trip_details': {
                'origin': origin if origin else 'Not specified',
                'check_in': check_in,
                'check_out': check_out,
                'nights': nights,
                'people': people,
                'rooms': rooms,
                'budget': budget
            },
            'price_breakdown': {
                'hotel_min': hotel_total,
                'transport_min': transport_total,
                'local_transport_min': local_transport_total,
                'attractions_estimated': attractions_total,
                'total_min': round(hotel_total + transport_total + local_transport_total + attractions_total, 2),
                'currency': 'USD'
            },
            'options_count': {
                'hotels': len(hotels),
                'transports': len(transports),
                'local_transports': len(local_transports),
                'attractions': len(attractions)
            },
            'data_source': self.api_mode,  # Tell frontend which data source was used
            'budget_applied': budget is not None and budget > 0
        }
        
        return {
            'summary': summary,
            'hotels': hotels,
            'transports': transports,  # Inter-city transport (flights, trains, buses)
            'local_transports': local_transports,  # Local transport (car rental, taxi, metro)
            'attractions': attractions
        }
    
    def _get_hotels(self, city: str, check_in: str, check_out: str, adults: int, rooms: int) -> List[Dict]:
        """Get hotels from configured source"""
        if self.api_mode == 'amadeus' and self.amadeus_service and self.amadeus_service.is_configured():
            try:
                hotels = self.amadeus_service.search_hotels(city, check_in, check_out, adults, rooms)
                if hotels:
                    return hotels
            except Exception as e:
                print(f"Amadeus hotel search failed, falling back to mock: {e}")
        
        # Fallback to mock data
        return self.hotel_service.get_hotels(city)
    
    def _get_transports(self, origin: str, destination: str, departure_date: str, return_date: str, adults: int) -> List[Dict]:
        """Get transport options from configured source"""
        if self.api_mode in ['amadeus', 'hybrid'] and self.amadeus_service and self.amadeus_service.is_configured():
            try:
                flights = self.amadeus_service.search_flights(
                    origin or 'NYC',  # Default origin if not specified
                    destination,
                    departure_date,
                    return_date,
                    adults
                )
                if flights:
                    # Add mock ground transport options to flight results
                    ground_transport = self.transport_service.get_transport_options(origin, destination, num_results=3)
                    # Filter out flights from mock to avoid duplicates
                    ground_transport = [t for t in ground_transport if t['type'] != 'flight']
                    return flights + ground_transport
            except Exception as e:
                print(f"Amadeus flight search failed, falling back to mock: {e}")
        
        # Fallback to mock data
        return self.transport_service.get_transport_options(origin, destination)
    
    def _map_kinds_to_category(self, kinds: str) -> str:
        """Map OpenTripMap kinds to our category choices"""
        kinds_lower = kinds.lower()
        if 'museum' in kinds_lower:
            return 'museum'
        elif 'natural' in kinds_lower or 'park' in kinds_lower:
            return 'nature'
        elif 'beach' in kinds_lower:
            return 'beach'
        elif 'cultural' in kinds_lower or 'historic' in kinds_lower:
            return 'cultural'
        elif 'entertainment' in kinds_lower or 'amusement' in kinds_lower:
            return 'entertainment'
        elif 'food' in kinds_lower or 'restaurant' in kinds_lower:
            return 'food'
        elif 'shop' in kinds_lower:
            return 'shopping'
        elif 'sport' in kinds_lower or 'adventure' in kinds_lower:
            return 'adventure'
        else:
            return 'landmark'
    
    def _generate_mock_attractions(self, destination: str) -> List[Dict]:
        """Generate mock attractions when API is unavailable"""
        templates = [
            {'name': 'City Museum', 'category': 'museum', 'price': 15},
            {'name': 'Central Park', 'category': 'nature', 'price': 0},
            {'name': 'Historic Castle', 'category': 'landmark', 'price': 20},
            {'name': 'Local Market', 'category': 'shopping', 'price': 0},
            {'name': 'Beach Resort', 'category': 'beach', 'price': 10},
            {'name': 'Adventure Park', 'category': 'adventure', 'price': 45},
            {'name': 'Cultural Center', 'category': 'cultural', 'price': 12},
            {'name': 'Botanical Garden', 'category': 'nature', 'price': 8},
            {'name': 'Art Gallery', 'category': 'museum', 'price': 18},
            {'name': 'Food Street', 'category': 'food', 'price': 0},
        ]
        
        attractions = []
        for i, template in enumerate(templates):
            attractions.append({
                'id': f'mock_{i}',
                'name': f"{destination} {template['name']}",
                'category': template['category'],
                'price_per_person': template['price'],
                'currency': 'USD',
                'rating': round(random.uniform(7.0, 9.5), 1),
                'description': f"Visit the famous {template['name']} in {destination}"
            })
        
        return attractions
