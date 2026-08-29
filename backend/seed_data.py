import os
import django
from datetime import date, datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.accounts.models import User
from apps.workers.models import (
    WorkerProfile,
    Skill,
    WorkerSkill,
    Certification,
    WorkExperience,
    ProofOfWork,
    SupervisorReview,
    CareerRecommendation,
)
from apps.employers.models import EmployerProfile
from apps.jobs.models import Job
from apps.applications.models import Application, ApplicationTimelineEvent, Interview
from apps.verification.models import VerificationDocument
from apps.reports.models import PlatformReport
from apps.notifications.models import Notification

def seed_database():
    print("[*] Cleaning existing data...")
    User.objects.all().delete()
    Skill.objects.all().delete()
    WorkerProfile.objects.all().delete()
    EmployerProfile.objects.all().delete()
    Job.objects.all().delete()
    Application.objects.all().delete()
    VerificationDocument.objects.all().delete()
    PlatformReport.objects.all().delete()
    Notification.objects.all().delete()

    print("[+] Creating demo users...")
    worker_user = User.objects.create_user(
        username='worker@demo.com',
        email='worker@demo.com',
        password='password123',
        role='worker',
        phone='+91 98480 12345',
        location='Vijayawada, Andhra Pradesh',
        avatar_url='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        is_verified=True
    )

    employer_user = User.objects.create_user(
        username='employer@demo.com',
        email='employer@demo.com',
        password='password123',
        role='employer',
        phone='+91 98490 54321',
        location='Autonagar, Vijayawada, AP',
        avatar_url='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        is_verified=True
    )

    admin_user = User.objects.create_superuser(
        username='admin@demo.com',
        email='admin@demo.com',
        password='password123',
        role='admin',
        phone='+91 99000 11223',
        location='Hyderabad, Telangana',
        avatar_url='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
        is_verified=True,
        is_staff=True
    )

    print("[+] Creating employer profile & plant specs...")
    employer_profile = EmployerProfile.objects.create(
        user=employer_user,
        company_name='ABC Industries Ltd.',
        trade_industry='Industrial Precision Manufacturing & Power Engineering',
        tagline='Leading manufacturer of heavy electrical switchgear and automotive components since 2008',
        description='ABC Industries operates state-of-the-art manufacturing plants in Autonagar Vijayawada employing over 600 skilled technicians.',
        gst_or_cin_number='GSTIN: 37AAACA4918L1Z9',
        location='Plot 42, Autonagar Industrial Area, Vijayawada, AP',
        city='Vijayawada',
        state='Andhra Pradesh',
        logo_url='https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&auto=format&fit=crop&q=80',
        is_verified=True,
        verification_badge='Verified Enterprise Employer',
        employee_count='500-1000 Employees',
        established_year=2008,
        contact_person='K. Satyanarayana (General Manager - Operations)',
        contact_email='careers@abcindustries.in',
        contact_phone='+91 866 2489000'
    )

    print("[+] Creating worker profiles & trade credentials...")
    ramesh_profile = WorkerProfile.objects.create(
        user=worker_user,
        full_name='Ramesh Kumar',
        primary_trade='Industrial Electrician & Motor Specialist',
        tagline='Certified Industrial Wireman with 5+ years plant & substation commissioning experience',
        bio='ITI-certified electrician specializing in high-voltage three-phase motor wiring, switchgear installation, LT/HT panel troubleshooting, and plant power safety audits.',
        location='Vijayawada, Andhra Pradesh',
        city='Vijayawada',
        state='Andhra Pradesh',
        pin_code='520001',
        preferred_radius_km=25,
        availability='available_now',
        expected_salary_min=25000,
        expected_salary_max=32000,
        years_of_experience=5,
        education='ITI Electrical Diploma (Government ITI Vijayawada)',
        languages=['Telugu (Fluent)', 'Hindi (Conversational)', 'English (Working)'],
        profile_strength_percent=88,
        trust_score_total=91,
        trust_identity_score=20,
        trust_certifications_score=18,
        trust_skills_score=19,
        trust_experience_score=15,
        trust_reviews_score=10,
        trust_completed_jobs_score=9
    )

    # Worker Skills
    WorkerSkill.objects.create(worker=ramesh_profile, skill_name='Industrial Three-Phase Wiring', category='Electrical', level=5, years_experience=5, is_verified=True, verification_source='AP State Skill Development Council Test')
    WorkerSkill.objects.create(worker=ramesh_profile, skill_name='LT/HT Switchgear & Control Panels', category='Electrical', level=4, years_experience=4, is_verified=True, verification_source='ABC Industries Field Assessment')
    WorkerSkill.objects.create(worker=ramesh_profile, skill_name='AC/DC Motor Maintenance & Rewinding', category='Machinery', level=5, years_experience=5, is_verified=True, verification_source='NSDC Trade Certification')
    WorkerSkill.objects.create(worker=ramesh_profile, skill_name='Industrial Safety & Earthing Protocols', category='Safety', level=4, years_experience=4, is_verified=True, verification_source='Plant Safety Audit')

    # Worker Certifications
    Certification.objects.create(
        worker=ramesh_profile,
        title='National Trade Certificate (NTC) — Electrician Trade',
        issuing_body='National Council for Vocational Training (NCVT / DGT)',
        issue_date=date(2020, 7, 15),
        credential_id='NCVT-EL-2020-8849',
        document_url='https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop&q=80',
        verification_status='verified'
    )
    Certification.objects.create(
        worker=ramesh_profile,
        title='Government Wireman Competency Certificate (A-Grade)',
        issuing_body='Chief Electrical Inspectorate to Government (CEIG), AP',
        issue_date=date(2021, 3, 20),
        credential_id='CEIG-AP-LIC-44912',
        document_url='https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=600&auto=format&fit=crop&q=80',
        verification_status='verified'
    )

    # Work Experiences
    WorkExperience.objects.create(
        worker=ramesh_profile,
        job_title='Senior Plant Electrician',
        company_name='ABC Industries Ltd.',
        location='Autonagar Industrial Area, Vijayawada',
        start_date=date(2022, 4, 1),
        is_current=True,
        description='Managed maintenance of 440V distribution panels, motor control centers (MCC), and 500kVA backup diesel generator synchronizers.',
        skills_used=['LT Panels', 'Motor Rewinding', 'Capacitor Banks'],
        is_employer_verified=True
    )

    # Proof of Work
    ProofOfWork.objects.create(
        worker=ramesh_profile,
        title='250 kVA Industrial Motor Control Center Installation',
        description='Fabricated and wired full starter panels with star-delta contactors, thermal overload relays, and digital energy meters.',
        category='Industrial Electrical',
        images=['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'],
        skills_demonstrated=['MCC Panel Wiring', 'Cable Routing', 'Protection Relays'],
        client_or_employer='ABC Industries Ltd.',
        location='Vijayawada',
        completion_date=date(2024, 11, 15),
        is_verified=True,
        verified_by='Senior Electrical Engineer, ABC Industries'
    )

    # Supervisor Reviews
    SupervisorReview.objects.create(
        worker=ramesh_profile,
        reviewer_name='K. Satyanarayana',
        reviewer_company='Plant Manager, ABC Industries',
        rating=5.0,
        comment='Ramesh is an exceptional technician. His understanding of high-voltage motor schematics and adherence to safety protocols is top notch.'
    )

    # Additional Worker 2: Suresh Reddy (CNC Machinist)
    suresh_user = User.objects.create_user(
        username='suresh@demo.com',
        email='suresh@demo.com',
        password='password123',
        role='worker',
        phone='+91 98480 98765',
        location='Hyderabad, Telangana',
        avatar_url='https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
        is_verified=True
    )
    suresh_profile = WorkerProfile.objects.create(
        user=suresh_user,
        full_name='Suresh Reddy',
        primary_trade='CNC Milling & Turning Operator',
        tagline='Expert 5-Axis CNC Setter & CAD/CAM G-Code Programmer with 6 yrs precision toolroom experience',
        bio='Experienced CNC Machinist with deep knowledge of Fanuc/Siemens 840D controllers, micro-tolerance machining, and tool offset calibration.',
        location='Hyderabad, Telangana',
        city='Hyderabad',
        state='Telangana',
        pin_code='500037',
        preferred_radius_km=35,
        availability='available_now',
        expected_salary_min=28000,
        expected_salary_max=36000,
        years_of_experience=6,
        education='Diploma in Mechanical Engineering (SBTET)',
        languages=['Telugu (Native)', 'Hindi (Fluent)', 'English (Working)'],
        profile_strength_percent=92,
        trust_score_total=88,
        trust_identity_score=20,
        trust_certifications_score=17,
        trust_skills_score=19,
        trust_experience_score=14,
        trust_reviews_score=10,
        trust_completed_jobs_score=8
    )
    WorkerSkill.objects.create(worker=suresh_profile, skill_name='5-Axis CNC Milling & Fanuc Programming', category='Machining', level=5, years_experience=6, is_verified=True, verification_source='NSDC Master Machinist Cert')
    WorkerSkill.objects.create(worker=suresh_profile, skill_name='Siemens 840D Controller Operation', category='Machining', level=4, years_experience=5, is_verified=True)

    # Additional Worker 3: Priya Devi (Solar PV Technician)
    priya_user = User.objects.create_user(
        username='priya@demo.com',
        email='priya@demo.com',
        password='password123',
        role='worker',
        phone='+91 98480 33445',
        location='Bengaluru, Karnataka',
        avatar_url='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        is_verified=True
    )
    priya_profile = WorkerProfile.objects.create(
        user=priya_user,
        full_name='Priya Devi',
        primary_trade='Rooftop Solar & Micro-Grid Technician',
        tagline='Skill Council for Green Jobs (SCGJ) Certified Suryamitra with 3.5 MW grid-tied installations',
        bio='Certified solar installation engineer specializing in string inverter wiring, array shadow analysis, net-metering synchronization, and DC string combiner protection.',
        location='Bengaluru, Karnataka',
        city='Bengaluru',
        state='Karnataka',
        pin_code='560058',
        preferred_radius_km=30,
        availability='available_now',
        expected_salary_min=24000,
        expected_salary_max=30000,
        years_of_experience=4,
        education='ITI Solar PV Technician / SCGJ Suryamitra',
        languages=['Kannada (Native)', 'Telugu (Fluent)', 'English (Fluent)', 'Hindi (Working)'],
        profile_strength_percent=95,
        trust_score_total=94,
        trust_identity_score=20,
        trust_certifications_score=20,
        trust_skills_score=19,
        trust_experience_score=15,
        trust_reviews_score=11,
        trust_completed_jobs_score=9
    )
    WorkerSkill.objects.create(worker=priya_profile, skill_name='Solar String Inverter Synchronization', category='Solar', level=5, years_experience=4, is_verified=True, verification_source='SCGJ Govt Trade Assessment')
    WorkerSkill.objects.create(worker=priya_profile, skill_name='DC Array Wiring & Combiner Protection', category='Solar', level=5, years_experience=4, is_verified=True)

    # Additional Worker 4: Manjunath Patil (TIG/MIG Welder)
    manjunath_user = User.objects.create_user(
        username='manjunath@demo.com',
        email='manjunath@demo.com',
        password='password123',
        role='worker',
        phone='+91 98480 66778',
        location='Vijayawada, Andhra Pradesh',
        avatar_url='https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
        is_verified=True
    )
    manjunath_profile = WorkerProfile.objects.create(
        user=manjunath_user,
        full_name='Manjunath Patil',
        primary_trade='TIG / MIG High-Pressure Pipe Welder',
        tagline='6G ASME Certified High-Pressure Steam & Pipeline Welder with 7 yrs industrial fabrication',
        bio='Certified 6G pipeline welder with zero radiographic defect history in boiler tubes and high-pressure steam distribution.',
        location='Vijayawada, Andhra Pradesh',
        city='Vijayawada',
        state='Andhra Pradesh',
        pin_code='520007',
        preferred_radius_km=40,
        availability='in_two_weeks',
        expected_salary_min=27000,
        expected_salary_max=35000,
        years_of_experience=7,
        education='ITI Welder Trade / Indian Institute of Welding (IIW)',
        languages=['Telugu (Native)', 'Hindi (Fluent)'],
        profile_strength_percent=90,
        trust_score_total=89,
        trust_identity_score=20,
        trust_certifications_score=19,
        trust_skills_score=18,
        trust_experience_score=14,
        trust_reviews_score=10,
        trust_completed_jobs_score=8
    )
    WorkerSkill.objects.create(worker=manjunath_profile, skill_name='6G Pipe TIG Welding', category='Welding', level=5, years_experience=7, is_verified=True)
    WorkerSkill.objects.create(worker=manjunath_profile, skill_name='Radiographic Quality Weld Inspection', category='Welding', level=5, years_experience=6, is_verified=True)

    print("[+] Creating active jobs...")
    job1 = Job.objects.create(
        employer=employer_profile,
        title='Industrial Electrician & Substation Technician',
        trade_category='Electrical',
        location='Autonagar, Vijayawada',
        city='Vijayawada',
        distance_km=6.0,
        salary_min=25000,
        salary_max=32000,
        salary_period='monthly',
        experience_required_years=4,
        job_type='Full-time',
        shift='Day Shift',
        openings=4,
        joining_date='Immediate / Within 15 Days',
        deadline_date='2026-04-30',
        required_skills=['Industrial Three-Phase Wiring', 'LT/HT Switchgear', 'Motor Maintenance', 'Plant Safety'],
        preferred_skills=['PLC Troubleshooting', 'Capacitor Bank Calibration'],
        required_certifications=['ITI Electrician Diploma', 'A-Grade Wireman License'],
        description='Looking for a certified Industrial Electrician to supervise plant electrical distribution, perform preventative maintenance on 440V motor control centers, and maintain power reliability.',
        benefits=['PF & ESI Provided', 'Subsidized Canteen', 'Annual Bonus', 'Overtime Allowance (1.5x)', 'Safety Gear Provided'],
        work_address='Plot 42, Phase-2, Autonagar Industrial Area, Vijayawada, AP',
        status='active'
    )

    job2 = Job.objects.create(
        employer=employer_profile,
        title='TIG / MIG Pipeline Welder (Pressure Vessels)',
        trade_category='Welding',
        location='Autonagar, Vijayawada',
        city='Vijayawada',
        distance_km=6.0,
        salary_min=26000,
        salary_max=34000,
        salary_period='monthly',
        experience_required_years=4,
        job_type='Full-time',
        shift='Day Shift',
        openings=3,
        joining_date='Immediate',
        deadline_date='2026-04-25',
        required_skills=['6G Pipe TIG Welding', 'Structural MIG Welding', 'Radiographic Quality'],
        required_certifications=['ITI Welder', 'ASME / IIW 6G Certificate'],
        description='Perform heavy fabrication and high-pressure steam pipe welding. Welds will undergo radiographic NDT and hydrostatic pressure tests.',
        benefits=['PF & ESI', 'Welding Health Allowance', 'Overtime Pay', 'Safety PPE Provided'],
        work_address='Autonagar Heavy Fabrication Yard, Vijayawada',
        status='active'
    )

    print("[+] Creating application pipeline & interviews...")
    app1 = Application.objects.create(
        job=job1,
        worker=ramesh_profile,
        current_stage='Interview',
        match_score=94,
        employer_notes='Excellent proof of work in 250kVA panel installation. Strong candidate for morning shift lead.',
        rating=5.0
    )
    ApplicationTimelineEvent.objects.create(application=app1, stage='Applied', note='Application submitted with verified Trust Score (91/100)')
    ApplicationTimelineEvent.objects.create(application=app1, stage='Screening', note='AI Matching scored 94%. ITI certificate verified automatically.')
    ApplicationTimelineEvent.objects.create(application=app1, stage='Shortlisted', note='Selected for trade test by Plant Manager K. Satyanarayana')
    ApplicationTimelineEvent.objects.create(application=app1, stage='Interview', note='Practical motor wiring trade test scheduled for Monday 10:00 AM')

    Interview.objects.create(
        application=app1,
        date=date(2026, 3, 2),
        time='10:00 AM IST',
        interview_type='In-person Trade Test',
        location_or_link='ABC Industries Main Plant, Maintenance Bay 4, Autonagar, Vijayawada',
        instructions='Please bring original A-grade wireman license and wear standard safety boots.',
        interviewer_name='K. Satyanarayana (General Manager - Operations)',
        status='scheduled'
    )

    print("[+] Creating verification documents & reports...")
    VerificationDocument.objects.create(
        entity_type='worker',
        worker=ramesh_profile,
        doc_type='Aadhaar / National ID',
        doc_number='XXXX-XXXX-8921',
        file_url='https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=600&auto=format&fit=crop&q=80',
        status='verified',
        reviewed_by='Admin Moderator (Auto UIDAI)'
    )
    VerificationDocument.objects.create(
        entity_type='worker',
        worker=ramesh_profile,
        doc_type='ITI Diploma',
        doc_number='NCVT-EL-2020-8849',
        file_url='https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop&q=80',
        status='verified',
        reviewed_by='Admin Moderator'
    )
    VerificationDocument.objects.create(
        entity_type='employer',
        employer=employer_profile,
        doc_type='GST Certificate',
        doc_number='37AAACA4918L1Z9',
        file_url='https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
        status='verified',
        reviewed_by='Admin Moderator (GST Portal Match)'
    )

    PlatformReport.objects.create(
        reporter=worker_user,
        reporter_name='Ramesh Kumar',
        reported_entity_name='Shree Sai Manpower Agency',
        reported_entity_type='employer',
        reason_category='Fake Job',
        description='Demanded ₹2,500 upfront registration fee for a bogus factory job in Autonagar. Violates direct hiring policy.',
        status='pending'
    )

    Notification.objects.create(
        user=worker_user,
        title='Interview Scheduled with ABC Industries!',
        message='Plant GM scheduled your on-site trade test for Industrial Electrician role on Monday at 10:00 AM.',
        notification_type='interview',
        action_url='/worker/applications'
    )

    print("[SUCCESS] Database seeded successfully!")

if __name__ == '__main__':
    seed_database()
