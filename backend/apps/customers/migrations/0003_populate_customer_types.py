from django.db import migrations


TYPES = ['Retail', 'Wholesale', 'Distributor', 'Industrial']


def populate_customer_types(apps, schema_editor):
    CustomerType = apps.get_model('customers', 'CustomerType')
    Customer = apps.get_model('customers', 'Customer')

    type_map = {}
    for name in TYPES:
        ct, _ = CustomerType.objects.get_or_create(name=name)
        type_map[name] = ct

    for customer in Customer.objects.all():
        if customer.customer_type and customer.customer_type in type_map:
            customer.customer_type_fk = type_map[customer.customer_type]
            customer.save(update_fields=['customer_type_fk'])


def reverse_populate(apps, schema_editor):
    Customer = apps.get_model('customers', 'Customer')
    for customer in Customer.objects.select_related('customer_type_fk').all():
        if customer.customer_type_fk:
            customer.customer_type = customer.customer_type_fk.name
            customer.save(update_fields=['customer_type'])


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0002_customertype_customer_type_fk'),
    ]

    operations = [
        migrations.RunPython(populate_customer_types, reverse_populate),
    ]
