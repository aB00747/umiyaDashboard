from django.db import models


class Customer(models.Model):
    CUSTOMER_TYPE_CHOICES = [
        ('Retail', 'Retail'),
        ('Wholesale', 'Wholesale'),
        ('Distributor', 'Distributor'),
        ('Industrial', 'Industrial'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True, default='')
    company_name = models.CharField(max_length=200, blank=True, default='')
    address_line1 = models.CharField(max_length=255, blank=True, default='')
    address_line2 = models.CharField(max_length=255, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    state = models.CharField(max_length=100, blank=True, default='')
    state_code = models.CharField(max_length=10, blank=True, default='')
    country = models.CharField(max_length=100, blank=True, default='')
    country_code = models.CharField(max_length=5, blank=True, default='')
    pin_code = models.CharField(max_length=10, blank=True, default='')
    phone = models.CharField(max_length=15, blank=True, default='')
    alternate_phone = models.CharField(max_length=15, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    gstin = models.CharField(max_length=15, blank=True, default='')
    pan = models.CharField(max_length=10, blank=True, default='')
    customer_type = models.CharField(max_length=20, choices=CUSTOMER_TYPE_CHOICES, blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'customers'
        ordering = ['-created_at']

    def __str__(self):
        return self.full_name

    @property
    def full_name(self):
        parts = [self.first_name, self.last_name]
        return ' '.join(p for p in parts if p)


class Financial(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('cheque', 'Cheque'),
        ('bank_transfer', 'Bank Transfer'),
        ('upi', 'UPI'),
        ('card', 'Card'),
        ('other', 'Other'),
    ]
    PRICE_TIER_CHOICES = [
        ('standard', 'Standard'),
        ('wholesale', 'Wholesale'),
        ('premium', 'Premium'),
        ('vip', 'VIP'),
    ]
    CREDIT_STATUS_CHOICES = [
        ('good', 'Good'),
        ('warning', 'Warning'),
        ('blocked', 'Blocked'),
        ('review', 'Review'),
    ]
    PAYMENT_BEHAVIOR_CHOICES = [
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('average', 'Average'),
        ('poor', 'Poor'),
    ]

    customer = models.OneToOneField(Customer, on_delete=models.CASCADE, related_name='financial')
    credit_limit = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    available_credit = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    used_credit = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    outstanding_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    overdue_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    payment_terms_days = models.IntegerField(default=30)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cash')
    total_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    ytd_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    last_year_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    average_order_value = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_orders = models.IntegerField(default=0)
    ytd_orders = models.IntegerField(default=0)
    cancelled_orders = models.IntegerField(default=0)
    pending_orders = models.IntegerField(default=0)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    price_tier = models.CharField(max_length=20, choices=PRICE_TIER_CHOICES, default='standard')
    last_payment_date = models.DateField(null=True, blank=True)
    last_order_date = models.DateField(null=True, blank=True)
    first_order_date = models.DateField(null=True, blank=True)
    credit_status = models.CharField(max_length=20, choices=CREDIT_STATUS_CHOICES, default='good')
    payment_behavior = models.CharField(max_length=20, choices=PAYMENT_BEHAVIOR_CHOICES, default='good')
    days_since_last_payment = models.IntegerField(default=0)
    gst_amount_collected = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    tds_amount_deducted = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    bank_name = models.CharField(max_length=100, blank=True, default='')
    account_number = models.CharField(max_length=50, blank=True, default='')
    ifsc_code = models.CharField(max_length=20, blank=True, default='')
    branch_name = models.CharField(max_length=100, blank=True, default='')
    financial_notes = models.TextField(blank=True, default='')
    credit_notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'financials'

    def __str__(self):
        return f"Financial - {self.customer}"
