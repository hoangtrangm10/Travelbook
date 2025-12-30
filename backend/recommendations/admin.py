from django.contrib import admin
from .models import Destination, Hotel, Transport, Attraction, TravelPackage, SearchHistory


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'country', 'is_popular', 'created_at']
    list_filter = ['is_popular', 'country']
    search_fields = ['name', 'city', 'country']
    ordering = ['name']


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ['name', 'destination', 'star_rating', 'price_per_night', 'rating', 'is_available']
    list_filter = ['star_rating', 'is_available', 'destination__country']
    search_fields = ['name', 'destination__city']
    ordering = ['-rating']


@admin.register(Transport)
class TransportAdmin(admin.ModelAdmin):
    list_display = ['name', 'transport_type', 'destination', 'provider', 'price_per_person', 'is_available']
    list_filter = ['transport_type', 'is_available']
    search_fields = ['name', 'provider']
    ordering = ['transport_type', 'price_per_person']


@admin.register(Attraction)
class AttractionAdmin(admin.ModelAdmin):
    list_display = ['name', 'destination', 'category', 'price_per_person', 'rating', 'is_available']
    list_filter = ['category', 'is_available', 'destination__country']
    search_fields = ['name', 'destination__city']
    ordering = ['-rating']


@admin.register(TravelPackage)
class TravelPackageAdmin(admin.ModelAdmin):
    list_display = ['name', 'destination', 'duration_days', 'base_price', 'is_featured', 'is_available']
    list_filter = ['is_featured', 'is_available', 'destination__country']
    search_fields = ['name', 'destination__city']
    filter_horizontal = ['hotels', 'transports', 'attractions']


@admin.register(SearchHistory)
class SearchHistoryAdmin(admin.ModelAdmin):
    list_display = ['destination_query', 'check_in_date', 'check_out_date', 'num_people', 'created_at']
    list_filter = ['created_at']
    search_fields = ['destination_query']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
