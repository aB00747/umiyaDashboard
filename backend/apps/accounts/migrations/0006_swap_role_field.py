from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_populate_roles'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='role',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='role_fk',
            new_name='role',
        ),
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='users',
                to='accounts.role',
            ),
        ),
    ]
