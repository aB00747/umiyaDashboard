from django.core.management.base import BaseCommand
from apps.core.models import Country, State

class Command(BaseCommand):
    help = 'Seed countries and Indian states data'

    def handle(self, *args, **options):
        india, _ = Country.objects.get_or_create(country_code='IN', defaults={'country_name': 'India'})
        usa, _ = Country.objects.get_or_create(country_code='US', defaults={'country_name': 'United States'})
        uk, _ = Country.objects.get_or_create(country_code='UK', defaults={'country_name': 'United Kingdom'})
        
        indian_states = [
            ('AP', 'Andhra Pradesh'), ('AR', 'Arunachal Pradesh'), ('AS', 'Assam'),
            ('BR', 'Bihar'), ('CG', 'Chhattisgarh'), ('GA', 'Goa'),
            ('GJ', 'Gujarat'), ('HR', 'Haryana'), ('HP', 'Himachal Pradesh'),
            ('JH', 'Jharkhand'), ('KA', 'Karnataka'), ('KL', 'Kerala'),
            ('MP', 'Madhya Pradesh'), ('MH', 'Maharashtra'), ('MN', 'Manipur'),
            ('ML', 'Meghalaya'), ('MZ', 'Mizoram'), ('NL', 'Nagaland'),
            ('OD', 'Odisha'), ('PB', 'Punjab'), ('RJ', 'Rajasthan'),
            ('SK', 'Sikkim'), ('TN', 'Tamil Nadu'), ('TS', 'Telangana'),
            ('TR', 'Tripura'), ('UP', 'Uttar Pradesh'), ('UK', 'Uttarakhand'),
            ('WB', 'West Bengal'), ('DL', 'Delhi'), ('JK', 'Jammu and Kashmir'),
            ('LA', 'Ladakh'), ('CH', 'Chandigarh'), ('PY', 'Puducherry'),
            ('AN', 'Andaman and Nicobar Islands'), ('DN', 'Dadra and Nagar Haveli and Daman and Diu'),
            ('LD', 'Lakshadweep'),
        ]
        
        for code, name in indian_states:
            State.objects.get_or_create(country=india, state_code=code, defaults={'state_name': name})
        
        self.stdout.write(self.style.SUCCESS(f'Seeded {Country.objects.count()} countries and {State.objects.count()} states'))
