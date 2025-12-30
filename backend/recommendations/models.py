from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Destination(models.Model):
    """Popular travel destinations"""
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    image_url = models.URLField(blank=True)
    is_popular = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        unique_together = ['city', 'country']

    def __str__(self):
        return f"{self.city}, {self.country}"


class Hotel(models.Model):
    """Hotel information"""
    STAR_CHOICES = [(i, f'{i} Star') for i in range(1, 6)]
    
    name = models.CharField(max_length=200)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='hotels')
    address = models.TextField()
    description = models.TextField(blank=True)
    star_rating = models.IntegerField(choices=STAR_CHOICES, default=3)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    amenities = models.JSONField(default=list, blank=True)
    image_url = models.URLField(blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0, 
                                  validators=[MinValueValidator(0), MaxValueValidator(10)])
    reviews_count = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating', 'price_per_night']

    def __str__(self):
        return f"{self.name} - {self.destination.city}"

    def get_total_price(self, nights, rooms=1):
        return float(self.price_per_night) * nights * rooms


class Transport(models.Model):
    """Transportation options"""
    TRANSPORT_TYPES = [
        ('flight', 'Flight'),
        ('train', 'Train'),
        ('bus', 'Bus'),
        ('car_rental', 'Car Rental'),
        ('taxi', 'Taxi/Transfer'),
        ('ferry', 'Ferry'),
    ]
    
    name = models.CharField(max_length=200)
    transport_type = models.CharField(max_length=20, choices=TRANSPORT_TYPES)
    origin = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='departures', null=True, blank=True)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='arrivals')
    provider = models.CharField(max_length=100, blank=True)
    price_per_person = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    duration_minutes = models.IntegerField(null=True, blank=True)
    description = models.TextField(blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['price_per_person']

    def __str__(self):
        return f"{self.transport_type} - {self.name}"

    def get_total_price(self, people):
        return float(self.price_per_person) * people


class Attraction(models.Model):
    """Tourist attractions and activities"""
    CATEGORY_CHOICES = [
        ('landmark', 'Landmark'),
        ('museum', 'Museum'),
        ('nature', 'Nature'),
        ('entertainment', 'Entertainment'),
        ('food', 'Food & Dining'),
        ('shopping', 'Shopping'),
        ('adventure', 'Adventure'),
        ('cultural', 'Cultural'),
        ('beach', 'Beach'),
        ('nightlife', 'Nightlife'),
    ]
    
    name = models.CharField(max_length=200)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='attractions')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    address = models.TextField(blank=True)
    price_per_person = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='USD')
    duration_hours = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    image_url = models.URLField(blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0,
                                  validators=[MinValueValidator(0), MaxValueValidator(10)])
    reviews_count = models.IntegerField(default=0)
    opening_hours = models.CharField(max_length=100, blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating', 'name']

    def __str__(self):
        return f"{self.name} - {self.destination.city}"

    def get_total_price(self, people):
        return float(self.price_per_person) * people


class TravelPackage(models.Model):
    """Pre-built travel packages"""
    name = models.CharField(max_length=200)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='packages')
    description = models.TextField(blank=True)
    hotels = models.ManyToManyField(Hotel, blank=True)
    transports = models.ManyToManyField(Transport, blank=True)
    attractions = models.ManyToManyField(Attraction, blank=True)
    duration_days = models.IntegerField(default=1)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    image_url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', 'base_price']

    def __str__(self):
        return f"{self.name} - {self.destination.city}"

    def get_discounted_price(self):
        discount = float(self.base_price) * float(self.discount_percentage) / 100
        return float(self.base_price) - discount


class SearchHistory(models.Model):
    """Track user searches for analytics"""
    destination_query = models.CharField(max_length=200)
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    num_people = models.IntegerField(default=1)
    num_rooms = models.IntegerField(default=1)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Search histories'

    def __str__(self):
        return f"{self.destination_query} - {self.created_at.strftime('%Y-%m-%d')}"
