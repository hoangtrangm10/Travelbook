from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DestinationViewSet, HotelViewSet, TransportViewSet,
    AttractionViewSet, TravelPackageViewSet, TravelSearchView,
    health_check, api_info, api_status, AITravelPlannerView, ai_planner_status
)

router = DefaultRouter()
router.register(r'destinations', DestinationViewSet)
router.register(r'hotels', HotelViewSet)
router.register(r'transports', TransportViewSet)
router.register(r'attractions', AttractionViewSet)
router.register(r'packages', TravelPackageViewSet)

urlpatterns = [
    path('', api_info, name='api-info'),
    path('health/', health_check, name='health-check'),
    path('api-status/', api_status, name='api-status'),
    path('search/', TravelSearchView.as_view(), name='travel-search'),
    path('ai-planner/', AITravelPlannerView.as_view(), name='ai-planner'),
    path('ai-planner/status/', ai_planner_status, name='ai-planner-status'),
    path('', include(router.urls)),
]

