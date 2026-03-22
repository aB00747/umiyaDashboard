from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_convert_roles'),
    ]

    operations = [
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('label', models.CharField(max_length=100)),
                ('level', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'roles',
                'ordering': ['-level'],
            },
        ),
        migrations.AddField(
            model_name='user',
            name='role_fk',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='users_new',
                to='accounts.role',
            ),
        ),
    ]
