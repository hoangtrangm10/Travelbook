from rest_framework import serializers
from .models import Destination, Hotel, Transport, Attraction, TravelPackage, SearchHistory


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'


class DestinationSimpleSerializer(serializers.ModelSerializer):
    """Simplified serializer for nested use"""
    class Meta:
        model = Destination
        fields = ['id', 'name', 'city', 'country']


class HotelSerializer(serializers.ModelSerializer):
    destination = DestinationSimpleSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = Hotel
        fields = '__all__'
    
    def get_total_price(self, obj):
        request = self.context.get('request')
        if request:
            nights = int(request.query_params.get('nights', 1))
            rooms = int(request.query_params.get('rooms', 1))
            return obj.get_total_price(nights, rooms)
        return float(obj.price_per_night)


class TransportSerializer(serializers.ModelSerializer):
    origin = DestinationSimpleSerializer(read_only=True)
    destination = DestinationSimpleSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    duration_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = Transport
        fields = '__all__'
    
    def get_total_price(self, obj):
        request = self.context.get('request')
        if request:
            people = int(request.query_params.get('people', 1))
            return obj.get_total_price(people)
        return float(obj.price_per_person)
    
    def get_duration_formatted(self, obj):
        if obj.duration_minutes:
            hours = obj.duration_minutes // 60
            minutes = obj.duration_minutes % 60
            if hours > 0:
                return f"{hours}h {minutes}m"
            return f"{minutes}m"
        return None


class AttractionSerializer(serializers.ModelSerializer):
    destination = DestinationSimpleSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = Attraction
        fields = '__all__'
    
    def get_total_price(self, obj):
        request = self.context.get('request')
        if request:
            people = int(request.query_params.get('people', 1))
            return obj.get_total_price(people)
        return float(obj.price_per_person)


class TravelPackageSerializer(serializers.ModelSerializer):
    destination = DestinationSimpleSerializer(read_only=True)
    hotels = HotelSerializer(many=True, read_only=True)
    transports = TransportSerializer(many=True, read_only=True)
    attractions = AttractionSerializer(many=True, read_only=True)
    discounted_price = serializers.SerializerMethodField()
    
    class Meta:
        model = TravelPackage
        fields = '__all__'
    
    def get_discounted_price(self, obj):
        return obj.get_discounted_price()


class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = '__all__'


class TravelSearchSerializer(serializers.Serializer):
    """Serializer for travel search input"""
    origin = serializers.CharField(max_length=200, required=False, allow_blank=True, default='')
    destination = serializers.CharField(max_length=200)
    check_in = serializers.DateField()
    check_out = serializers.DateField()
    people = serializers.IntegerField(min_value=1, max_value=20, default=1)
    rooms = serializers.IntegerField(min_value=1, max_value=10, default=1)
    budget = serializers.IntegerField(min_value=0, required=False, allow_null=True, default=None)
    
    def validate(self, data):
        if data['check_out'] <= data['check_in']:
            raise serializers.ValidationError("Check-out date must be after check-in date")
        return data


class TravelRecommendationSerializer(serializers.Serializer):
    """Serializer for travel recommendations response"""
    destination = DestinationSerializer()
    hotels = HotelSerializer(many=True)
    transports = TransportSerializer(many=True)
    attractions = AttractionSerializer(many=True)
    total_nights = serializers.IntegerField()
    total_people = serializers.IntegerField()
    summary = serializers.DictField()
