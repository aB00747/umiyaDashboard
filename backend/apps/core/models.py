from django.db import models


class Country(models.Model):
    country_code = models.CharField(max_length=5, unique=True)
    country_name = models.CharField(max_length=100)

    class Meta:
        db_table = 'countries'
        ordering = ['country_name']
        verbose_name_plural = 'countries'

    def __str__(self):
        return self.country_name


class State(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='states')
    state_code = models.CharField(max_length=10, blank=True, default='')
    state_name = models.CharField(max_length=100)

    class Meta:
        db_table = 'states'
        ordering = ['state_name']

    def __str__(self):
        return self.state_name


class Notification(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    link = models.CharField(max_length=500, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Setting(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField(blank=True, default='')
    description = models.CharField(max_length=255, blank=True, default='')

    class Meta:
        db_table = 'settings'

    def __str__(self):
        return self.key


class BrandingSetting(models.Model):
    system_name = models.CharField(max_length=255, default='Umiya Chemical Dashboard')
    logo = models.ImageField(upload_to='branding/', blank=True, null=True)
    favicon = models.ImageField(upload_to='branding/', blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'branding_settings'
        verbose_name = 'Branding Setting'
        verbose_name_plural = 'Branding Settings'

    def __str__(self):
        return self.system_name

    @classmethod
    def get_instance(cls):
        instance, _ = cls.objects.get_or_create(pk=1)
        return instance
