from rest_framework import serializers
from .models import Customer, Financial, CustomerType


class CustomerTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerType
        fields = ['id', 'name']


class FinancialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Financial
        exclude = ['customer']


class CustomerSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    financial = FinancialSerializer(read_only=True)
    customer_type = serializers.PrimaryKeyRelatedField(
        queryset=CustomerType.objects.all(), required=False, allow_null=True
    )
    customer_type_detail = CustomerTypeSerializer(source='customer_type', read_only=True)

    class Meta:
        model = Customer
        fields = '__all__'


class CustomerListSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    customer_type_detail = CustomerTypeSerializer(source='customer_type', read_only=True)

    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'full_name', 'company_name', 'city', 'state', 'phone', 'email', 'customer_type', 'customer_type_detail', 'is_active', 'created_at']
