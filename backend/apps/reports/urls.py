from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('sales/', views.sales_report_view, name='sales_report'),
    path('inventory/', views.inventory_report_view, name='inventory_report'),
]
