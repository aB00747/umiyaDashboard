from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'chemicals', views.ChemicalViewSet)
router.register(r'vendors', views.VendorViewSet)
router.register(r'stock-entries', views.StockEntryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
