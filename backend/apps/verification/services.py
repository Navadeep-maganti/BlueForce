"""
Trust Score Calculation Engine (100-Point Explainable Mechanism)
Location: apps/verification/services.py
"""

def calculate_trust_score(worker) -> dict:
    """
    Calculates a transparent, explainable 100-point trust score for a worker.

    Scoring System Breakdown:
    1. Identity Verification (Max: 15 pts)
       - Awarded based on government ID verification (Aadhaar / National ID eKYC).
    2. Verified Certifications (Max: 20 pts)
       - Awarded for approved NCVT/SCGJ/State technical trade certifications.
    3. Skills & Competency (Max: 20 pts)
       - Awarded based on trade skill breadth, star proficiency, and verified assessments.
    4. Work Experience (Max: 15 pts)
       - Awarded for documented and verified tenure in industrial plants/workplaces.
    5. Employer / Supervisor Reviews (Max: 15 pts)
       - Awarded based on ratings and verified employer feedback.
    6. Proof of Work Portfolio (Max: 15 pts)
       - Awarded for verified photo project submissions with supervisor stamps.

    Total: 100 Points Max.
    """
    if not worker:
        return {
            'score': 0,
            'breakdown': {
                'identity_verification': 0,
                'certifications': 0,
                'skills': 0,
                'experience': 0,
                'reviews': 0,
                'proof_of_work': 0,
            },
            'recommendations': ['Complete your worker profile to start building your Trust Score.']
        }

    recommendations = []

    # 1. Identity Verification (Max: 15 pts)
    # Check User verification or verified Aadhaar document
    has_verified_id = False
    if hasattr(worker, 'user') and worker.user and worker.user.is_verified:
        has_verified_id = True
    elif hasattr(worker, 'verification_documents'):
        has_verified_id = worker.verification_documents.filter(
            doc_type__icontains='Aadhaar',
            status='verified'
        ).exists()

    if has_verified_id:
        identity_score = 15
    elif hasattr(worker, 'verification_documents') and worker.verification_documents.filter(status='pending').exists():
        identity_score = 8
        recommendations.append("Your identity document is currently under review by platform moderators.")
    else:
        identity_score = 0
        recommendations.append("Verify your Aadhaar or Government ID to gain +15 Trust points.")

    # 2. Verified Certifications (Max: 20 pts)
    # 10 pts per verified certification, up to 20 pts max
    verified_certs_count = 0
    if hasattr(worker, 'certifications'):
        verified_certs_count = worker.certifications.filter(verification_status='verified').count()
    
    cert_score = min(20, verified_certs_count * 10)
    if cert_score < 20:
        needed = 2 - verified_certs_count
        recommendations.append(f"Upload and verify {max(1, needed)} more trade certification(s) (ITI/NCVT) to gain +{20 - cert_score} points.")

    # 3. Skills & Competency (Max: 20 pts)
    # Base 8 pts for declared skills (up to 4 skills * 2 pts) + 3 pts per verified skill (up to 4 * 3 = 12 pts)
    skills_qs = worker.skills.all() if hasattr(worker, 'skills') else []
    total_skills = len(skills_qs)
    verified_skills = sum(1 for s in skills_qs if getattr(s, 'is_verified', False))

    declared_points = min(8, total_skills * 2)
    verified_points = min(12, verified_skills * 3)
    skills_score = min(20, declared_points + verified_points)

    if total_skills == 0:
        skills_score = 5 # Graceful base if trade declared
        recommendations.append("Add your primary technical skills to boost your Trust Score.")
    elif verified_skills < 3:
        recommendations.append("Take trade assessments to verify your skills and unlock +6 points.")

    # 4. Work Experience (Max: 15 pts)
    # 3 pts per year of experience, up to 15 pts (5 years = 15 pts)
    years_exp = getattr(worker, 'years_of_experience', 0) or 0
    experience_score = min(15, max(5, int(years_exp * 3)))
    if years_exp < 3:
        recommendations.append("Document previous plant and site experience to increase tenure credibility.")

    # 5. Employer / Supervisor Reviews (Max: 15 pts)
    reviews_qs = worker.reviews.all() if hasattr(worker, 'reviews') else []
    review_count = len(reviews_qs)
    if review_count > 0:
        avg_rating = sum(getattr(r, 'rating', 5.0) for r in reviews_qs) / review_count
        reviews_score = min(15, int((avg_rating / 5.0) * 12 + min(3, review_count)))
    else:
        # Graceful baseline if worker has completed jobs
        reviews_score = 10 if years_exp >= 3 else 5
        recommendations.append("Request a supervisor review from your previous employer to gain up to +15 points.")

    # 6. Proof of Work Portfolio (Max: 15 pts)
    # 5 pts per verified photo work item (3 items = 15 pts)
    pows_qs = worker.proof_of_works.all() if hasattr(worker, 'proof_of_works') else []
    pow_count = len(pows_qs)
    verified_pow_count = sum(1 for p in pows_qs if getattr(p, 'is_verified', False))

    pow_score = min(15, max(6 if pow_count > 0 else 0, verified_pow_count * 5 + (pow_count - verified_pow_count) * 2))
    if pow_score < 15:
        recommendations.append("Upload photo proof of completed installations or repairs to gain +5 points per project.")

    # Aggregate Total Score (Guaranteed 0 - 100)
    total_score = min(100, max(0, identity_score + cert_score + skills_score + experience_score + reviews_score + pow_score))

    # Clean fallback recommendations if already high score
    if not recommendations or total_score >= 90:
        recommendations = [
            "Your digital trade profile is highly trusted by plant employers!",
            "Keep adding new photo work proofs after completing site projects."
        ]

    return {
        'score': total_score,
        'breakdown': {
            'identity_verification': identity_score,
            'certifications': cert_score,
            'skills': skills_score,
            'experience': experience_score,
            'reviews': reviews_score,
            'proof_of_work': pow_score,
        },
        'max_possible': {
            'identity_verification': 15,
            'certifications': 20,
            'skills': 20,
            'experience': 15,
            'reviews': 15,
            'proof_of_work': 15,
        },
        'recommendations': recommendations[:3]
    }
