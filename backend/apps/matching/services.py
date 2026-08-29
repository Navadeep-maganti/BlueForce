"""
Explainable Matching Service Facade
Location: apps/matching/services.py
"""
from .scoring import calculate_match_score
from .recommendations import get_recommended_jobs_for_worker, get_ranked_candidates_for_job

def calculate_job_match(worker, job):
    """
    Calculates 100-point explainable match between a worker profile and a job.
    """
    res = calculate_match_score(worker, job)
    # Legacy alias mapping
    bd = res['breakdown']
    return {
        'match_percentage': res['match_score'],
        'match_score': res['match_score'],
        'eligible': res['eligible'],
        'breakdown': bd,
        'skill_compatibility': {'score': bd['skills'], 'max': 50, 'details': f"{bd['skills']}/50 Skill overlap"},
        'experience_score': {'score': bd['experience'], 'max': 20, 'details': f"{bd['experience']}/20 Experience alignment"},
        'location_score': {'score': bd['location'], 'max': 15, 'details': f"{bd['location']}/15 Commute proximity"},
        'certification_score': {'score': bd['certifications'], 'max': 5, 'details': f"{bd['certifications']}/5 Verified credentials"},
        'availability_score': {'score': bd['availability'], 'max': 10, 'details': f"{bd['availability']}/10 Onboarding readiness"},
        'strengths': res['strengths'],
        'gaps': res['gaps'],
        'reasons': res['strengths'],
    }
