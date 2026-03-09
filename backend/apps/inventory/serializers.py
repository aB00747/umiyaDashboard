from rest_framework import serializers
from .models import Category, Chemical, Vendor, StockEntry

class CategorySerializer(serializers.ModelSerializer):
    chemicals_count = serializers.IntegerField(source='chemicals.count', read_only=True)
    class Meta:
        model = Category
        fields = '__all__'

class ChemicalSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True, default='')
    is_low_stock = serializers.ReadOnlyField()
    class Meta:
        model = Chemical
        fields = '__all__'

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = '__all__'

class StockEntrySerializer(serializers.ModelSerializer):
    chemical_name = serializers.CharField(source='chemical.chemical_name', read_only=True)
    vendor_name = serializers.CharField(source='vendor.vendor_name', read_only=True, default='')
    class Meta:
        model = StockEntry
        fields = '__all__'
