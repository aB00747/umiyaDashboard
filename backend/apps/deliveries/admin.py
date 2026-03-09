from django.contrib import admin
from .models import Delivery


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ['order', 'status', 'delivery_date', 'driver_name', 'vehicle_number', 'tracking_number', 'created_at']
    list_filter = ['status', 'delivery_date']
    search_fields = ['tracking_number', 'driver_name', 'vehicle_number', 'order__order_number']
