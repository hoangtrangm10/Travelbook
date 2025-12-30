from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from datetime import datetime

from .models import Destination, Hotel, Transport, Attraction, TravelPackage, SearchHistory
from .serializers import (
    DestinationSerializer, HotelSerializer, TransportSerializer,
    AttractionSerializer, TravelPackageSerializer, TravelSearchSerializer
)
from .services import TravelRecommendationService


class DestinationViewSet(viewsets.ModelViewSet):
    """ViewSet for Destination CRUD operations"""
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    
    def get_queryset(self):
        queryset = Destination.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(city__icontains=search) |
                Q(country__icontains=search)
            )
        popular = self.request.query_params.get('popular', None)
        if popular and popular.lower() == 'true':
            queryset = queryset.filter(is_popular=True)
        return queryset
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get popular destinations"""
        popular = Destination.objects.filter(is_popular=True)[:10]
        serializer = self.get_serializer(popular, many=True)
        return Response(serializer.data)


class HotelViewSet(viewsets.ModelViewSet):
    """ViewSet for Hotel CRUD operations"""
    queryset = Hotel.objects.filter(is_available=True)
    serializer_class = HotelSerializer
    
    def get_queryset(self):
        queryset = Hotel.objects.filter(is_available=True)
        
        destination = self.request.query_params.get('destination', None)
        if destination:
            queryset = queryset.filter(
                Q(destination__city__icontains=destination) |
                Q(destination__country__icontains=destination)
            )
        
        min_stars = self.request.query_params.get('min_stars', None)
        if min_stars:
            queryset = queryset.filter(star_rating__gte=int(min_stars))
        
        max_price = self.request.query_params.get('max_price', None)
        if max_price:
            queryset = queryset.filter(price_per_night__lte=float(max_price))
        
        sort_by = self.request.query_params.get('sort', 'price')
        if sort_by == 'price':
            queryset = queryset.order_by('price_per_night')
        elif sort_by == 'rating':
            queryset = queryset.order_by('-rating')
        elif sort_by == 'stars':
            queryset = queryset.order_by('-star_rating')
        
        return queryset


class TransportViewSet(viewsets.ModelViewSet):
    """ViewSet for Transport CRUD operations"""
    queryset = Transport.objects.filter(is_available=True)
    serializer_class = TransportSerializer
    
    def get_queryset(self):
        queryset = Transport.objects.filter(is_available=True)
        
        destination = self.request.query_params.get('destination', None)
        if destination:
            queryset = queryset.filter(destination__city__icontains=destination)
        
        transport_type = self.request.query_params.get('type', None)
        if transport_type:
            queryset = queryset.filter(transport_type=transport_type)
        
        return queryset


class AttractionViewSet(viewsets.ModelViewSet):
    """ViewSet for Attraction CRUD operations"""
    queryset = Attraction.objects.filter(is_available=True)
    serializer_class = AttractionSerializer
    
    def get_queryset(self):
        queryset = Attraction.objects.filter(is_available=True)
        
        destination = self.request.query_params.get('destination', None)
        if destination:
            queryset = queryset.filter(destination__city__icontains=destination)
        
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        free_only = self.request.query_params.get('free', None)
        if free_only and free_only.lower() == 'true':
            queryset = queryset.filter(price_per_person=0)
        
        return queryset


class TravelPackageViewSet(viewsets.ModelViewSet):
    """ViewSet for TravelPackage CRUD operations"""
    queryset = TravelPackage.objects.filter(is_available=True)
    serializer_class = TravelPackageSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured travel packages"""
        featured = TravelPackage.objects.filter(is_featured=True, is_available=True)[:6]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)


class TravelSearchView(APIView):
    """
    Main API endpoint for travel search and recommendations.
    POST /api/search/
    """
    
    def post(self, request):
        serializer = TravelSearchSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        # Log search history
        try:
            SearchHistory.objects.create(
                destination_query=data['destination'],
                check_in_date=data['check_in'],
                check_out_date=data['check_out'],
                num_people=data['people'],
                num_rooms=data['rooms'],
                ip_address=self._get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')[:500]
            )
        except Exception:
            pass  # Don't fail if history logging fails
        
        # Get recommendations
        service = TravelRecommendationService()
        recommendations = service.get_recommendations(
            origin=data.get('origin', ''),
            destination=data['destination'],
            check_in=str(data['check_in']),
            check_out=str(data['check_out']),
            people=data['people'],
            rooms=data['rooms'],
            budget=data.get('budget')
        )
        
        return Response(recommendations, status=status.HTTP_200_OK)
    
    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


@api_view(['GET'])
def health_check(request):
    """Health check endpoint"""
    return Response({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })


@api_view(['GET'])
def api_info(request):
    """API information endpoint"""
    from django.conf import settings
    return Response({
        'name': 'Travel Recommendation API',
        'version': '1.0.0',
        'description': 'API for travel recommendations including hotels, transport, and attractions',
        'api_mode': getattr(settings, 'API_MODE', 'mock'),
        'endpoints': {
            'search': '/api/search/',
            'destinations': '/api/destinations/',
            'hotels': '/api/hotels/',
            'transports': '/api/transports/',
            'attractions': '/api/attractions/',
            'packages': '/api/packages/',
            'api_status': '/api/api-status/',
        }
    })


@api_view(['GET'])
def api_status(request):
    """Check the status of external API connections"""
    from django.conf import settings
    
    status_info = {
        'api_mode': getattr(settings, 'API_MODE', 'mock'),
        'amadeus': {
            'configured': False,
            'connected': False,
            'message': 'Not configured'
        },
        'opentripmap': {
            'configured': bool(getattr(settings, 'OPENTRIPMAP_API_KEY', '')),
        }
    }
    
    # Check Amadeus connection
    amadeus_key = getattr(settings, 'AMADEUS_API_KEY', '')
    amadeus_secret = getattr(settings, 'AMADEUS_API_SECRET', '')
    
    if amadeus_key and amadeus_secret:
        status_info['amadeus']['configured'] = True
        try:
            from .amadeus_service import AmadeusService
            amadeus = AmadeusService()
            result = amadeus.test_connection()
            status_info['amadeus']['connected'] = result['success']
            status_info['amadeus']['message'] = result['message']
        except Exception as e:
            status_info['amadeus']['message'] = str(e)
    else:
        status_info['amadeus']['message'] = 'API keys not set. Add AMADEUS_API_KEY and AMADEUS_API_SECRET to .env'
    
    return Response(status_info)


class AITravelPlannerView(APIView):
    """
    Smart travel planning endpoint using template-based generation.
    POST /api/ai-planner/
    """
    
    def get(self, request):
        """Get conversation questions for advanced search"""
        from .ai_planner_service import TravelPlannerService
        
        planner = TravelPlannerService()
        return Response({
            'questions': planner.get_conversation_questions(),
            'travel_types': planner.get_available_travel_types()
        })
    
    def post(self, request):
        """Generate smart travel plan"""
        from .ai_planner_service import TravelPlannerService
        
        try:
            data = request.data
            
            # Validate required fields
            required_fields = ['origin', 'destination', 'travel_type', 'budget', 'num_days', 'num_people']
            for field in required_fields:
                if field not in data:
                    return Response(
                        {'error': f'Missing required field: {field}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Get travel recommendations first (hotels, transport, attractions)
            service = TravelRecommendationService()
            
            # Calculate dates (use tomorrow as check_in for AI planning)
            from datetime import datetime, timedelta
            check_in = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
            check_out = (datetime.now() + timedelta(days=1 + int(data['num_days']))).strftime('%Y-%m-%d')
            
            recommendations = service.get_recommendations(
                origin=data.get('origin', ''),
                destination=data['destination'],
                check_in=check_in,
                check_out=check_out,
                people=int(data['num_people']),
                rooms=max(1, int(data['num_people']) // 2),
                budget=int(data.get('budget', 0))
            )
            
            # Debug: Log hotel count
            print(f"AI Planner - Hotels found: {len(recommendations.get('hotels', []))}")
            if recommendations.get('hotels'):
                print(f"First hotel: {recommendations['hotels'][0].get('name')} - ${recommendations['hotels'][0].get('price_per_night')}/night")
            
            # Generate smart travel plan
            planner = TravelPlannerService()
            
            # Check if user explicitly set budget
            user_set_budget = data.get('user_set_budget', False)
            
            plan = planner.generate_travel_plan(
                origin=data['origin'],
                destination=data['destination'],
                travel_type=data['travel_type'],
                hotel_preference=data.get('hotel_preference', 'mid-range'),
                budget=int(data['budget']),
                num_days=int(data['num_days']),
                num_people=int(data['num_people']),
                hotels=recommendations.get('hotels', []),
                transports=recommendations.get('transports', []),
                attractions=recommendations.get('attractions', []),
                user_set_budget=user_set_budget
            )
            
            # Combine with recommendations
            plan['recommendations'] = recommendations
            
            return Response(plan, status=status.HTTP_200_OK)
        
        except Exception as e:
            import traceback
            print(f"AI Planner Error: {str(e)}")
            print(traceback.format_exc())
            return Response(
                {'error': f'Failed to generate plan: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
def ai_planner_status(request):
    """Check travel planner status"""
    from .ai_planner_service import TravelPlannerService
    
    planner = TravelPlannerService()
    
    return Response({
        'success': True,
        'message': 'Travel planner is ready',
        'travel_types': planner.get_available_travel_types()
    })
