"""
Recommendation & Candidate Ranking Engine
Location: apps/matching/recommendations.py
"""
from typing import List, Dict, Any
from apps.jobs.models import Job
from apps.workers.models import WorkerProfile
from .scoring import calculate_match_score

def get_recommended_jobs_for_worker(worker: WorkerProfile, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Ranks active marketplace jobs for a worker with explainable fit scores.
    """
    active_jobs = Job.objects.filter(
        status=Job.StatusChoices.ACTIVE
    ).select_related('employer')

    scored_jobs = []
    for job in active_jobs:
        match_res = calculate_match_score(worker, job)
        scored_jobs.append({
            'job_id': job.id,
            'title': job.title,
            'trade_category': job.trade_category,
            'company_name': job.employer.company_name,
            'company_logo_url': job.employer.logo_url,
            'is_company_verified': job.employer.is_verified,
            'location': job.location,
            'city': job.city,
            'salary_min': job.salary_min,
            'salary_max': job.salary_max,
            'salary_period': job.salary_period,
            'job_type': job.job_type,
            'shift': job.shift,
            'experience_required_years': job.experience_required_years,
            'required_skills': job.required_skills,
            'match_score': match_res['match_score'],
            'eligible': match_res['eligible'],
            'breakdown': match_res['breakdown'],
            'strengths': match_res['strengths'],
            'gaps': match_res['gaps'],
        })

    # Sort descending by match score
    scored_jobs.sort(key=lambda x: x['match_score'], reverse=True)
    return scored_jobs[:limit]

def get_ranked_candidates_for_job(job: Job, limit: int = 20) -> List[Dict[str, Any]]:
    """
    Ranks technician candidates for a specific employer job vacancy with strengths and gaps.
    """
    candidates = WorkerProfile.objects.select_related('user').prefetch_related(
        'skills', 'certifications', 'proof_of_works'
    )

    scored_candidates = []
    for worker in candidates:
        match_res = calculate_match_score(worker, job)
        top_skills = [s.skill_name for s in worker.skills.all()[:4]]
        scored_candidates.append({
            'worker_id': worker.id,
            'full_name': worker.full_name,
            'primary_trade': worker.primary_trade,
            'tagline': worker.tagline,
            'location': worker.location,
            'city': worker.city,
            'years_of_experience': worker.years_of_experience,
            'availability': worker.availability,
            'trust_score': worker.trust_score_total,
            'is_verified': worker.user.is_verified,
            'avatar_url': worker.user.avatar_url,
            'top_skills': top_skills,
            'match_score': match_res['match_score'],
            'eligible': match_res['eligible'],
            'breakdown': match_res['breakdown'],
            'strengths': match_res['strengths'],
            'gaps': match_res['gaps'],
        })

    scored_candidates.sort(key=lambda x: (x['match_score'], x['trust_score']), reverse=True)
    return scored_candidates[:limit]
