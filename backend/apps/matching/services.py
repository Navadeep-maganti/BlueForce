"""
Explainable AI Match Engine for KaushalConnect
Calculates transparent point breakdown between a WorkerProfile and a Job.
"""

def calculate_job_match(worker, job):
    """
    Returns a dict with:
    - match_percentage (0 to 100)
    - skill_compatibility (score / 50)
    - experience_score (score / 20)
    - location_score (score / 15)
    - certification_score (score / 5)
    - availability_score (score / 10)
    - reasons list
    """
    # 1. Skill Compatibility (Max 50)
    worker_skills = set(s.skill_name.lower() for s in worker.skills.all())
    required_skills = set(s.lower() for s in job.required_skills)
    
    matched_skills = worker_skills.intersection(required_skills)
    skill_ratio = len(matched_skills) / max(1, len(required_skills))
    skill_score = round(min(50, skill_ratio * 45 + (5 if len(matched_skills) > 0 else 0)))

    # 2. Experience Fit (Max 20)
    req_exp = max(1, job.experience_required_years)
    worker_exp = worker.years_of_experience
    if worker_exp >= req_exp:
        exp_score = 20
        exp_detail = f"{worker_exp} years experience (meets {req_exp} yrs requirement)"
    else:
        exp_score = round((worker_exp / req_exp) * 20)
        exp_detail = f"{worker_exp} years experience ({req_exp} yrs requested)"

    # 3. Location / Proximity (Max 15)
    if worker.city.lower() == job.city.lower():
        loc_score = 14
        loc_detail = f"Located in {worker.city} ({round(job.distance_km)} km commute)"
    else:
        loc_score = 6
        loc_detail = f"Inter-city ({worker.city} -> {job.city})"

    # 4. Certifications (Max 5)
    verified_certs_count = worker.certifications.filter(verification_status='verified').count()
    cert_score = 5 if verified_certs_count > 0 else 2
    cert_detail = f"{verified_certs_count} Government trade certifications active"

    # 5. Availability (Max 10)
    avail_score = 10 if worker.availability == 'available_now' else 7
    avail_detail = "Worker ready for immediate onboarding" if worker.availability == 'available_now' else "Available in 2 weeks"

    total = min(100, skill_score + exp_score + loc_score + cert_score + avail_score)

    reasons = []
    if len(matched_skills) > 0:
        reasons.append(f"Matches {len(matched_skills)} required trade skills: {', '.join(list(matched_skills)[:2])}")
    if exp_score >= 18:
        reasons.append(f"Strong experience tenure ({worker_exp} years verified)")
    if loc_score >= 12:
        reasons.append(f"Nearby in {job.city} ({round(job.distance_km)} km away)")
    if cert_score >= 4:
        reasons.append("Government ITI / Trade license verified")

    return {
        'match_percentage': total,
        'skill_compatibility': {'score': skill_score, 'max': 50, 'details': f"Matches {len(matched_skills)} of {len(required_skills)} required skills"},
        'experience_score': {'score': exp_score, 'max': 20, 'details': exp_detail},
        'location_score': {'score': loc_score, 'max': 15, 'details': loc_detail},
        'certification_score': {'score': cert_score, 'max': 5, 'details': cert_detail},
        'availability_score': {'score': avail_score, 'max': 10, 'details': avail_detail},
        'reasons': reasons
    }
