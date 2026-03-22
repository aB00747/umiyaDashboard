from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Country, State, Notification, Setting, BrandingSetting
from .serializers import CountrySerializer, StateSerializer, NotificationSerializer, SettingSerializer, BrandingSettingSerializer
from apps.customers.models import Customer
from apps.inventory.models import Chemical
from apps.orders.models import Order

class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    pagination_class = None

class StateViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StateSerializer
    pagination_class = None
    
    def get_queryset(self):
        qs = State.objects.all()
        country_id = self.request.query_params.get('country_id')
        if country_id:
            qs = qs.filter(country_id=country_id)
        return qs

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})
    
    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({'status': 'all marked as read'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_view(request):
    q = request.query_params.get('q', '').strip()
    if len(q) < 2:
        return Response({'results': []})
    
    results = []
    customers = Customer.objects.filter(
        Q(first_name__icontains=q) | Q(last_name__icontains=q) | 
        Q(company_name__icontains=q) | Q(email__icontains=q) | Q(phone__icontains=q)
    )[:5]
    for c in customers:
        results.append({'type': 'customer', 'id': c.id, 'title': c.full_name, 'subtitle': c.company_name})
    
    chemicals = Chemical.objects.filter(
        Q(chemical_name__icontains=q) | Q(chemical_code__icontains=q)
    )[:5]
    for ch in chemicals:
        results.append({'type': 'chemical', 'id': ch.id, 'title': ch.chemical_name, 'subtitle': ch.chemical_code})
    
    orders = Order.objects.filter(
        Q(order_number__icontains=q)
    )[:5]
    for o in orders:
        results.append({'type': 'order', 'id': o.id, 'title': o.order_number, 'subtitle': str(o.customer)})
    
    return Response({'results': results})

class SettingViewSet(viewsets.ModelViewSet):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    lookup_field = 'key'
    pagination_class = None


class BrandingSettingView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        from apps.accounts.permissions import IsAdminOrAbove
        return [IsAdminOrAbove()]

    def get(self, request):
        instance = BrandingSetting.get_instance()
        serializer = BrandingSettingSerializer(instance, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        instance = BrandingSetting.get_instance()
        serializer = BrandingSettingSerializer(instance, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
