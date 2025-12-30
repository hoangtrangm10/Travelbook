"""
Smart Travel Planner Service - Template-based itinerary generation.
No external AI API required. Fast, reliable, and always available.
"""

import random
from typing import Dict, List, Any
from datetime import datetime, timedelta


class TravelPlannerService:
    """
    Smart travel planner using template-based generation.
    No AI API required - works offline and is always fast.
    """
    
    TRAVEL_TYPES = {
        'nature': {
            'description': 'outdoor activities, hiking, beaches, national parks, wildlife',
            'morning_activities': [
                'Start the day with a scenic nature walk',
                'Early morning hike to catch the sunrise',
                'Visit a local botanical garden',
                'Explore a nearby nature reserve',
                'Morning bird watching tour'
            ],
            'afternoon_activities': [
                'Picnic lunch at a scenic viewpoint',
                'Kayaking or paddleboarding adventure',
                'Wildlife safari or nature tour',
                'Beach relaxation and swimming',
                'Visit a national park trail'
            ],
            'evening_activities': [
                'Sunset watching at a scenic spot',
                'Stargazing experience',
                'Campfire dinner experience',
                'Evening nature documentary at visitor center',
                'Relaxing spa treatment'
            ]
        },
        'culture': {
            'description': 'museums, historical sites, architecture, local traditions',
            'morning_activities': [
                'Visit the city\'s main museum',
                'Walking tour of historical district',
                'Explore ancient architecture',
                'Morning at an art gallery',
                'Visit a UNESCO World Heritage site'
            ],
            'afternoon_activities': [
                'Guided tour of local landmarks',
                'Traditional craft workshop',
                'Explore local markets and bazaars',
                'Visit historical monuments',
                'Architecture photography walk'
            ],
            'evening_activities': [
                'Traditional cultural performance',
                'Dinner at a heritage restaurant',
                'Night tour of illuminated monuments',
                'Local music and dance show',
                'Evening stroll through old town'
            ]
        },
        'food': {
            'description': 'local cuisine, food tours, cooking classes, markets',
            'morning_activities': [
                'Visit a local breakfast market',
                'Morning cooking class with locals',
                'Coffee tasting tour',
                'Fresh produce market exploration',
                'Bakery and pastry tour'
            ],
            'afternoon_activities': [
                'Street food walking tour',
                'Wine or beer tasting experience',
                'Visit local food producers',
                'Cooking workshop with chef',
                'Food photography tour'
            ],
            'evening_activities': [
                'Fine dining at top-rated restaurant',
                'Food and wine pairing dinner',
                'Night market food exploration',
                'Rooftop dining with views',
                'Traditional dinner with local family'
            ]
        },
        'adventure': {
            'description': 'extreme sports, water activities, mountain climbing',
            'morning_activities': [
                'Early morning mountain trek',
                'Scuba diving or snorkeling',
                'Rock climbing adventure',
                'Zip-lining through forest',
                'White water rafting'
            ],
            'afternoon_activities': [
                'Paragliding experience',
                'Mountain biking tour',
                'Canyoning adventure',
                'Surfing lessons',
                'ATV or quad biking'
            ],
            'evening_activities': [
                'Night diving experience',
                'Camping under the stars',
                'Adventure stories at local bar',
                'Planning next day\'s adventure',
                'Recovery massage and dinner'
            ]
        },
        'relaxation': {
            'description': 'spa, resorts, quiet beaches, wellness retreats',
            'morning_activities': [
                'Sunrise yoga session',
                'Morning meditation class',
                'Leisurely breakfast by the pool',
                'Gentle beach walk',
                'Morning spa treatment'
            ],
            'afternoon_activities': [
                'Full body massage and spa',
                'Pool or beach relaxation',
                'Wellness workshop',
                'Aromatherapy session',
                'Reading by the ocean'
            ],
            'evening_activities': [
                'Sunset cocktails',
                'Fine dining experience',
                'Evening meditation',
                'Starlit hot tub soak',
                'Live music at resort'
            ]
        }
    }
    
    DESTINATION_TIPS = {
        'default': [
            "Learn a few basic phrases in the local language",
            "Keep copies of important documents",
            "Check visa requirements before traveling",
            "Get travel insurance for peace of mind",
            "Respect local customs and dress codes"
        ]
    }
    
    HOTEL_PREFERENCES = {
        'luxury': {
            'description': '5-star luxury hotels with premium amenities',
            'price_range': (300, 800),
            'amenities': ['Spa', 'Fine Dining', 'Concierge', 'Pool', 'Gym']
        },
        'boutique': {
            'description': 'Unique boutique hotels with personalized service',
            'price_range': (150, 350),
            'amenities': ['Unique Decor', 'Personalized Service', 'Local Experience']
        },
        'resort': {
            'description': 'All-inclusive resorts with activities',
            'price_range': (200, 500),
            'amenities': ['Pool', 'Beach Access', 'Entertainment', 'All-Inclusive']
        },
        'mid-range': {
            'description': 'Comfortable mid-range hotels',
            'price_range': (80, 180),
            'amenities': ['Free WiFi', 'Breakfast', 'Comfortable Rooms']
        },
        'budget': {
            'description': 'Affordable budget-friendly accommodations',
            'price_range': (30, 80),
            'amenities': ['Free WiFi', 'Clean Rooms', 'Central Location']
        },
        'hostel': {
            'description': 'Social hostels for backpackers',
            'price_range': (15, 50),
            'amenities': ['Social Areas', 'Shared Facilities', 'Tours']
        },
        'apartment': {
            'description': 'Self-catering apartments',
            'price_range': (70, 200),
            'amenities': ['Kitchen', 'Living Space', 'Home-like Experience']
        },
        'unique': {
            'description': 'Unique stays like treehouses, igloos, caves',
            'price_range': (100, 400),
            'amenities': ['Unique Experience', 'Instagram-worthy', 'Adventure']
        }
    }
    
    def __init__(self):
        pass
    
    def generate_travel_plan(
        self,
        origin: str,
        destination: str,
        travel_type: str,
        hotel_preference: str = 'mid-range',
        budget: int = 2000,
        num_days: int = 5,
        num_people: int = 2,
        hotels: List[Dict] = None,
        transports: List[Dict] = None,
        attractions: List[Dict] = None,
        user_set_budget: bool = False
    ) -> Dict[str, Any]:
        """
        Generate a personalized travel plan using templates and real data.
        
        Args:
            origin: Starting city
            destination: Destination city
            travel_type: Type(s) of travel experience (comma-separated for multiple)
            hotel_preference: Preferred hotel type (luxury, boutique, mid-range, budget, etc.)
            budget: Total budget in USD
            num_days: Number of days for the trip
            num_people: Number of travelers
            hotels: List of available hotels
            transports: List of available transport options
            attractions: List of available attractions
            user_set_budget: Whether user explicitly set the budget
        
        Returns:
            Complete travel plan with itinerary
        """
        
        # Handle multiple travel types (comma-separated)
        travel_types_list = [t.strip().lower() for t in travel_type.split(',') if t.strip()]
        if not travel_types_list:
            travel_types_list = ['culture']
        
        # Merge activities from all selected travel types
        merged_config = self._merge_travel_configs(travel_types_list)
        
        # Ensure hotel_preference has a valid value
        if not hotel_preference or hotel_preference not in self.HOTEL_PREFERENCES:
            hotel_preference = 'mid-range'
        
        # Get hotel preference info
        hotel_pref = self.HOTEL_PREFERENCES.get(hotel_preference, self.HOTEL_PREFERENCES['mid-range'])
        
        # Filter and sort hotels based on preference
        filtered_hotels = self._filter_hotels_by_preference(hotels or [], hotel_preference, hotel_pref)
        
        # If filtering returned empty, use original hotels sorted by price
        if not filtered_hotels and hotels:
            filtered_hotels = sorted(hotels, key=lambda x: x.get('price_per_night', 0))
        
        # Calculate budgets
        daily_budget = budget // num_days if num_days > 0 else budget
        per_person_budget = budget // num_people if num_people > 0 else budget
        
        # Generate day-by-day itinerary
        itinerary = self._generate_itinerary(
            destination=destination,
            travel_type=travel_type,
            travel_config=merged_config,
            num_days=num_days,
            daily_budget=daily_budget,
            hotels=filtered_hotels,
            transports=transports or [],
            attractions=attractions or []
        )
        
        # Calculate costs
        hotel_cost = 0
        transport_cost = 0
        attraction_cost_actual = 0
        attraction_budget = 0
        
        recommended_hotel = None
        recommended_transport = None
        
        if filtered_hotels and len(filtered_hotels) > 0:
            recommended_hotel = filtered_hotels[0]
            hotel_cost = recommended_hotel.get('price_per_night', 0) * num_days
        
        if transports and len(transports) > 0:
            recommended_transport = transports[0]
            transport_cost = recommended_transport.get('price_per_person', 0) * num_people
        
        # Calculate actual attraction costs from the generated itinerary
        # Sum up all activity costs from each day (these are per-person costs)
        itinerary_per_person_cost = 0
        for day in itinerary:
            for activity in day.get('activities', []):
                itinerary_per_person_cost += activity.get('estimated_cost', 0)
        
        # Multiply by num_people to get total activities cost
        attraction_cost_actual = itinerary_per_person_cost * num_people
        
        # Calculate attraction budget (remaining from user's budget)
        if user_set_budget:
            attraction_budget = max(0, budget - hotel_cost - transport_cost)
        else:
            attraction_budget = attraction_cost_actual
        
        # Use actual costs for total estimation
        total_estimated = hotel_cost + transport_cost + attraction_cost_actual
        
        # Generate tips
        tips = self._generate_tips(destination, travel_types_list[0] if travel_types_list else 'culture')
        
        # Add hotel-specific tips
        hotel_tips = self._generate_hotel_tips(hotel_preference)
        tips.extend(hotel_tips)
        
        # Create description from selected types
        type_descriptions = []
        for t in travel_types_list:
            if t in self.TRAVEL_TYPES:
                type_descriptions.append(self.TRAVEL_TYPES[t]['description'])
        combined_description = '; '.join(type_descriptions) if type_descriptions else 'General travel experience'
        
        # Build hotel accommodation details
        accommodation = None
        if recommended_hotel:
            accommodation = {
                'hotel_name': recommended_hotel.get('name', 'Recommended Hotel'),
                'hotel_type': hotel_preference,
                'price_per_night': recommended_hotel.get('price_per_night', 0),
                'total_nights': num_days,
                'total_cost': hotel_cost,
                'check_in_time': '3:00 PM',
                'check_out_time': '11:00 AM',
                'amenities': recommended_hotel.get('amenities', hotel_pref.get('amenities', [])),
                'rating': recommended_hotel.get('rating', 0),
                'stars': recommended_hotel.get('stars', recommended_hotel.get('star_rating', 3)),
                'address': recommended_hotel.get('address', f'{destination} City Center'),
                'image': recommended_hotel.get('image', recommended_hotel.get('image_url', ''))
            }
        
        # Check if trip exceeds budget
        budget_warning = None
        budget_exceeded = False
        if user_set_budget and total_estimated > budget:
            budget_exceeded = True
            over_budget_amount = total_estimated - budget
            budget_warning = {
                'type': 'over_budget',
                'message': f'This trip exceeds your budget of ${budget:,} by ${over_budget_amount:,.2f}',
                'suggestion': 'Consider adjusting your travel dates, choosing budget-friendly hotels, or increasing your budget.',
                'over_amount': over_budget_amount,
                'required_budget': total_estimated
            }
        
        return {
            'success': True,
            'budget_exceeded': budget_exceeded,
            'budget_warning': budget_warning,
            'plan': {
                'origin': origin,
                'destination': destination,
                'travel_type': travel_type,
                'travel_types': travel_types_list,
                'hotel_preference': hotel_preference,
                'hotel_preference_description': hotel_pref['description'],
                'travel_type_description': combined_description,
                'budget': budget,
                'budget_exceeded': budget_exceeded,
                'budget_warning': budget_warning,
                'num_days': num_days,
                'num_people': num_people,
                'daily_budget': daily_budget,
                'per_person_budget': per_person_budget,
                'itinerary': itinerary,
                'itinerary_text': self._format_itinerary_text(itinerary, destination, travel_type, budget, num_people, num_days),
                'recommended_hotel': recommended_hotel,
                'accommodation': accommodation,
                'recommended_transport': recommended_transport,
                'top_attractions': attractions[:5] if attractions else [],
                'cost_breakdown': {
                    'hotel': hotel_cost,
                    'transport': transport_cost,
                    'activities_budget': attraction_budget,
                    'activities_actual': attraction_cost_actual,
                    'activities_per_person': itinerary_per_person_cost,
                    'estimated_total': total_estimated,
                    'remaining_budget': budget - total_estimated
                },
                'tips': tips
            }
        }
    
    def _merge_travel_configs(self, travel_types: List[str]) -> Dict:
        """Merge activities from multiple travel types"""
        merged = {
            'description': '',
            'morning_activities': [],
            'afternoon_activities': [],
            'evening_activities': []
        }
        
        descriptions = []
        for travel_type in travel_types:
            config = self.TRAVEL_TYPES.get(travel_type, {})
            if config:
                descriptions.append(config.get('description', ''))
                merged['morning_activities'].extend(config.get('morning_activities', []))
                merged['afternoon_activities'].extend(config.get('afternoon_activities', []))
                merged['evening_activities'].extend(config.get('evening_activities', []))
        
        merged['description'] = '; '.join(descriptions)
        
        # Shuffle to mix activities from different types
        random.shuffle(merged['morning_activities'])
        random.shuffle(merged['afternoon_activities'])
        random.shuffle(merged['evening_activities'])
        
        return merged
    
    def _generate_itinerary(
        self,
        destination: str,
        travel_type: str,
        travel_config: Dict,
        num_days: int,
        daily_budget: int,
        hotels: List[Dict],
        transports: List[Dict],
        attractions: List[Dict]
    ) -> List[Dict]:
        """Generate day-by-day itinerary"""
        
        itinerary = []
        used_attractions = []
        
        # Calculate actual activity budget from attractions
        total_attraction_cost = sum(a.get('price_per_person', 0) for a in attractions[:5]) if attractions else 0
        avg_attraction_cost = total_attraction_cost / 5 if attractions else 15
        
        # Get recommended hotel info
        recommended_hotel = hotels[0] if hotels else None
        
        for day in range(1, num_days + 1):
            day_plan = {
                'day': day,
                'title': f"Day {day} in {destination}",
                'activities': []
            }
            
            # Morning activity
            morning = {
                'time': 'Morning (9:00 AM)',
                'activity': '',
                'description': '',
                'estimated_cost': 0
            }
            
            if day == 1:
                # First day: arrival and hotel check-in
                if transports:
                    transport = transports[0]
                    morning['activity'] = f"Arrive via {transport.get('name', 'transport')}"
                    if recommended_hotel:
                        morning['description'] = f"Travel to {destination}. Check into {recommended_hotel.get('name', 'your hotel')} (Check-in: 3:00 PM)"
                    else:
                        morning['description'] = f"Travel to {destination}. Check into your hotel and freshen up."
                    # Don't add transport cost here as it's counted separately in cost_breakdown
                    morning['estimated_cost'] = 0
                else:
                    morning['activity'] = f"Arrive in {destination}"
                    if recommended_hotel:
                        morning['description'] = f"Check into {recommended_hotel.get('name', 'your hotel')} (Check-in: 3:00 PM) and settle in"
                    else:
                        morning['description'] = f"Check into your hotel and settle in"
                    morning['estimated_cost'] = 0
            else:
                morning['activity'] = random.choice(travel_config['morning_activities'])
                morning['description'] = f"Start your day with this {travel_type} experience"
                # Use free activities for morning walks/explorations
                morning['estimated_cost'] = 0
            
            day_plan['activities'].append(morning)
            
            # Afternoon activity - use real attractions with actual costs
            afternoon = {
                'time': 'Afternoon (2:00 PM)',
                'activity': '',
                'description': '',
                'estimated_cost': 0
            }
            
            # Try to use real attractions
            available_attractions = [a for a in attractions if a.get('name') not in used_attractions]
            if available_attractions:
                attraction = available_attractions[0]
                used_attractions.append(attraction.get('name'))
                afternoon['activity'] = f"Visit {attraction.get('name', 'local attraction')}"
                afternoon['description'] = attraction.get('description', f"Visit the famous {attraction.get('name')} in {destination}")
                afternoon['estimated_cost'] = attraction.get('price_per_person', 0)
            else:
                afternoon['activity'] = random.choice(travel_config['afternoon_activities'])
                afternoon['description'] = f"Enjoy {travel_type} activities in {destination}"
                # Free afternoon activity (walking tour, exploring, etc.)
                afternoon['estimated_cost'] = 0
            
            day_plan['activities'].append(afternoon)
            
            # Evening activity
            evening = {
                'time': 'Evening (7:00 PM)',
                'activity': '',
                'description': '',
                'estimated_cost': 0
            }
            
            if day == num_days:
                # Last day: check-out and departure
                evening['activity'] = "Prepare for departure"
                if recommended_hotel:
                    evening['description'] = f"Check out from {recommended_hotel.get('name', 'hotel')} (Check-out: 11:00 AM), enjoy a final dinner, and prepare for your journey home"
                else:
                    evening['description'] = "Check out, enjoy a final dinner, and prepare for your journey home"
                evening['estimated_cost'] = 0
            else:
                evening['activity'] = random.choice(travel_config['evening_activities'])
                evening['description'] = f"End your day with a memorable {travel_type} experience"
                # Evening activities are typically dining/entertainment, keep as included/free
                evening['estimated_cost'] = 0
            
            day_plan['activities'].append(evening)
            
            # Calculate day total (only paid activities)
            day_plan['day_total'] = sum(a['estimated_cost'] for a in day_plan['activities'])
            
            itinerary.append(day_plan)
        
        return itinerary
    
    def _format_itinerary_text(
        self,
        itinerary: List[Dict],
        destination: str,
        travel_type: str,
        budget: int,
        num_people: int,
        num_days: int
    ) -> str:
        """Format itinerary as readable text"""
        
        lines = [
            f"# {num_days}-Day {travel_type.title()} Trip to {destination}",
            f"**Total Budget:** ${budget} for {num_people} {'person' if num_people == 1 else 'people'}",
            f"**Daily Budget:** ${budget // num_days}",
            ""
        ]
        
        for day in itinerary:
            lines.append(f"## {day['title']}")
            lines.append("")
            
            for activity in day['activities']:
                lines.append(f"**{activity['time']}**")
                lines.append(f"- {activity['activity']}")
                lines.append(f"  _{activity['description']}_")
                if activity['estimated_cost'] > 0:
                    lines.append(f"  Est. cost: ${activity['estimated_cost']:.0f}")
                lines.append("")
            
            lines.append(f"**Day Total:** ${day['day_total']:.0f}")
            lines.append("")
        
        return "\n".join(lines)
    
    def _generate_tips(self, destination: str, travel_type: str) -> List[str]:
        """Generate travel tips"""
        
        general_tips = [
            f"Best time to visit {destination}: Check local weather patterns",
            "Download offline maps before your trip",
            "Keep emergency contact numbers handy",
            "Try local cuisine for authentic experiences",
            "Book popular attractions in advance"
        ]
        
        type_tips = {
            'nature': [
                "Pack layers for changing weather",
                "Bring a reusable water bottle",
                "Wear comfortable hiking shoes",
                "Carry sunscreen and insect repellent"
            ],
            'culture': [
                "Research local customs before visiting",
                "Dress modestly when visiting religious sites",
                "Consider hiring a local guide",
                "Visit museums on weekday mornings to avoid crowds"
            ],
            'food': [
                "Ask locals for restaurant recommendations",
                "Try street food for authentic flavors",
                "Book popular restaurants in advance",
                "Take a cooking class to learn local recipes"
            ],
            'adventure': [
                "Check equipment safety before activities",
                "Get travel insurance that covers adventure sports",
                "Stay hydrated during physical activities",
                "Know your limits and listen to guides"
            ],
            'relaxation': [
                "Book spa treatments in advance",
                "Bring a good book or download podcasts",
                "Disconnect from work emails",
                "Try local wellness practices"
            ]
        }
        
        tips = general_tips[:3]
        tips.extend(type_tips.get(travel_type.lower(), [])[:2])
        
        return tips
    
    def _filter_hotels_by_preference(
        self,
        hotels: List[Dict],
        hotel_preference: str,
        hotel_pref_config: Dict
    ) -> List[Dict]:
        """
        Filter and sort hotels based on user's preference.
        
        Args:
            hotels: List of available hotels
            hotel_preference: User's hotel preference (luxury, budget, etc.)
            hotel_pref_config: Configuration for the preference
        
        Returns:
            Filtered and sorted list of hotels
        """
        if not hotels:
            return []
        
        price_min, price_max = hotel_pref_config.get('price_range', (0, 1000))
        
        # Score hotels based on how well they match the preference
        scored_hotels = []
        for hotel in hotels:
            price = hotel.get('price_per_night', 0) or 0
            score = 0
            
            # Price range matching
            if price_min <= price <= price_max:
                score += 50  # Perfect price match
            elif price < price_min:
                # Slightly below range - still good for budget-conscious
                score += 30
            else:
                # Above range - penalize but still include
                score += max(0, 20 - (price - price_max) / 50)
            
            # Rating bonus
            rating = hotel.get('rating', 0) or 0
            score += rating * 5
            
            # Amenity matching
            hotel_amenities = set(hotel.get('amenities', []) or [])
            preferred_amenities = set(hotel_pref_config.get('amenities', []) or [])
            matching_amenities = len(hotel_amenities & preferred_amenities)
            score += matching_amenities * 5
            
            # Star rating alignment with preference
            stars = hotel.get('stars', 3) or hotel.get('star_rating', 3) or 3
            if hotel_preference == 'luxury' and stars >= 5:
                score += 20
            elif hotel_preference == 'boutique' and 3 <= stars <= 4:
                score += 15
            elif hotel_preference == 'mid-range' and 3 <= stars <= 4:
                score += 15
            elif hotel_preference == 'budget' and stars <= 3:
                score += 15
            elif hotel_preference == 'hostel' and stars <= 2:
                score += 15
            
            scored_hotels.append((score, hotel))
        
        # Sort by score (highest first)
        scored_hotels.sort(key=lambda x: x[0], reverse=True)
        
        # Return hotels sorted by preference
        return [hotel for score, hotel in scored_hotels]
    
    def _generate_hotel_tips(self, hotel_preference: str) -> List[str]:
        """Generate tips based on hotel preference"""
        tips_by_preference = {
            'luxury': [
                "Book directly with the hotel for potential upgrades",
                "Ask about spa packages and fine dining reservations"
            ],
            'boutique': [
                "These hotels often have unique local experiences",
                "Ask the concierge for insider local recommendations"
            ],
            'resort': [
                "Check what's included in your all-inclusive package",
                "Book activities early as they fill up fast"
            ],
            'mid-range': [
                "Check for loyalty programs for future discounts",
                "Ask about included breakfast options"
            ],
            'budget': [
                "Read recent reviews for cleanliness feedback",
                "Location is key - ensure good public transport access"
            ],
            'hostel': [
                "Bring a lock for your belongings",
                "Join hostel activities to meet fellow travelers"
            ],
            'apartment': [
                "Stock up on groceries to save on dining",
                "Ask the host for local tips and recommendations"
            ],
            'unique': [
                "Read carefully what amenities are available",
                "Book early as unique stays sell out quickly"
            ]
        }
        
        return tips_by_preference.get(hotel_preference, [
            "Book early for better rates",
            "Check cancellation policies before booking"
        ])
    
    def get_conversation_questions(self) -> List[Dict[str, str]]:
        """Get the conversation flow questions for advanced search"""
        return [
            {
                'id': 'origin',
                'question': "Where are you traveling from?",
                'type': 'text',
                'placeholder': 'e.g., New York, London, Tokyo'
            },
            {
                'id': 'destination',
                'question': "Where would you like to go?",
                'type': 'text',
                'placeholder': 'e.g., Paris, Bali, Rome'
            },
            {
                'id': 'travel_type',
                'question': "What type of experience are you looking for?",
                'type': 'select',
                'options': list(self.TRAVEL_TYPES.keys())
            },
            {
                'id': 'num_days',
                'question': "How many days is your trip?",
                'type': 'number',
                'min': 1,
                'max': 30
            },
            {
                'id': 'num_people',
                'question': "How many people are traveling?",
                'type': 'number',
                'min': 1,
                'max': 20
            },
            {
                'id': 'budget',
                'question': "What's your total budget (in USD)?",
                'type': 'number',
                'min': 100
            }
        ]
    
    def get_available_travel_types(self) -> List[Dict[str, str]]:
        """Get list of available travel types with descriptions"""
        return [
            {'id': key, 'name': key.title(), 'description': value['description']}
            for key, value in self.TRAVEL_TYPES.items()
        ]


# Alias for backward compatibility
AITravelPlannerService = TravelPlannerService
