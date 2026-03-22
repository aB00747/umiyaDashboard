from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'types', views.CustomerTypeViewSet, basename='customer-types')
router.register(r'', views.CustomerViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
