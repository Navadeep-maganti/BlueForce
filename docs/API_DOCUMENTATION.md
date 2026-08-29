# KaushalConnect — REST API Specification & Endpoint Reference

---

## 1. Overview & Conventions

The KaushalConnect API is a stateless RESTful service versioned under `/api/v1/`. All data exchanges occur in JSON format.

### 1.1 Base URLs
- **Local Development**: `http://127.0.0.1:8000/api/v1/`
- **Swagger Interactive Playground**: `http://127.0.0.1:8000/api/docs/`
- **ReDoc Technical Reference**: `http://127.0.0.1:8000/api/redoc/`
- **Raw OpenAPI 3.0 Schema**: `http://127.0.0.1:8000/api/schema/`

### 1.2 Authentication & Authorization Headers
Protected endpoints require a JSON Web Token (JWT) passed in the HTTP `Authorization` header:
```http
Authorization: Bearer <ACCESS_TOKEN>
```

### 1.3 Standard Response Envelope
All API endpoints return a standardized envelope:
```json
{
  "success": true,
  "message": "Human-readable status summary.",
  "data": { ... },
  "errors": null,
  "meta": {
    "count": 26,
    "next": "http://127.0.0.1:8000/api/v1/jobs/?page=2",
    "previous": null
  }
}
```

---

## 2. Authentication APIs (`/api/v1/auth/`)

| Method | Endpoint | Allowed Roles | Description | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| **`POST`** | `/api/v1/auth/register/` | Public | Register new Worker or Employer | `email`, `password`, `role`, `full_name`, `phone`, `primary_trade`, `company_name` |
| **`POST`** | `/api/v1/auth/login/` | Public | Obtain JWT Access + Refresh tokens | `username` (or `email`), `password` |
| **`POST`** | `/api/v1/auth/refresh/` | Public | Refresh expired JWT access token | `refresh` (refresh token string) |
| **`GET`** | `/api/v1/auth/me/` | Authenticated | Get current authenticated user profile | None |
| **`POST`** | `/api/v1/auth/logout/` | Authenticated | Blacklist refresh token and logout | `refresh` |

---

## 3. Worker Discovery & Profile APIs (`/api/v1/workers/`)

| Method | Endpoint | Allowed Roles | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- | :--- |
| **`GET`** | `/api/v1/workers/` | Public / Employer | Multi-parameter candidate discovery | `search`, `skill`, `location`, `experience`, `availability`, `minimum_trust_score`, `verified_only`, `ordering` |
| **`GET`** | `/api/v1/workers/<id>/` | Public / Employer | Public worker profile & proof of work | Path `id` |
| **`GET`** | `/api/v1/workers/me/` | Worker | Authenticated worker profile + trust score | None |
| **`PATCH`**| `/api/v1/workers/me/` | Worker | Update bio, location, salary expectation | `bio`, `city`, `location`, `expected_salary_min`, `availability` |
| **`GET`** | `/api/v1/workers/me/career-insights/` | Worker | Missing high-yield skills vs. active market demand | None |
| **`GET`** | `/api/v1/workers/<id>/reviews/` | Public | Verified supervisor reviews for worker | Path `id` |
| **`POST`**| `/api/v1/workers/<id>/save/` | Employer | Bookmark candidate to talent roster | Path `id` |
| **`DELETE`**| `/api/v1/workers/<id>/save/` | Employer | Remove candidate from talent roster | Path `id` |
| **`GET`** | `/api/v1/workers/me/skills/` | Worker | List worker skills | None |
| **`POST`**| `/api/v1/workers/me/skills/` | Worker | Add trade skill | `skill_name`, `category`, `level` (1-5), `years_experience` |
| **`DELETE`**| `/api/v1/workers/me/skills/<id>/`| Worker | Delete trade skill | Path `id` |
| **`POST`**| `/api/v1/workers/me/certifications/`| Worker | Add trade certification | `title`, `issuing_body`, `issue_date`, `credential_id` |
| **`DELETE`**| `/api/v1/workers/me/certifications/<id>/`| Worker | Delete trade certification | Path `id` |
| **`POST`**| `/api/v1/workers/me/proof-of-work/`| Worker | Add photo proof of work | `title`, `description`, `category`, `images`, `skills_demonstrated` |
| **`DELETE`**| `/api/v1/workers/me/proof-of-work/<id>/`| Worker | Delete proof of work | Path `id` |

---

## 4. Job Management & Discovery APIs (`/api/v1/jobs/` & `/api/v1/employer/jobs/`)

| Method | Endpoint | Allowed Roles | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- | :--- |
| **`GET`** | `/api/v1/jobs/` | Public | Multi-parameter job discovery | `search`, `location`, `minimum_salary`, `maximum_salary`, `experience`, `job_type`, `shift`, `skills`, `status`, `ordering` |
| **`GET`** | `/api/v1/jobs/<id>/` | Public | Full job specs, perks, commute details | Path `id` |
| **`POST`**| `/api/v1/jobs/<id>/save/` | Worker | Bookmark job opening | Path `id` |
| **`DELETE`**| `/api/v1/jobs/<id>/save/` | Worker | Remove bookmarked job | Path `id` |
| **`GET`** | `/api/v1/employer/jobs/` | Employer | List jobs posted by authenticated employer | `status` (`active`, `paused`, `closed`) |
| **`POST`**| `/api/v1/employer/jobs/` | Employer | Post a new plant job vacancy | `title`, `trade_category`, `salary_min`, `salary_max`, `job_type`, `shift`, `openings`, `required_skills` |
| **`PATCH`**| `/api/v1/employer/jobs/<id>/` | Employer | Update job opening specifications | Partial update payload |
| **`DELETE`**| `/api/v1/employer/jobs/<id>/` | Employer | Close / deactivate job opening | Path `id` |

---

## 5. Applications & 7-Stage Pipeline APIs (`/api/v1/applications/`)

| Method | Endpoint | Allowed Roles | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- | :--- |
| **`POST`**| `/api/v1/jobs/<id>/apply/` | Worker | Submit application for job opening | Path `job_id`, `trade_test_agreed` |
| **`GET`** | `/api/v1/applications/my/` | Worker | List authenticated worker's applications | None |
| **`GET`** | `/api/v1/applications/employer/` | Employer | List applicant pipeline with stage filters | `job_id`, `stage` (`Applied`, `Screening`, `Shortlisted`, `Interview`, `Selected`, `Hired`, `Rejected`) |
| **`PATCH`**| `/api/v1/applications/<id>/stage/`| Employer | Advance application stage | `stage`, `note`, `rejection_reason` |
| **`POST`**| `/api/v1/applications/<id>/schedule-interview/` | Employer | Schedule trade test or plant assessment | `date`, `time`, `interview_type`, `location_or_link`, `instructions` |
| **`POST`**| `/api/v1/applications/<id>/review-worker/` | Employer | Submit performance rating (Selected/Hired) | `rating`, `skill_rating`, `reliability_rating`, `comment` |

---

## 6. Interview Management APIs (`/api/v1/interviews/`)

| Method | Endpoint | Allowed Roles | Description | Parameters / Body |
| :--- | :--- | :--- | :--- | :--- |
| **`GET`** | `/api/v1/interviews/` | Authenticated | List user's scheduled assessments | None |
| **`GET`** | `/api/v1/interviews/<id>/` | Authenticated | Retrieve interview assessment details | Path `id` |
| **`POST`**| `/api/v1/interviews/<id>/cancel/` | Employer | Cancel scheduled interview | `reason` |
| **`POST`**| `/api/v1/interviews/<id>/complete/`| Employer | Complete interview and log trade feedback | `feedback`, `rating` |

---

## 7. Document Verification Workflow APIs (`/api/v1/verification/` & `/api/v1/admin/verifications/`)

| Method | Endpoint | Allowed Roles | Description | Parameters / Body |
| :--- | :--- | :--- | :--- | :--- |
| **`POST`**| `/api/v1/verification/submit/` | Worker | Upload identity or trade credential | `doc_type` (`IDENTITY`, `CERTIFICATE`, `TRADE_LICENSE`, `OTHER`), `doc_number`, `file_url` |
| **`GET`** | `/api/v1/verification/my-documents/` | Worker | List worker submitted documents & states | None |
| **`GET`** | `/api/v1/admin/verifications/` | Admin | Admin document moderation queue | `status` (`PENDING`, `APPROVED`, `REJECTED`) |
| **`POST`**| `/api/v1/admin/verifications/<id>/approve/` | Admin | Approve document (+ Trust Score points) | Path `id` |
| **`POST`**| `/api/v1/admin/verifications/<id>/reject/` | Admin | Reject document with feedback note | `reason` |

---

## 8. Explainable Matching & Recommendation APIs (`/api/v1/matching/`)

| Method | Endpoint | Allowed Roles | Description | Parameters |
| :--- | :--- | :--- | :--- | :--- |
| **`GET`** | `/api/v1/jobs/recommended/` | Worker | Personalized job recommendations | None |
| **`GET`** | `/api/v1/employer/candidates/recommended/` | Employer | High-fit candidate recommendations for job | `job_id` |

---

## 9. Dashboard Aggregation & Analytics APIs (`/api/v1/dashboard/` & `/api/v1/analytics/`)

| Method | Endpoint | Allowed Roles | Description | Response Data |
| :--- | :--- | :--- | :--- | :--- |
| **`GET`** | `/api/v1/dashboard/worker/` | Worker | Single round-trip worker dashboard | Profile completeness, 100-pt trust breakdown, application counts, recommended jobs, upcoming trade tests, notifications |
| **`GET`** | `/api/v1/dashboard/employer/`| Employer | Single round-trip employer dashboard | Company profile, active job counts, 6-stage pipeline funnel, recent applications |
| **`GET`** | `/api/v1/employer/analytics/` | Employer | Recruitment pipeline funnel & KPIs | Cumulative funnel numbers, shortlist rate, interview rate, hiring rate, applications per job |

---

## 10. Platform Safety & Reporting APIs (`/api/v1/reports/` & `/api/v1/admin/reports/`)

| Method | Endpoint | Allowed Roles | Description | Parameters / Body |
| :--- | :--- | :--- | :--- | :--- |
| **`POST`**| `/api/v1/reports/` | Authenticated | File platform safety report | `reported_entity_type`, `reported_entity_name`, `report_type` (`FAKE_JOB`, `FAKE_CERTIFICATE`, `FRAUD`, `INAPPROPRIATE_CONTENT`, `OTHER`), `description` |
| **`GET`** | `/api/v1/admin/reports/` | Admin | Moderation report queue | `status` (`OPEN`, `UNDER_REVIEW`, `RESOLVED`, `DISMISSED`) |
| **`PATCH`**| `/api/v1/admin/reports/<id>/`| Admin | Update report status & resolution notes | `status`, `resolution_notes` |
