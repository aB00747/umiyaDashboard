from django.db import migrations


ROLES = [
    ('super_admin', 'Super Admin', 4),
    ('admin', 'Admin', 3),
    ('member', 'Member', 2),
    ('staff', 'Staff', 1),
]


def populate_roles(apps, schema_editor):
    Role = apps.get_model('accounts', 'Role')
    User = apps.get_model('accounts', 'User')

    role_map = {}
    for name, label, level in ROLES:
        role_obj, _ = Role.objects.get_or_create(
            name=name, defaults={'label': label, 'level': level}
        )
        role_map[name] = role_obj

    for user in User.objects.all():
        role_name = user.role or 'staff'
        if role_name in role_map:
            user.role_fk = role_map[role_name]
            user.save(update_fields=['role_fk'])


def reverse_populate(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    for user in User.objects.select_related('role_fk').all():
        if user.role_fk:
            user.role = user.role_fk.name
            user.save(update_fields=['role'])


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_role_user_role_fk'),
    ]

    operations = [
        migrations.RunPython(populate_roles, reverse_populate),
    ]
