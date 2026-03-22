from django.contrib import admin
from .models import Customer, Financial, CustomerType


@admin.register(CustomerType)
class CustomerTypeAdmin(admin.ModelAdmin):
    list_display = ['name']


class FinancialInline(admin.StackedInline):
    model = Financial
    extra = 0


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'company_name', 'city', 'state', 'phone', 'email', 'customer_type', 'is_active', 'created_at']
    list_filter = ['is_active', 'customer_type', 'state', 'city']
    search_fields = ['first_name', 'last_name', 'company_name', 'email', 'phone', 'gstin']
    inlines = [FinancialInline]


@admin.register(Financial)
class FinancialAdmin(admin.ModelAdmin):
    list_display = ['customer', 'credit_limit', 'available_credit', 'outstanding_amount', 'credit_status', 'payment_behavior']
    list_filter = ['credit_status', 'payment_behavior', 'price_tier']
    search_fields = ['customer__first_name', 'customer__last_name', 'customer__company_name']
