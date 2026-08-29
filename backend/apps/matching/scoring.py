"""
Explainable Matching Scoring Engine
Location: apps/matching/scoring.py
"""
from typing import Dict, Any, List

def calculate_match_score(worker, job) -> Dict[str, Any]:
    """
    Calculates a transparent, explainable 100-point compatibility score between a WorkerProfile and a Job.

    Weighting:
    - Skills: 50 points (Required skills weighted higher than preferred skills)
    - Experience: 20 points
    - Location: 15 points
    - Certifications: 5 points
    - Availability: 10 points
    Total: 100 points
    """
    strengths: List[str] = []
    gaps: List[str] = []

    # -------------------------------------------------------------
    # 1. Skills Scoring (Max 50 pts)
    # -------------------------------------------------------------
    worker_skill_names = [s.skill_name.lower().strip() for s in worker.skills.all()] if hasattr(worker, 'skills') else []
    worker_trade = getattr(worker, 'primary_trade', '').lower().strip()
    if worker_trade:
        worker_skill_names.append(worker_trade)

    req_skills = [s.lower().strip() for s in (job.required_skills or [])]
    pref_skills = [s.lower().strip() for s in (job.preferred_skills or [])]

    # Required skills (Max 38 pts)
    if req_skills:
        matched_req = [s for s in req_skills if any(s in ws or ws in s for ws in worker_skill_names)]
        req_ratio = len(matched_req) / len(req_skills)
        req_score = round(req_ratio * 38)
        if len(matched_req) == len(req_skills):
            strengths.append(f"Matches all {len(req_skills)} required technical trade skills")
        elif len(matched_req) > 0:
            strengths.append(f"Matches {len(matched_req)} of {len(req_skills)} required skills ({', '.join(matched_req[:2])})")
        
        missing_req = [s for s in req_skills if s not in matched_req]
        if missing_req:
            gaps.append(f"Required skill '{missing_req[0].title()}' not verified on profile")
    else:
        req_score = 38

    # Preferred skills (Max 12 pts)
    if pref_skills:
        matched_pref = [s for s in pref_skills if any(s in ws or ws in s for ws in worker_skill_names)]
        pref_ratio = len(matched_pref) / len(pref_skills)
        pref_score = round(pref_ratio * 12)
        if matched_pref:
            strengths.append(f"Has preferred bonus skill: {matched_pref[0].title()}")
        else:
            gaps.append(f"Preferred skill '{pref_skills[0].title()}' could boost hiring preference")
    else:
        pref_score = 12

    skills_score = min(50, max(0, req_score + pref_score))

    # -------------------------------------------------------------
    # 2. Experience Scoring (Max 20 pts)
    # -------------------------------------------------------------
    req_exp = getattr(job, 'experience_required_years', 0) or 0
    worker_exp = getattr(worker, 'years_of_experience', 0) or 0

    if worker_exp >= req_exp:
        exp_score = 20
        if worker_exp > req_exp:
            strengths.append(f"Exceeds minimum experience requirement ({worker_exp} yrs vs {req_exp} yrs required)")
        else:
            strengths.append(f"Meets exact experience requirement ({worker_exp} yrs industrial tenure)")
    else:
        ratio = worker_exp / max(1, req_exp)
        exp_score = round(ratio * 20)
        gaps.append(f"Has {worker_exp} years experience ({req_exp} yrs preferred for role)")

    # -------------------------------------------------------------
    # 3. Location Scoring (Max 15 pts)
    # -------------------------------------------------------------
    worker_city = (getattr(worker, 'city', '') or '').lower().strip()
    job_city = (getattr(job, 'city', '') or '').lower().strip()
    worker_loc = (getattr(worker, 'location', '') or '').lower().strip()
    job_loc = (getattr(job, 'location', '') or '').lower().strip()

    if worker_city and job_city and worker_city == job_city:
        loc_score = 15
        strengths.append(f"Located directly in {job.city} for immediate plant commuting")
    elif (worker_city in job_loc) or (job_city in worker_loc):
        loc_score = 12
        strengths.append(f"Located within commuting radius of {job.city}")
    else:
        loc_score = 7
        gaps.append(f"Candidate based in {worker.city or 'nearby region'} — may require shift relocation")

    # -------------------------------------------------------------
    # 4. Certification Scoring (Max 5 pts)
    # -------------------------------------------------------------
    verified_certs_count = 0
    if hasattr(worker, 'certifications'):
        verified_certs_count = worker.certifications.filter(verification_status='verified').count()
    
    if verified_certs_count > 0:
        cert_score = 5
        strengths.append(f"Holds {verified_certs_count} verified government trade certification(s)")
    else:
        cert_score = 2
        gaps.append("Government ITI / NCVT certificate upload will boost trust rank")

    # -------------------------------------------------------------
    # 5. Availability Scoring (Max 10 pts)
    # -------------------------------------------------------------
    avail = (getattr(worker, 'availability', '') or '').lower().strip()
    if avail in ['available_now', 'immediate', 'immediately']:
        avail_score = 10
        strengths.append("Available for immediate plant joining")
    elif avail in ['within_15_days', '15_days']:
        avail_score = 8
    else:
        avail_score = 5
        gaps.append("Notice period required for joining")

    # -------------------------------------------------------------
    # Total Score Calculation
    # -------------------------------------------------------------
    total_score = min(100, max(0, skills_score + exp_score + loc_score + cert_score + avail_score))
    eligible = (skills_score >= 20) and (worker_exp >= max(0, req_exp - 2))

    return {
        'match_score': total_score,
        'eligible': eligible,
        'breakdown': {
            'skills': skills_score,
            'experience': exp_score,
            'location': loc_score,
            'certifications': cert_score,
            'availability': avail_score,
        },
        'strengths': strengths[:3],
        'gaps': gaps[:2],
    }
