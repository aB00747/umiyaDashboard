from rest_framework import serializers
from .models import Customer, Financial

class FinancialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Financial
        exclude = ['customer']

class CustomerSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    financial = FinancialSerializer(read_only=True)
    
    class Meta:
        model = Customer
        fields = '__all__'

class CustomerListSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'full_name', 'company_name', 'city', 'state', 'phone', 'email', 'customer_type', 'is_active', 'created_at']
