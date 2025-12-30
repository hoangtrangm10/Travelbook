"""
Management command to seed the database with sample data.
Run with: python manage.py seed_data
"""

from django.core.management.base import BaseCommand
from recommendations.models import Destination, Hotel, Transport, Attraction, TravelPackage
import random


class Command(BaseCommand):
    help = 'Seed the database with sample travel data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')
        
        # Create destinations
        destinations_data = [
            {'name': 'Paris', 'country': 'France', 'city': 'Paris', 'is_popular': True,
             'latitude': 48.8566, 'longitude': 2.3522,
             'description': 'The City of Light, known for the Eiffel Tower, art museums, and romantic atmosphere.'},
            {'name': 'Tokyo', 'country': 'Japan', 'city': 'Tokyo', 'is_popular': True,
             'latitude': 35.6762, 'longitude': 139.6503,
             'description': 'A vibrant metropolis blending traditional temples with cutting-edge technology.'},
            {'name': 'New York', 'country': 'USA', 'city': 'New York', 'is_popular': True,
             'latitude': 40.7128, 'longitude': -74.0060,
             'description': 'The Big Apple - famous for Times Square, Central Park, and world-class museums.'},
            {'name': 'London', 'country': 'UK', 'city': 'London', 'is_popular': True,
             'latitude': 51.5074, 'longitude': -0.1278,
             'description': 'Historic capital with royal palaces, iconic landmarks, and vibrant culture.'},
            {'name': 'Barcelona', 'country': 'Spain', 'city': 'Barcelona', 'is_popular': True,
             'latitude': 41.3851, 'longitude': 2.1734,
             'description': 'Mediterranean gem famous for Gaudí architecture and beautiful beaches.'},
        ]

        destinations = []
        for data in destinations_data:
            dest, created = Destination.objects.get_or_create(
                city=data['city'],
                country=data['country'],
                defaults=data
            )
            destinations.append(dest)
            if created:
                self.stdout.write(f'  Created destination: {dest}')

        # Create hotels for each destination
        hotel_templates = [
            {'name': 'Grand Palace Hotel', 'stars': 5, 'base_price': 350},
            {'name': 'City Center Inn', 'stars': 4, 'base_price': 180},
            {'name': 'Budget Express', 'stars': 3, 'base_price': 85},
            {'name': 'Luxury Resort & Spa', 'stars': 5, 'base_price': 450},
            {'name': 'Comfort Suites', 'stars': 4, 'base_price': 150},
        ]

        amenities_pool = ['Free WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar',
                          'Room Service', 'Parking', 'Airport Shuttle', 'Pet Friendly']

        for dest in destinations:
            for template in hotel_templates:
                amenities = random.sample(amenities_pool, min(template['stars'] * 2, len(amenities_pool)))
                Hotel.objects.get_or_create(
                    name=f"{template['name']} {dest.city}",
                    destination=dest,
                    defaults={
                        'address': f"123 Main Street, {dest.city}",
                        'star_rating': template['stars'],
                        'price_per_night': template['base_price'] + random.randint(-20, 50),
                        'amenities': amenities,
                        'rating': round(random.uniform(7.5, 9.8), 1),
                        'reviews_count': random.randint(100, 2000),
                        'description': f"Experience luxury and comfort at {template['name']} in the heart of {dest.city}.",
                    }
                )
            self.stdout.write(f'  Created hotels for {dest.city}')

        # Create transport options
        transport_templates = [
            {'type': 'flight', 'name': 'Economy Flight', 'price': 250, 'duration': 120},
            {'type': 'flight', 'name': 'Business Flight', 'price': 650, 'duration': 120},
            {'type': 'train', 'name': 'Express Train', 'price': 95, 'duration': 240},
            {'type': 'bus', 'name': 'Luxury Bus', 'price': 55, 'duration': 360},
            {'type': 'car_rental', 'name': 'Economy Car', 'price': 45, 'duration': None},
        ]

        for dest in destinations:
            for template in transport_templates:
                Transport.objects.get_or_create(
                    name=f"{template['name']} to {dest.city}",
                    destination=dest,
                    transport_type=template['type'],
                    defaults={
                        'provider': random.choice(['TransGlobal', 'EasyTravel', 'QuickMove']),
                        'price_per_person': template['price'] + random.randint(-10, 30),
                        'duration_minutes': template['duration'],
                        'description': f"{template['name']} service to {dest.city}",
                    }
                )
            self.stdout.write(f'  Created transport for {dest.city}')

        # Create attractions
        attraction_templates = [
            {'name': 'City Museum', 'category': 'museum', 'price': 15},
            {'name': 'Central Park', 'category': 'nature', 'price': 0},
            {'name': 'Historic Castle', 'category': 'landmark', 'price': 25},
            {'name': 'Local Market', 'category': 'shopping', 'price': 0},
            {'name': 'Adventure Park', 'category': 'adventure', 'price': 45},
            {'name': 'Art Gallery', 'category': 'cultural', 'price': 18},
            {'name': 'Food Tour', 'category': 'food', 'price': 35},
        ]

        for dest in destinations:
            for template in attraction_templates:
                Attraction.objects.get_or_create(
                    name=f"{dest.city} {template['name']}",
                    destination=dest,
                    defaults={
                        'category': template['category'],
                        'price_per_person': template['price'],
                        'rating': round(random.uniform(7.0, 9.5), 1),
                        'reviews_count': random.randint(50, 500),
                        'description': f"Visit the famous {template['name']} in {dest.city}.",
                        'duration_hours': random.choice([1, 2, 3, 4]),
                    }
                )
            self.stdout.write(f'  Created attractions for {dest.city}')

        self.stdout.write(self.style.SUCCESS('Database seeding completed!'))
