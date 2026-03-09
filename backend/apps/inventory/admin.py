from django.contrib import admin
from .models import Category, Chemical, Vendor, StockEntry


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name']


@admin.register(Chemical)
class ChemicalAdmin(admin.ModelAdmin):
    list_display = ['chemical_name', 'chemical_code', 'category', 'quantity', 'min_quantity', 'unit', 'selling_price', 'is_low_stock']
    list_filter = ['category', 'unit']
    search_fields = ['chemical_name', 'chemical_code']


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ['vendor_name', 'contact_person', 'phone', 'email']
    search_fields = ['vendor_name', 'contact_person', 'phone']


@admin.register(StockEntry)
class StockEntryAdmin(admin.ModelAdmin):
    list_display = ['chemical', 'entry_type', 'quantity', 'rate', 'vendor', 'created_at']
    list_filter = ['entry_type', 'vendor']
    search_fields = ['chemical__chemical_name', 'reference_note']
