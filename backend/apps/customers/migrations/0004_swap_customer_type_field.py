from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0003_populate_customer_types'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customer',
            name='customer_type',
        ),
        migrations.RenameField(
            model_name='customer',
            old_name='customer_type_fk',
            new_name='customer_type',
        ),
        migrations.AlterField(
            model_name='customer',
            name='customer_type',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='customers',
                to='customers.customertype',
            ),
        ),
    ]
