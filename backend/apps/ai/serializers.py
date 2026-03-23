from rest_framework import serializers


class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=4000)
    conversation_id = serializers.CharField(required=False, allow_null=True)
    context_type = serializers.ChoiceField(
        choices=['general', 'sales', 'inventory', 'customers', 'orders'],
        default='general',
    )


class InsightRequestSerializer(serializers.Serializer):
    insight_type = serializers.ChoiceField(
        choices=['sales_trend', 'inventory_health', 'customer_analysis', 'revenue_summary', 'anomaly_detection'],
    )
    period_days = serializers.IntegerField(default=30, min_value=1, max_value=365)


class DocumentProcessSerializer(serializers.Serializer):
    file_path = serializers.CharField()
    file_name = serializers.CharField()
    file_type = serializers.ChoiceField(choices=['pdf', 'docx', 'xlsx', 'csv', 'txt'])
