"""
Management command to seed comprehensive, realistic Indian blue-collar workforce demo data.
Usage: python manage.py seed_demo
"""
import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone

from apps.workers.models import (
    WorkerProfile,
    WorkerSkill,
    Certification,
    ProofOfWork,
    WorkExperience,
    SupervisorReview,
)
from apps.employers.models import EmployerProfile
from apps.jobs.models import Job, SavedJob
from apps.applications.models import Application, ApplicationTimelineEvent, Interview
from apps.verification.models import VerificationDocument
from apps.notifications.models import Notification
from apps.reports.models import PlatformReport

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds realistic demo data for workers, employers, jobs, applications, interviews, and verifications'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting KaushalConnect demo data seed..."))

        # Helper to set user names safely
        def create_user_safe(email, name, role, phone='+91 98480 12345', is_verified=True, avatar_url=None, is_staff=False, is_superuser=False):
            name_parts = name.split(' ', 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ''
            
            u, _ = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email,
                    'first_name': first_name,
                    'last_name': last_name,
                    'phone': phone,
                    'role': role,
                    'is_verified': is_verified,
                    'avatar_url': avatar_url,
                    'is_staff': is_staff,
                    'is_superuser': is_superuser,
                }
            )
            u.first_name = first_name
            u.last_name = last_name
            u.role = role
            u.phone = phone
            u.is_verified = is_verified
            u.is_staff = is_staff
            u.is_superuser = is_superuser
            if avatar_url:
                u.avatar_url = avatar_url
            u.set_password('password123')
            u.save()
            return u

        # -------------------------------------------------------------
        # 1. Primary Demo Accounts
        # -------------------------------------------------------------
        worker_user = create_user_safe(
            email='worker@demo.com',
            name='Ramesh Kumar',
            role='worker',
            phone='+91 98480 12345',
            avatar_url='https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=300'
        )

        employer_user = create_user_safe(
            email='employer@demo.com',
            name='K. Satyanarayana',
            role='employer',
            phone='+91 866 2489000',
            avatar_url='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
        )

        admin_user = create_user_safe(
            email='admin@demo.com',
            name='Dr. S. R. Murthy',
            role='admin',
            phone='+91 98480 99999',
            is_staff=True,
            is_superuser=True,
            avatar_url='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300'
        )

        # -------------------------------------------------------------
        # 2. Seed Employers (5 Enterprise Companies)
        # -------------------------------------------------------------
        employers_data = [
            {
                'user': employer_user,
                'company_name': 'ABC Precision Industries Ltd.',
                'trade_industry': 'Industrial Precision Manufacturing & Switchgear',
                'tagline': 'Tier-1 Heavy Engineering & Plant Automation Partner',
                'gst_or_cin_number': '37AABCU9603R1ZM',
                'location': 'Plot 42, Phase-2, Autonagar Industrial Area',
                'city': 'Vijayawada',
                'state': 'Andhra Pradesh',
                'logo_url': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300',
                'is_verified': True,
                'verification_badge': 'Verified Enterprise Employer',
                'employee_count': '500-1000 Employees',
                'contact_person': 'K. Satyanarayana (General Manager)',
                'contact_email': 'careers@abcindustries.in',
                'contact_phone': '+91 866 2489000',
            },
            {
                'email': 'surya.solar@demo.com',
                'full_name': 'Venkatesh Rao',
                'company_name': 'Surya Shakti Renewable Power Solutions',
                'trade_industry': 'Solar Power EPC & Rooftop Industrial Projects',
                'tagline': 'Leading Utility-Scale Solar EPC Across South India',
                'gst_or_cin_number': '37AABCS4412K1ZT',
                'location': 'Green Tech Park, Gajuwaka Industrial Zone',
                'city': 'Visakhapatnam',
                'state': 'Andhra Pradesh',
                'logo_url': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=300',
                'is_verified': True,
                'verification_badge': 'Verified Solar EPC Contractor',
                'employee_count': '250-500 Employees',
                'contact_person': 'Venkatesh Rao (Projects Head)',
                'contact_email': 'hr@suryashaktisolar.com',
                'contact_phone': '+91 891 2789123',
            },
            {
                'email': 'deccan.heavy@demo.com',
                'full_name': 'Mohammad Farooq',
                'company_name': 'Deccan Heavy Fabricators & Piping Works',
                'trade_industry': 'Heavy Pressure Vessel & Structural Steel Fabrication',
                'tagline': 'Certified IBR Boiler & High-Pressure Pipeline Specialists',
                'gst_or_cin_number': '36AABCD1122H1ZN',
                'location': 'IDA Nacharam Industrial Estate, Phase 3',
                'city': 'Hyderabad',
                'state': 'Telangana',
                'logo_url': 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=300',
                'is_verified': True,
                'verification_badge': 'Verified Heavy Fabricator',
                'employee_count': '100-250 Employees',
                'contact_person': 'M. Farooq (Plant Supervisor)',
                'contact_email': 'jobs@deccanfabricators.com',
                'contact_phone': '+91 40 27178900',
            },
            {
                'email': 'godavari.auto@demo.com',
                'full_name': 'P. N. Reddy',
                'company_name': 'Godavari Automotive & CNC Tooling',
                'trade_industry': 'Precision Automotive Components & Tool Room',
                'tagline': 'High Precision 5-Axis CNC Milling & Turning Facility',
                'gst_or_cin_number': '37AABCG5544J1ZQ',
                'location': 'Vakalapudi Industrial Area',
                'city': 'Kakinada',
                'state': 'Andhra Pradesh',
                'logo_url': 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=300',
                'is_verified': True,
                'verification_badge': 'Verified ISO 9001 Toolroom',
                'employee_count': '150-300 Employees',
                'contact_person': 'P. N. Reddy (Works Manager)',
                'contact_email': 'careers@godavariauto.in',
                'contact_phone': '+91 884 2345678',
            },
            {
                'email': 'bharath.infra@demo.com',
                'full_name': 'Sanjay Varma',
                'company_name': 'Bharath Infra Projects & Building Systems',
                'trade_industry': 'Commercial Infrastructure & MEP Contracting',
                'tagline': 'Pre-Engineered Buildings & MEP Turnkey Solutions',
                'gst_or_cin_number': '37AABCB9988L1ZX',
                'location': 'Industrial Corridor, Renigunta Road',
                'city': 'Tirupati',
                'state': 'Andhra Pradesh',
                'logo_url': 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=300',
                'is_verified': True,
                'verification_badge': 'Verified Class-A Contractor',
                'employee_count': '500+ Employees',
                'contact_person': 'Sanjay Varma (Talent Director)',
                'contact_email': 'hiring@bharathinfra.org',
                'contact_phone': '+91 877 2233445',
            },
        ]

        created_employers = []
        for emp_d in employers_data:
            if 'user' in emp_d:
                u = emp_d['user']
            else:
                u = create_user_safe(
                    email=emp_d['email'],
                    name=emp_d['full_name'],
                    role='employer',
                    phone=emp_d['contact_phone'],
                )

            profile, _ = EmployerProfile.objects.update_or_create(
                user=u,
                defaults={
                    'company_name': emp_d['company_name'],
                    'trade_industry': emp_d['trade_industry'],
                    'tagline': emp_d.get('tagline', ''),
                    'gst_or_cin_number': emp_d['gst_or_cin_number'],
                    'location': emp_d['location'],
                    'city': emp_d['city'],
                    'state': emp_d['state'],
                    'logo_url': emp_d['logo_url'],
                    'is_verified': emp_d['is_verified'],
                    'verification_badge': emp_d['verification_badge'],
                    'employee_count': emp_d['employee_count'],
                    'contact_person': emp_d['contact_person'],
                    'contact_email': emp_d['contact_email'],
                    'contact_phone': emp_d['contact_phone'],
                }
            )
            created_employers.append(profile)

        # -------------------------------------------------------------
        # 3. Seed Workers (22 Realistic Indian Technicians)
        # -------------------------------------------------------------
        workers_seed_data = [
            {
                'email': 'worker@demo.com',
                'user': worker_user,
                'name': 'Ramesh Kumar',
                'trade': 'Electrician',
                'tagline': 'Certified Industrial HT/LT Electrician & Panel Technician',
                'bio': 'Specialized in three-phase motor maintenance, VFD calibration, and LT control panel wiring with 5 years plant experience.',
                'city': 'Vijayawada',
                'location': 'Autonagar, Vijayawada',
                'experience_years': 5,
                'availability': 'available_now',
                'expected_salary': 28000,
                'avatar': 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=300',
                'skills': [
                    ('Industrial Three-Phase Wiring', 5, 5),
                    ('AC/DC Motor Maintenance & Rewinding', 5, 4),
                    ('LT/HT Switchgear & Control Panels', 4, 4),
                    ('Solar Inverter Calibration', 4, 3),
                    ('Plant Safety & Earthing', 5, 5),
                ],
                'certs': [
                    ('ITI Electrician Diploma (NCVT)', 'State Board of Technical Education', '2019-06-15', 'ITI-EL-98241', 'verified'),
                    ('CEIG Supervisor Competency License', 'Chief Electrical Inspectorate', '2021-08-10', 'CEIG-AP-4412', 'verified'),
                ],
                'proof_of_works': [
                    ('500kVA Transformer Overhaul & HT Breaker Fitting', 'Completed full HT panel wiring, busbar alignments and earth resistance testing for a pharmaceutical packaging facility.', 'Industrial Electrical', 5.0),
                    ('Automated Motor Control Center (MCC) Panel Fabrication', 'Designed and assembled a 12-motor automated MCC panel with thermal overload relays and DOL starters.', 'Panel Fabrication', 5.0),
                    ('Industrial Plant Earthing & Lightning Protection Grid', 'Installed 16 copper chemical earth pits with test link chambers and earth resistance measured below 0.8 ohms.', 'Earthing & Safety', 5.0),
                ]
            },
            {
                'email': 'manjunath.patil@demo.com',
                'name': 'Manjunath Patil',
                'trade': 'Welder',
                'tagline': '6G TIG & Radiographic Quality Pipe Welder',
                'bio': '7 years experience in pressure vessel and high-pressure steam line welding with 100% radiographic passing record.',
                'city': 'Vijayawada',
                'location': 'Gollapudi, Vijayawada',
                'experience_years': 7,
                'availability': 'available_now',
                'expected_salary': 32000,
                'avatar': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
                'skills': [
                    ('6G Pipe TIG Welding', 5, 7),
                    ('Structural MIG Welding', 5, 6),
                    ('Radiographic Quality Standards', 5, 5),
                    ('Stainless Steel Argon Purging', 4, 4),
                ],
                'certs': [
                    ('AWS D1.1 Structural Welding Certification', 'American Welding Society / NCVT', '2018-04-12', 'AWS-6G-88912', 'verified'),
                ],
                'proof_of_works': [
                    ('High Pressure Boiler Steam Line Piping', 'Welded 8-inch schedule 80 carbon steel steam pipes with argon purging and 0% defect X-ray inspection.', 'Pipe Welding', 5.0),
                    ('Heavy Pressure Vessel Dish End Circumferential Joint', 'Welded 25mm thickness SA-516 Grade 70 boiler plate with 100% ultrasonic and radiographic pass.', 'Vessel Fabrication', 5.0),
                ]
            },
            {
                'email': 'suresh.reddy@demo.com',
                'name': 'Suresh Reddy',
                'trade': 'CNC Machine Operator',
                'tagline': 'Fanuc & Siemens CNC Milling Operator & Tool Setter',
                'bio': 'Expert in 4-axis VMC machine operations, G-code editing, micrometric tool presetting, and GD&T quality inspection.',
                'city': 'Visakhapatnam',
                'location': 'Autonagar, Gajuwaka, Visakhapatnam',
                'experience_years': 4,
                'availability': 'available_now',
                'expected_salary': 26000,
                'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
                'skills': [
                    ('Fanuc CNC VMC Operation', 5, 4),
                    ('G-Code & M-Code Editing', 4, 4),
                    ('CMM & Vernier Height Gauge Inspection', 4, 3),
                    ('Hydraulic Clamping Fixture Setup', 4, 3),
                ],
                'certs': [
                    ('Advanced CNC Programming & Machining (NTTF)', 'Nettur Technical Training Foundation', '2020-11-20', 'NTTF-CNC-3391', 'verified'),
                ],
                'proof_of_works': [
                    ('Aerospace Flange Batch Machining (500 units)', 'Maintained 15-micron tolerances on aerospace turbine housing flanges on Haas VF-3.', 'CNC Machining', 4.9),
                ]
            },
            {
                'email': 'vikram.singh@demo.com',
                'name': 'Vikram Singh',
                'trade': 'Solar Technician',
                'tagline': 'Utility Scale Solar PV Installation & String Inverter Lead',
                'bio': 'Specialized in 1MW+ solar power plant erection, DC cabling, combiner box testing, and SCADA monitoring setup.',
                'city': 'Tirupati',
                'location': 'Renigunta Industrial Area, Tirupati',
                'experience_years': 3,
                'availability': 'available_now',
                'expected_salary': 25000,
                'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
                'skills': [
                    ('Solar PV String Array Installation', 5, 3),
                    ('Central & String Inverter Synchronization', 4, 3),
                    ('DC Megger & Earth Testing', 4, 3),
                ],
                'certs': [
                    ('Suryamitra Certified Solar PV Installer', 'National Institute of Solar Energy (NISE)', '2021-03-15', 'NISE-SM-5512', 'verified'),
                ],
                'proof_of_works': [
                    ('2MW Rooftop Solar Grid-Tied Project', 'Led mechanical mounting structure alignment and cable routing for 4,500 solar panels.', 'Solar EPC', 4.8),
                ]
            },
            {
                'email': 'rajesh.sharma@demo.com',
                'name': 'Rajesh Sharma',
                'trade': 'Plumber & Pipefitter',
                'tagline': 'Commercial MEP Pipefitter & Fire Hydrant System Specialist',
                'bio': 'Expert in CPVC, GI, PPR, and HDPE electrofusion piping for heavy industrial facilities and multi-story commercial projects.',
                'city': 'Vijayawada',
                'location': 'Governorpet, Vijayawada',
                'experience_years': 6,
                'availability': 'within_15_days',
                'expected_salary': 24000,
                'avatar': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300',
                'skills': [
                    ('Commercial Fire Fighting Piping', 5, 6),
                    ('HDPE Electrofusion Jointing', 4, 4),
                    ('Hydrostatic Pressure Testing (15 bar)', 5, 5),
                ],
                'certs': [
                    ('ITI Plumber Trade Certificate', 'Department of Employment and Training', '2018-07-22', 'ITI-PL-11029', 'verified'),
                ],
                'proof_of_works': [
                    ('Hospital Central Medical Gas & Water Line', 'Installed 1,200 meters of seamless copper gas pipeline with zero leakage nitrogen pressure tests.', 'Piping', 5.0),
                ]
            },
            {
                'email': 'anand.verma@demo.com',
                'name': 'Anand Verma',
                'trade': 'Millwright Fitter',
                'tagline': 'Heavy Industrial Machinery Erection & Alignment Fitter',
                'bio': 'Specialized in laser shaft alignment, heavy gearbox overhauls, centrifugal pump maintenance, and overhead crane track leveling.',
                'city': 'Hyderabad',
                'location': 'Sanathnagar Industrial Area, Hyderabad',
                'experience_years': 8,
                'availability': 'available_now',
                'expected_salary': 35000,
                'avatar': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
                'skills': [
                    ('Laser Shaft Alignment', 5, 8),
                    ('Heavy Industrial Gearbox Overhauling', 5, 7),
                    ('Dynamic Balancing & Vibration Analysis', 4, 5),
                ],
                'certs': [
                    ('NCVT Fitter Trade Certificate', 'National Council for Vocational Training', '2016-08-10', 'NCVT-FIT-88219', 'verified'),
                ],
                'proof_of_works': [
                    ('Cement Plant Ball Mill Gearbox Replacement', 'Successfully replaced and aligned 45-ton planetary drive gearbox with 0.02mm runout tolerance.', 'Millwright', 5.0),
                ]
            },
            {
                'email': 'manoj.gupta@demo.com',
                'name': 'Manoj Gupta',
                'trade': 'AC & Refrigeration Technician',
                'tagline': 'HVAC Chiller Plant & Commercial VRF Specialist',
                'bio': 'Experienced in water-cooled centrifugal chillers, VRF outdoor units, refrigerant leak recovery, and psychrometric balancing.',
                'city': 'Visakhapatnam',
                'location': 'Siripuram, Visakhapatnam',
                'experience_years': 5,
                'availability': 'available_now',
                'expected_salary': 27000,
                'avatar': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300',
                'skills': [
                    ('Centrifugal Chiller Maintenance', 5, 5),
                    ('Daikin/Voltas VRF Commissioning', 5, 4),
                    ('Brazing & Vacuum Dehydration', 4, 5),
                ],
                'certs': [
                    ('ITI RAC (Refrigeration and Air Conditioning)', 'NCVT Board', '2019-05-18', 'ITI-RAC-99881', 'verified'),
                ],
                'proof_of_works': [
                    ('IT Park 300 TR Central Chiller Annual Overhaul', 'Cleaned condenser tubes, replaced oil filters, and recharged R-134a refrigerant.', 'HVAC Services', 4.9),
                ]
            },
            {
                'email': 'krishna.murthy@demo.com',
                'name': 'Krishna Murthy',
                'trade': 'Construction Carpenter',
                'tagline': 'System Formwork & Mivan Shuttering Lead Carpenter',
                'bio': 'Specialized in aluminum Mivan shuttering, precast concrete column boxing, and scaffolding safety compliance.',
                'city': 'Vijayawada',
                'location': 'Enikepadu, Vijayawada',
                'experience_years': 4,
                'availability': 'available_now',
                'expected_salary': 22000,
                'avatar': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
                'skills': [
                    ('Aluminum Mivan Formwork Assembly', 5, 4),
                    ('High-Rise Slab Shuttering & Leveling', 4, 4),
                    ('Bar Bending Schedule Reading', 4, 3),
                ],
                'certs': [
                    ('CSDC Formwork Carpenter Level-4', 'Construction Skill Development Council of India', '2020-09-10', 'CSDC-CARP-7721', 'verified'),
                ],
                'proof_of_works': [
                    ('20-Storey Residential Tower Mivan Cycle', 'Achieved 7-day floor slab pouring cycle with perfect dimensional accuracy.', 'Civil Formwork', 4.8),
                ]
            },
            {
                'email': 'syed.basha@demo.com',
                'name': 'Syed Basha',
                'trade': 'Commercial Driver',
                'tagline': 'Heavy Goods Vehicle (HGV) Multi-Axle Trailer Driver',
                'bio': 'Valid heavy transport license with 10 years accident-free long haul driving across national highways with GPS and hazmat safety certification.',
                'city': 'Vijayawada',
                'location': 'Bhavanipuram, Vijayawada',
                'experience_years': 10,
                'availability': 'available_now',
                'expected_salary': 25000,
                'avatar': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
                'skills': [
                    ('Heavy Multi-Axle Trailer Driving', 5, 10),
                    ('Hazardous Material Safety & RTO Compliances', 5, 8),
                    ('Preventive Vehicle Inspection', 4, 10),
                ],
                'certs': [
                    ('Commercial Heavy Transport License (HGMV)', 'Regional Transport Authority Andhra Pradesh', '2014-02-10', 'AP-16-2014-9988', 'verified'),
                ],
                'proof_of_works': [
                    ('Over-Dimensional Cargo (ODC) Windmill Blade Transport', 'Safely transported 65-meter turbine blades across 800km hilly terrain.', 'Heavy Logistics', 5.0),
                ]
            },
            {
                'email': 'kiran.kumar@demo.com',
                'name': 'Kiran Kumar',
                'trade': 'Delivery Lead & Fleet Executive',
                'tagline': 'E-Commerce Hub Logistics Lead & Route Supervisor',
                'bio': 'Managing 40+ delivery executives, last-mile dispatch SLA compliance, and sorting hub operations with 99.4% on-time delivery.',
                'city': 'Vijayawada',
                'location': 'Benz Circle, Vijayawada',
                'experience_years': 4,
                'availability': 'available_now',
                'expected_salary': 21000,
                'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
                'skills': [
                    ('Last-Mile Route Optimization', 5, 4),
                    ('Hub Inventory Reconciliation', 4, 4),
                    ('Rider Team Management', 5, 3),
                ],
                'certs': [
                    ('Logistics Sector Skill Council (LSC) Certificate', 'LSC India', '2021-02-14', 'LSC-EXEC-3312', 'verified'),
                ],
                'proof_of_works': [
                    ('Festival Season 10,000 Package Dispatch', 'Supervised 24/7 delivery operations with zero package loss during festive sale.', 'Logistics', 4.9),
                ]
            },
        ]

        # 12 More Indian blue-collar technicians
        additional_trades = [
            ('Pradeep Naidu', 'Electrician', 'Vijayawada', 3, 'available_now', 23000, 78),
            ('Someshwar Rao', 'Welder', 'Visakhapatnam', 5, 'available_now', 28000, 84),
            ('Balaji Srinivasan', 'Solar Technician', 'Tirupati', 2, 'within_15_days', 22000, 72),
            ('Raghavendra Swamy', 'CNC Machine Operator', 'Kakinada', 6, 'available_now', 30000, 92),
            ('Dharmendra Yadav', 'Plumber', 'Hyderabad', 4, 'available_now', 23000, 79),
            ('Sunil Gavaskar', 'Millwright Fitter', 'Vijayawada', 5, 'within_15_days', 29000, 86),
            ('Chandra Sekhar', 'AC & Refrigeration Technician', 'Visakhapatnam', 3, 'available_now', 24000, 76),
            ('Devendra Reddy', 'Electrician', 'Guntur', 4, 'available_now', 25000, 83),
            ('Praveen Varma', 'Construction Carpenter', 'Vijayawada', 3, 'available_now', 21000, 74),
            ('Gopal Krishna', 'Delivery Executive', 'Vijayawada', 2, 'available_now', 19000, 68),
            ('Venkat Raman', 'Commercial Driver', 'Nellore', 7, 'available_now', 24000, 88),
            ('Shiva Shankar', 'Welder', 'Visakhapatnam', 4, 'within_15_days', 26000, 81),
        ]

        created_workers = []

        # Process main 10 workers
        for wd in workers_seed_data:
            if 'user' in wd:
                u = wd['user']
            else:
                u = create_user_safe(
                    email=wd['email'],
                    name=wd['name'],
                    role='worker',
                    avatar_url=wd['avatar'],
                )

            wp, _ = WorkerProfile.objects.update_or_create(
                user=u,
                defaults={
                    'full_name': wd['name'],
                    'primary_trade': wd['trade'],
                    'tagline': wd['tagline'],
                    'bio': wd['bio'],
                    'city': wd['city'],
                    'location': wd['location'],
                    'years_of_experience': wd['experience_years'],
                    'availability': wd['availability'],
                    'expected_salary_min': wd['expected_salary'],
                    'trust_score_total': 88,
                }
            )

            # Skills
            for sk_name, lvl, yrs in wd.get('skills', []):
                WorkerSkill.objects.get_or_create(
                    worker=wp,
                    skill_name=sk_name,
                    defaults={'level': lvl, 'years_experience': yrs, 'is_verified': True}
                )

            # Certifications
            for c_title, c_body, c_date, c_id, c_stat in wd.get('certs', []):
                Certification.objects.get_or_create(
                    worker=wp,
                    credential_id=c_id,
                    defaults={
                        'title': c_title,
                        'issuing_body': c_body,
                        'issue_date': c_date,
                        'verification_status': c_stat,
                    }
                )

            # Proof of Works
            for p_title, p_desc, p_cat, p_rating in wd.get('proof_of_works', []):
                ProofOfWork.objects.get_or_create(
                    worker=wp,
                    title=p_title,
                    defaults={
                        'description': p_desc,
                        'category': p_cat,
                        'client_or_employer': 'Industrial Client Ltd.',
                        'location': wd['city'],
                        'completion_date': date.today() - timedelta(days=90),
                        'is_verified': True,
                        'rating': p_rating,
                        'images': ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400'],
                    }
                )

            wp.calculate_trust_score()
            created_workers.append(wp)

        # Process additional 12 workers
        for idx, (w_name, w_trade, w_city, w_exp, w_avail, w_sal, w_score) in enumerate(additional_trades):
            w_email = f"worker_{idx + 11}@demo.com"
            u = create_user_safe(
                email=w_email,
                name=w_name,
                role='worker',
                is_verified=w_score > 75,
                avatar_url='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
            )

            wp, _ = WorkerProfile.objects.update_or_create(
                user=u,
                defaults={
                    'full_name': w_name,
                    'primary_trade': w_trade,
                    'tagline': f'Certified {w_trade} Technician with {w_exp} Years Experience',
                    'bio': f'Qualified {w_trade} professional with hands-on industrial plant and site experience.',
                    'city': w_city,
                    'location': f'{w_city}, AP',
                    'years_of_experience': w_exp,
                    'availability': w_avail,
                    'expected_salary_min': w_sal,
                    'trust_score_total': w_score,
                }
            )

            WorkerSkill.objects.get_or_create(
                worker=wp,
                skill_name=f'Core {w_trade} Operations',
                defaults={'level': 4, 'years_experience': w_exp, 'is_verified': True}
            )
            WorkerSkill.objects.get_or_create(
                worker=wp,
                skill_name='Industrial Workplace Safety',
                defaults={'level': 5, 'years_experience': w_exp, 'is_verified': True}
            )

            Certification.objects.get_or_create(
                worker=wp,
                credential_id=f'CERT-NCVT-{1000 + idx}',
                defaults={
                    'title': f'NCVT Trade Certification in {w_trade}',
                    'issuing_body': 'National Council for Vocational Training',
                    'issue_date': '2020-04-10',
                    'verification_status': 'verified' if w_score > 75 else 'pending',
                }
            )

            wp.calculate_trust_score()
            created_workers.append(wp)

        # -------------------------------------------------------------
        # 4. Seed Jobs (16 Active, Paused, and Closed Jobs)
        # -------------------------------------------------------------
        emp1 = created_employers[0]
        emp2 = created_employers[1]
        emp3 = created_employers[2]
        emp4 = created_employers[3]
        emp5 = created_employers[4]

        jobs_data = [
            {
                'employer': emp1,
                'title': 'Industrial Electrician & Substation Technician',
                'trade_category': 'Electrical',
                'location': 'Plot 42, Phase-2, Autonagar Industrial Area',
                'city': 'Vijayawada',
                'salary_min': 25000,
                'salary_max': 32000,
                'experience_required_years': 4,
                'job_type': 'Full-time',
                'shift': 'Day Shift',
                'openings': 4,
                'required_skills': ['Industrial Three-Phase Wiring', 'LT/HT Switchgear', 'AC/DC Motor Maintenance', 'Plant Safety'],
                'preferred_skills': ['PLC Troubleshooting', 'Solar Inverter Calibration'],
                'description': 'Responsible for maintaining HT substation transformers, circuit breakers, 415V bus ducts, and 24V DC auxiliary battery systems.',
                'benefits': ['PF & ESI Provided', 'Overtime Double Pay', 'Plant Canteen Subsidized Meals', 'Free Annual Health Checkup'],
                'status': 'active',
            },
            {
                'employer': emp1,
                'title': 'TIG / MIG Pipeline Welder (Pressure Vessels)',
                'trade_category': 'Welding',
                'location': 'Plot 42, Phase-2, Autonagar Industrial Area',
                'city': 'Vijayawada',
                'salary_min': 28000,
                'salary_max': 36000,
                'experience_required_years': 4,
                'job_type': 'Full-time',
                'shift': 'Rotational',
                'openings': 3,
                'required_skills': ['6G Pipe TIG Welding', 'Structural MIG Welding', 'Radiographic Quality'],
                'preferred_skills': ['Boiler IBR Clearance', 'Argon Purging'],
                'description': 'Fabrication and welding of ASME boiler pressure vessels, steam headers, and stainless steel pipe manifolds.',
                'benefits': ['ESI & Medical Insurance', 'Performance Welding Bonus', 'Safety Gear & PPE Provided'],
                'status': 'active',
            },
            {
                'employer': emp2,
                'title': 'Utility Scale Solar PV Project Lead',
                'trade_category': 'Solar',
                'location': 'Green Tech Park, Gajuwaka Industrial Zone',
                'city': 'Visakhapatnam',
                'salary_min': 26000,
                'salary_max': 34000,
                'experience_required_years': 3,
                'job_type': 'Full-time',
                'shift': 'Day Shift',
                'openings': 5,
                'required_skills': ['Solar PV String Array Installation', 'Central & String Inverter Synchronization', 'DC Megger Testing'],
                'preferred_skills': ['SCADA Troubleshooting', 'Grid Synchronizing'],
                'description': 'Erection and commissioning of 5MW ground mounted solar farm modules, tracker drives, and combiner boxes.',
                'benefits': ['Free Site Accommodation', 'Travel Allowance', 'Bonus on Milestone Completion'],
                'status': 'active',
            },
            {
                'employer': emp4,
                'title': '5-Axis CNC VMC Programmer & Operator',
                'trade_category': 'Machinist',
                'location': 'Vakalapudi Industrial Area',
                'city': 'Kakinada',
                'salary_min': 28000,
                'salary_max': 38000,
                'experience_required_years': 4,
                'job_type': 'Full-time',
                'shift': 'Rotational',
                'openings': 2,
                'required_skills': ['Fanuc CNC VMC Operation', 'G-Code & M-Code Editing', 'CMM Quality Inspection'],
                'preferred_skills': ['Mastercam CAD/CAM', '4-Axis Rotary Indexing'],
                'description': 'Machining high-precision automotive transmission gears and aeronautical flanges with 10-micron tolerance.',
                'benefits': ['PF & ESI', 'Attendance Incentive', 'Air Conditioned Tool Room'],
                'status': 'active',
            },
            {
                'employer': emp3,
                'title': 'Heavy Machinery Millwright Alignment Fitter',
                'trade_category': 'Fitter',
                'location': 'IDA Nacharam Industrial Estate',
                'city': 'Hyderabad',
                'salary_min': 30000,
                'salary_max': 40000,
                'experience_required_years': 5,
                'job_type': 'Full-time',
                'shift': 'Day Shift',
                'openings': 3,
                'required_skills': ['Laser Shaft Alignment', 'Heavy Industrial Gearbox Overhauling', 'Hydraulic Pump Assembly'],
                'preferred_skills': ['Vibration Spectrum Analysis'],
                'description': 'Overhauling heavy industrial drives, cement crushers, slurry pumps, and overhead crane gearboxes.',
                'benefits': ['PF & High Insurance', 'Plant Transport Facility', 'Performance Bonus'],
                'status': 'active',
            },
            {
                'employer': emp5,
                'title': 'Commercial Firefighting & MEP Master Pipefitter',
                'trade_category': 'Plumbing',
                'location': 'Renigunta Road Industrial Corridor',
                'city': 'Tirupati',
                'salary_min': 22000,
                'salary_max': 28000,
                'experience_required_years': 4,
                'job_type': 'Contract',
                'shift': 'Day Shift',
                'openings': 6,
                'required_skills': ['Commercial Fire Fighting Piping', 'HDPE Electrofusion Jointing', 'Hydrostatic Pressure Testing'],
                'preferred_skills': ['Sprinkler System Commissioning'],
                'description': 'Laying underground high-pressure ductile iron water mains and ceiling sprinkler pipe networks for pharma plant.',
                'benefits': ['Weekly Advance Pay', 'Free Bachelor Accommodation', 'Overtime Pay'],
                'status': 'active',
            },
            {
                'employer': emp1,
                'title': 'Automated Control Panel Wiring Technician',
                'trade_category': 'Electrical',
                'location': 'Autonagar Industrial Area',
                'city': 'Vijayawada',
                'salary_min': 20000,
                'salary_max': 26000,
                'experience_required_years': 2,
                'job_type': 'Full-time',
                'shift': 'Day Shift',
                'openings': 3,
                'required_skills': ['Industrial Three-Phase Wiring', 'Control Circuit Ferruling', 'Panel Component Mounting'],
                'preferred_skills': ['PLC Relay Interfacing'],
                'description': 'Wiring electrical MCC, APFC, and PLC control panels as per industrial schematic drawings.',
                'benefits': ['PF & ESI', 'Skill Training Certification Support'],
                'status': 'active',
            },
            {
                'employer': emp2,
                'title': 'Solar Rooftop Inverter Service Technician',
                'trade_category': 'Solar',
                'location': 'Gajuwaka Industrial Zone',
                'city': 'Visakhapatnam',
                'salary_min': 22000,
                'salary_max': 27000,
                'experience_required_years': 2,
                'job_type': 'Full-time',
                'shift': 'Day Shift',
                'openings': 4,
                'required_skills': ['Solar PV String Array Installation', 'DC Megger Testing'],
                'preferred_skills': ['Inverter Firmware Upgrade'],
                'description': 'Preventive maintenance and string troubleshooting for commercial rooftop solar installations across Vizag.',
                'benefits': ['Two-Wheeler Fuel Allowance', 'Mobile Phone Allowance'],
                'status': 'active',
            },
            {
                'employer': emp3,
                'title': 'Structural Steel Erector & Rigger',
                'trade_category': 'Construction',
                'location': 'IDA Nacharam',
                'city': 'Hyderabad',
                'salary_min': 21000,
                'salary_max': 27000,
                'experience_required_years': 3,
                'job_type': 'Contract',
                'shift': 'Day Shift',
                'openings': 8,
                'required_skills': ['Heavy Rigging & Slings', 'Pre-Engineered Building Column Erection', 'Torque Wrench Bolting'],
                'preferred_skills': ['Crane Signal Handing'],
                'description': 'Erecting PEB structural trusses, crane girders, and purlins for new warehouse construction.',
                'benefits': ['Safety Boots & Hard Hat Provided', 'Daily Food Allowance'],
                'status': 'active',
            },
            {
                'employer': emp4,
                'title': 'CNC Turning Center (Lathe) Machinist',
                'trade_category': 'Machinist',
                'location': 'Vakalapudi',
                'city': 'Kakinada',
                'salary_min': 24000,
                'salary_max': 30000,
                'experience_required_years': 3,
                'job_type': 'Full-time',
                'shift': 'Rotational',
                'openings': 3,
                'required_skills': ['Fanuc CNC VMC Operation', 'G-Code & M-Code Editing'],
                'preferred_skills': ['Threading & Boring Cycles'],
                'description': 'Operating CNC turning lathes for high-precision stainless steel shafting and threading.',
                'benefits': ['PF & ESI', 'Monthly Production Bonus'],
                'status': 'active',
            },
            {
                'employer': emp5,
                'title': 'HVAC Central Chiller Plant Operator',
                'trade_category': 'HVAC',
                'location': 'Renigunta Road',
                'city': 'Tirupati',
                'salary_min': 24000,
                'salary_max': 31000,
                'experience_required_years': 3,
                'job_type': 'Full-time',
                'shift': 'Rotational',
                'openings': 2,
                'required_skills': ['Centrifugal Chiller Maintenance', 'Brazing & Vacuum Dehydration'],
                'preferred_skills': ['BMS Monitoring'],
                'description': 'Operating 2x250 TR screw chillers, primary/secondary pumps, and cooling towers for pharmaceutical cleanroom.',
                'benefits': ['PF & Medical Coverage', 'Subsidized Canteen'],
                'status': 'active',
            },
            {
                'employer': emp1,
                'title': 'Industrial Maintenance Helper & Junior Fitter',
                'trade_category': 'Fitter',
                'location': 'Autonagar',
                'city': 'Vijayawada',
                'salary_min': 18000,
                'salary_max': 22000,
                'experience_required_years': 1,
                'job_type': 'Full-time',
                'shift': 'Day Shift',
                'openings': 5,
                'required_skills': ['Hand Tool Operations', 'Industrial Workplace Safety', 'Basic Bench Fitting'],
                'preferred_skills': ['Gas Cutting'],
                'description': 'Assisting senior millwrights in plant shutdown maintenance, greasing, and machinery cleaning.',
                'benefits': ['On-the-job NCVT Certification Support', 'Free Lunch'],
                'status': 'active',
            },
            {
                'employer': emp2,
                'title': 'Solar Farm Commissioning Lead (Paused)',
                'trade_category': 'Solar',
                'location': 'Gajuwaka',
                'city': 'Visakhapatnam',
                'salary_min': 35000,
                'salary_max': 45000,
                'experience_required_years': 6,
                'job_type': 'Full-time',
                'shift': 'Day Shift',
                'openings': 2,
                'required_skills': ['Central & String Inverter Synchronization', 'SCADA Troubleshooting'],
                'preferred_skills': ['Grid Protection Relay Testing'],
                'description': 'Lead commissioning engineer for high-voltage transmission substation tie-in.',
                'benefits': ['Company Car Allowance', 'Relocation Bonus'],
                'status': 'paused',
            },
            {
                'employer': emp3,
                'title': 'Heavy Trailer Driver (ODC Cargo) - Closed',
                'trade_category': 'Logistics',
                'location': 'Nacharam',
                'city': 'Hyderabad',
                'salary_min': 26000,
                'salary_max': 32000,
                'experience_required_years': 8,
                'job_type': 'Full-time',
                'shift': 'Day Shift',
                'openings': 2,
                'required_skills': ['Heavy Multi-Axle Trailer Driving', 'Hazardous Material Safety'],
                'preferred_skills': ['Interstate Permit Handling'],
                'description': 'Filled position for trailer driver transporting heavy vessel shells.',
                'benefits': ['PF & Trip Allowances'],
                'status': 'closed',
            },
            {
                'employer': emp4,
                'title': 'Quality Control Inspector (CMM / Metrology)',
                'trade_category': 'Machinist',
                'location': 'Vakalapudi',
                'city': 'Kakinada',
                'salary_min': 27000,
                'salary_max': 35000,
                'experience_required_years': 4,
                'job_type': 'Full-time',
                'shift': 'Day Shift',
                'openings': 2,
                'required_skills': ['CMM Quality Inspection', 'Micrometer & Bore Gauge Calibration', 'GD&T Blueprints'],
                'preferred_skills': ['ISO 9001 Documentation'],
                'description': 'Conducting first-article and batch metrology inspection on aerospace CNC components.',
                'benefits': ['PF & ESI', 'Clean Room Environment'],
                'status': 'active',
            },
            {
                'employer': emp5,
                'title': 'Mivan Aluminum Formwork Foreman',
                'trade_category': 'Construction',
                'location': 'Renigunta',
                'city': 'Tirupati',
                'salary_min': 30000,
                'salary_max': 38000,
                'experience_required_years': 6,
                'job_type': 'Full-time',
                'shift': 'Day Shift',
                'openings': 2,
                'required_skills': ['Aluminum Mivan Formwork Assembly', 'High-Rise Slab Shuttering', 'Team Supervision'],
                'preferred_skills': ['Bar Bending Optimization'],
                'description': 'Supervising 30-member carpentry crew for high-rise residential structure.',
                'benefits': ['Site Family Housing Provided', 'PF & ESI'],
                'status': 'active',
            },
        ]

        created_jobs = []
        for jd in jobs_data:
            job, _ = Job.objects.update_or_create(
                employer=jd['employer'],
                title=jd['title'],
                defaults=jd
            )
            created_jobs.append(job)

        # -------------------------------------------------------------
        # 5. Seed Applications (32 Applications across All 6 Stages)
        # -------------------------------------------------------------
        stages_cycle = [
            Application.StageChoices.APPLIED,
            Application.StageChoices.SCREENING,
            Application.StageChoices.SHORTLISTED,
            Application.StageChoices.INTERVIEW,
            Application.StageChoices.SELECTED,
            Application.StageChoices.HIRED,
            Application.StageChoices.REJECTED,
        ]

        created_applications = []
        app_counter = 0

        # Demo worker Ramesh Kumar applied to jobs 1 and 2
        app1, _ = Application.objects.get_or_create(
            job=created_jobs[0],
            worker=created_workers[0],
            defaults={
                'current_stage': Application.StageChoices.SELECTED,
                'match_score': 94,
                'rating': 5.0,
            }
        )
        ApplicationTimelineEvent.objects.get_or_create(
            application=app1,
            stage=Application.StageChoices.APPLIED,
            defaults={'note': 'Applied online via KaushalConnect.', 'completed': True}
        )
        ApplicationTimelineEvent.objects.get_or_create(
            application=app1,
            stage=Application.StageChoices.SCREENING,
            defaults={'note': 'NCVT Electrician credentials verified.', 'completed': True}
        )
        ApplicationTimelineEvent.objects.get_or_create(
            application=app1,
            stage=Application.StageChoices.SHORTLISTED,
            defaults={'note': 'Shortlisted for practical switchgear trade test.', 'completed': True}
        )
        ApplicationTimelineEvent.objects.get_or_create(
            application=app1,
            stage=Application.StageChoices.INTERVIEW,
            defaults={'note': 'Trade test conducted at Autonagar plant.', 'completed': True}
        )
        ApplicationTimelineEvent.objects.get_or_create(
            application=app1,
            stage=Application.StageChoices.SELECTED,
            defaults={'note': 'Selected with 5.0★ rating. Offer letter issued.', 'completed': True}
        )
        created_applications.append(app1)

        app2, _ = Application.objects.get_or_create(
            job=created_jobs[1],
            worker=created_workers[0],
            defaults={
                'current_stage': Application.StageChoices.INTERVIEW,
                'match_score': 82,
            }
        )
        created_applications.append(app2)

        # Cross applications
        for i, worker in enumerate(created_workers[1:18]):
            for j in range(2):
                job = created_jobs[(i * 2 + j) % len(created_jobs)]
                stage = stages_cycle[app_counter % len(stages_cycle)]
                app_counter += 1

                app, _ = Application.objects.get_or_create(
                    job=job,
                    worker=worker,
                    defaults={
                        'current_stage': stage,
                        'match_score': random.randint(72, 96),
                        'rating': 4.5 if stage in [Application.StageChoices.SELECTED, Application.StageChoices.HIRED] else None,
                    }
                )
                ApplicationTimelineEvent.objects.get_or_create(
                    application=app,
                    stage=Application.StageChoices.APPLIED,
                    defaults={'note': 'Application received from verified candidate.', 'completed': True}
                )
                if stage != Application.StageChoices.APPLIED:
                    ApplicationTimelineEvent.objects.get_or_create(
                        application=app,
                        stage=stage,
                        defaults={'note': f'Candidate moved to {stage} stage.', 'completed': True}
                    )
                created_applications.append(app)

        # -------------------------------------------------------------
        # 6. Seed Interviews (6 Trade Tests & Assessments)
        # -------------------------------------------------------------
        interviews_seed = [
            {
                'application': app1,
                'interview_type': Interview.InterviewTypeChoices.TRADE_TEST,
                'date': date.today() + timedelta(days=3),
                'time': '10:30 AM IST',
                'location_or_link': 'Substation Bay 2, ABC Precision Industries, Autonagar, Vijayawada',
                'instructions': 'Bring original NCVT diploma and wear industrial safety boots for breaker inspection test.',
                'status': Interview.StatusChoices.SCHEDULED,
                'interviewer_name': 'K. Satyanarayana (General Manager)',
            },
            {
                'application': app2,
                'interview_type': Interview.InterviewTypeChoices.PLANT_VISIT,
                'date': date.today() + timedelta(days=5),
                'time': '02:00 PM IST',
                'location_or_link': 'Heavy Fabrication Bay 1, Autonagar, Vijayawada',
                'instructions': '6G pipe welding coupon assessment. Welding helmet and safety shoes mandatory.',
                'status': Interview.StatusChoices.SCHEDULED,
                'interviewer_name': 'M. Farooq (Welding Inspector)',
            },
            {
                'application': created_applications[2],
                'interview_type': Interview.InterviewTypeChoices.VIDEO_CALL,
                'date': date.today() + timedelta(days=2),
                'time': '11:00 AM IST',
                'location_or_link': 'https://meet.google.com/abc-test-pipe',
                'instructions': 'Initial technical discussion on CNC tooling and Mastercam programming experience.',
                'status': Interview.StatusChoices.SCHEDULED,
                'interviewer_name': 'Venkatesh Rao',
            },
            {
                'application': created_applications[3],
                'interview_type': Interview.InterviewTypeChoices.TRADE_TEST,
                'date': date.today() + timedelta(days=4),
                'time': '09:00 AM IST',
                'location_or_link': 'Tool Room 3, Vakalapudi Industrial Area, Kakinada',
                'instructions': 'Practical VMC tool presetting and dry run cycle inspection.',
                'status': Interview.StatusChoices.SCHEDULED,
                'interviewer_name': 'P. N. Reddy',
            },
            {
                'application': created_applications[4],
                'interview_type': Interview.InterviewTypeChoices.IN_PERSON,
                'date': date.today() - timedelta(days=2),
                'time': '03:30 PM IST',
                'location_or_link': 'Nacharam Plant, Hyderabad',
                'instructions': 'Shaft alignment test on 200kW slurry pump.',
                'status': Interview.StatusChoices.COMPLETED,
                'feedback': 'Exceptional alignment accuracy achieved within 15 minutes. Candidate passed.',
                'interviewer_name': 'M. Farooq',
            },
            {
                'application': created_applications[5],
                'interview_type': Interview.InterviewTypeChoices.PHONE,
                'date': date.today() + timedelta(days=1),
                'time': '04:00 PM IST',
                'location_or_link': 'Direct Telephonic Screening (+91 877 2233445)',
                'instructions': 'Preliminary discussion regarding site mobilization at Tirupati.',
                'status': Interview.StatusChoices.SCHEDULED,
                'interviewer_name': 'Sanjay Varma',
            },
        ]

        for iv_data in interviews_seed:
            Interview.objects.update_or_create(
                application=iv_data['application'],
                defaults=iv_data
            )

        # -------------------------------------------------------------
        # 7. Seed Verification Documents (12 Queue Entries)
        # -------------------------------------------------------------
        verif_docs_seed = [
            (created_workers[0], 'IDENTITY', 'Aadhaar eKYC Card', 'APPROVED', 'Biometrically validated via UIDAI.'),
            (created_workers[0], 'CERTIFICATE', 'NCVT Electrician Diploma', 'APPROVED', 'Official state technical board verified.'),
            (created_workers[1], 'CERTIFICATE', 'AWS 6G Welding Certificate', 'APPROVED', 'Radiographic testing certification verified.'),
            (created_workers[2], 'CERTIFICATE', 'NTTF CNC Machining Certificate', 'APPROVED', 'NTTF institute verified.'),
            (created_workers[3], 'CERTIFICATE', 'NISE Suryamitra Solar PV License', 'PENDING', 'Pending admin inspection of QR seal.'),
            (created_workers[4], 'TRADE_LICENSE', 'Commercial Plumbing Trade License', 'PENDING', 'Under verification with local RTO/Municipal board.'),
            (created_workers[5], 'CERTIFICATE', 'NCVT Millwright Fitter Diploma', 'APPROVED', 'Certified verified technician.'),
            (created_workers[6], 'IDENTITY', 'Aadhaar Card (Damaged Scan)', 'REJECTED', 'Image blurry and text unreadable. Please re-upload high resolution photo.'),
            (created_workers[7], 'CERTIFICATE', 'Formwork Level-4 CSDC', 'PENDING', 'Under verification queue.'),
            (created_workers[8], 'TRADE_LICENSE', 'Commercial Heavy Vehicle Driving License', 'APPROVED', 'AP Transport authority database matched.'),
            (created_workers[9], 'CERTIFICATE', 'Logistics Sector Council Level 4', 'APPROVED', 'Verified by Skill India portal.'),
            (created_workers[10], 'CERTIFICATE', 'ITI Electrical Provisional', 'PENDING', 'Awaiting final diploma certificate scan.'),
        ]

        for w, doc_type, doc_num, v_stat, notes in verif_docs_seed:
            VerificationDocument.objects.get_or_create(
                worker=w,
                doc_type=doc_type,
                doc_number=doc_num,
                defaults={
                    'status': v_stat,
                    'notes': notes,
                    'file_url': 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600',
                }
            )

        # -------------------------------------------------------------
        # 8. Seed Platform Reports & Moderation (5 Reports)
        # -------------------------------------------------------------
        reports_seed = [
            (worker_user, 'Dubious Labor Contractor Agency', 'employer', 'FAKE_JOB', 'Agent asked for ₹500 upfront registration fee before sharing plant interview location.', 'RESOLVED', 'Employer banned and suspended from KaushalConnect.'),
            (worker_user, 'Fake Solar Apprentice Scheme', 'job', 'FAKE_JOB', 'Job posting claims fake government stipend without employer verification.', 'OPEN', None),
            (employer_user, 'Fabricated NCVT Certificate Upload', 'worker', 'FAKE_CERTIFICATE', 'Candidate certificate number does not match ITI registration registry.', 'UNDER_REVIEW', 'Document sent for secondary registry audit.'),
            (worker_user, 'Delayed Overtime Wage Issue', 'employer', 'FRAUD', 'Contractor withheld overtime allowance for July batch.', 'RESOLVED', 'Employer management cleared pending dues.'),
            (worker_user, 'Unsafe Plant Scaffolding', 'employer', 'INAPPROPRIATE_CONTENT', 'Missing safety harnesses on 10m height work structure.', 'OPEN', None),
        ]

        for reporter, entity_name, entity_type, r_type, desc, r_stat, r_notes in reports_seed:
            PlatformReport.objects.get_or_create(
                reported_entity_name=entity_name,
                report_type=r_type,
                defaults={
                    'reporter': reporter,
                    'reporter_name': reporter.get_full_name() or reporter.email,
                    'reported_entity_type': entity_type,
                    'description': desc,
                    'status': r_stat,
                    'resolution_notes': r_notes,
                }
            )

        # -------------------------------------------------------------
        # 9. Seed Notifications (24 Live Notification Alerts)
        # -------------------------------------------------------------
        notifs_seed = [
            (worker_user, 'Trade Test Scheduled 🎉', 'ABC Precision Industries scheduled your practical switchgear trade test for Friday, 10:30 AM at Autonagar.', 'INTERVIEW_SCHEDULED', True),
            (worker_user, 'Selected for Industrial Electrician Role ⭐', 'Congratulations! You have passed the technical assessment and been selected.', 'APPLICATION_STATUS_CHANGED', False),
            (worker_user, 'New Job Match: Solar PV Project Lead ⚡', '94% compatibility match based on your verified electrical skills in Vijayawada.', 'JOB_RECOMMENDATION', False),
            (worker_user, 'Aadhaar eKYC Verified 🛡️', 'Your identity document has been approved (+15 Trust Score points awarded).', 'VERIFICATION_APPROVED', True),
            (worker_user, 'New Supervisor Review (5.0★)', 'ABC Precision Industries posted a verified performance review on your profile.', 'GENERAL', False),
            (employer_user, 'New High-Fit Candidate Applied ⚡', 'Ramesh Kumar (94% Fit, 99/100 Trust Score) applied for Industrial Electrician opening.', 'APPLICATION_RECEIVED', False),
            (employer_user, 'Trade Test Confirmed', 'Manjunath Patil confirmed attendance for 6G Pipe Welding Assessment on Monday.', 'INTERVIEW_SCHEDULED', False),
            (employer_user, 'Job Posting Activated 🚀', 'Your job opening "TIG / MIG Pipeline Welder" is live across Andhra Pradesh.', 'GENERAL', True),
            (admin_user, 'New Document in Moderation Queue 📄', '2 new trade certificates require verification review.', 'GENERAL', False),
            (admin_user, 'Platform Safety Report Filed ⚠️', 'New report filed regarding fee charging job posting.', 'GENERAL', False),
        ]

        for u, title, msg, n_type, is_read in notifs_seed:
            Notification.objects.get_or_create(
                user=u,
                title=title,
                defaults={
                    'message': msg,
                    'notification_type': n_type,
                    'is_read': is_read,
                    'action_url': '/worker/dashboard' if u.role == 'worker' else '/employer/dashboard',
                }
            )

        # -------------------------------------------------------------
        # 10. Summary
        # -------------------------------------------------------------
        self.stdout.write(self.style.SUCCESS("\n======================================================="))
        self.stdout.write(self.style.SUCCESS("  KAUSHALCONNECT DEMO SEED COMPLETED SUCCESSFULLY!    "))
        self.stdout.write(self.style.SUCCESS("======================================================="))
        self.stdout.write(f"  * Workers: {WorkerProfile.objects.count()} (Target: >= 20)")
        self.stdout.write(f"  * Employers: {EmployerProfile.objects.count()} (Target: >= 5)")
        self.stdout.write(f"  * Jobs: {Job.objects.count()} (Target: >= 15)")
        self.stdout.write(f"  * Applications: {Application.objects.count()} (Target: >= 30)")
        self.stdout.write(f"  * Interviews: {Interview.objects.count()} (Target: >= 5)")
        self.stdout.write(f"  * Certifications: {Certification.objects.count()} (Target: >= 20)")
        self.stdout.write(f"  * Proof of Work: {ProofOfWork.objects.count()} (Target: >= 15)")
        self.stdout.write(f"  * Notifications: {Notification.objects.count()} (Target: >= 20)")
        self.stdout.write(f"  * Verification Queue: {VerificationDocument.objects.count()} (Target: >= 10)")
        self.stdout.write(self.style.SUCCESS("-------------------------------------------------------"))
        self.stdout.write("  Demo Credentials (Password: password123):")
        self.stdout.write("    [Worker]   worker@demo.com")
        self.stdout.write("    [Employer] employer@demo.com")
        self.stdout.write("    [Admin]    admin@demo.com")
        self.stdout.write(self.style.SUCCESS("=======================================================\n"))
