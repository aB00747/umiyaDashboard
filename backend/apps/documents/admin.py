from django.contrib import admin
from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'uploaded_by', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['title', 'description']
