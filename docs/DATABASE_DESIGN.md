# KaushalConnect — Database Design & Schema Documentation

---

## 1. Database Overview & Technology

The KaushalConnect persistence layer is built on a **Relational Schema** managed through Django ORM migrations. It supports SQLite for local development and zero-configuration demonstration, and PostgreSQL (with `pgvector` compatibility) for production deployment.

The database consists of **16 normalized relational models** organized into domain clusters with explicit foreign key cascades, unique constraints, and composite query indexes.

---

## 2. Complete Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    User {
        int id PK
        string username
        string email
        string first_name
        string last_name
        string role
        string phone
        string location
        string avatar_url
        string language_preference
        boolean is_verified
        datetime created_at
        datetime updated_at
    }

    WorkerProfile {
        int id PK
        int user_id FK
        string full_name
        string primary_trade
        string tagline
        text bio
        string location
        string city
        string state
        int years_of_experience
        string availability
        int expected_salary_min
        int expected_salary_max
        string resume_url
        int trust_score_total
        int profile_strength_percent
        datetime created_at
        datetime updated_at
    }

    EmployerProfile {
        int id PK
        int user_id FK
        string company_name
        string trade_industry
        string tagline
        text description
        string gst_or_cin_number
        string location
        string city
        string state
        string logo_url
        boolean is_verified
        string verification_badge
        string employee_count
        string contact_person
        string contact_email
        string contact_phone
        datetime created_at
        datetime updated_at
    }

    Job {
        int id PK
        int employer_id FK
        string title
        string trade_category
        string location
        string city
        float distance_km
        int salary_min
        int salary_max
        string salary_period
        int experience_required_years
        string job_type
        string shift
        int openings
        string joining_date
        string deadline_date
        json required_skills
        json preferred_skills
        json required_certifications
        text description
        json benefits
        string work_address
        string status
        datetime created_at
        datetime updated_at
    }

    Application {
        int id PK
        int job_id FK
        int worker_id FK
        string current_stage
        int match_score
        float rating
        text notes
        string rejection_reason
        datetime created_at
        datetime updated_at
    }

    ApplicationTimelineEvent {
        int id PK
        int application_id FK
        string stage
        datetime timestamp
        text note
        boolean completed
    }

    Interview {
        int id PK
        int application_id FK
        string interview_type
        date date
        string time
        string location_or_link
        text instructions
        string status
        text feedback
        string interviewer_name
        datetime created_at
        datetime updated_at
    }

    WorkerSkill {
        int id PK
        int worker_id FK
        string skill_name
        string category
        int level
        int years_experience
        boolean is_verified
        string verification_source
        datetime created_at
    }

    Certification {
        int id PK
        int worker_id FK
        string title
        string issuing_body
        date issue_date
        date expiry_date
        string credential_id
        string certificate_url
        string verification_status
        datetime created_at
    }

    ProofOfWork {
        int id PK
        int worker_id FK
        string title
        text description
        string category
        json images
        json skills_demonstrated
        string client_or_employer
        string location
        date completion_date
        boolean is_verified
        string verified_by
        float rating
        datetime created_at
    }

    WorkExperience {
        int id PK
        int worker_id FK
        string company_name
        string designation
        string location
        date start_date
        date end_date
        boolean is_current
        text responsibilities
        boolean is_verified
        datetime created_at
    }

    SupervisorReview {
        int id PK
        int worker_id FK
        int reviewer_id FK
        int application_id FK
        string supervisor_name
        string company_name
        string trade_area
        float rating
        float skill_rating
        float reliability_rating
        text comment
        date review_date
        datetime created_at
    }

    SavedJob {
        int id PK
        int worker_id FK
        int job_id FK
        datetime created_at
    }

    SavedCandidate {
        int id PK
        int employer_id FK
        int worker_id FK
        datetime created_at
    }

    VerificationDocument {
        int id PK
        int worker_id FK
        string doc_type
        string doc_number
        string file_url
        string status
        text notes
        datetime submitted_at
        datetime reviewed_at
    }

    PlatformReport {
        int id PK
        int reporter_id FK
        string reporter_name
        string reported_entity_type
        int reported_entity_id
        string reported_entity_name
        string report_type
        text description
        string status
        text resolution_notes
        datetime created_at
        datetime updated_at
    }

    Notification {
        int id PK
        int user_id FK
        string title
        text message
        string notification_type
        string action_url
        int related_object_id
        boolean is_read
        datetime created_at
    }

    User ||--o| WorkerProfile : "1:1 profile"
    User ||--o| EmployerProfile : "1:1 profile"
    WorkerProfile ||--o{ WorkerSkill : "owns skills"
    WorkerProfile ||--o{ Certification : "holds certs"
    WorkerProfile ||--o{ ProofOfWork : "showcases works"
    WorkerProfile ||--o{ WorkExperience : "has experiences"
    WorkerProfile ||--o{ SupervisorReview : "receives reviews"
    EmployerProfile ||--o{ Job : "posts jobs"
    EmployerProfile ||--o{ SavedCandidate : "bookmarks talent"
    WorkerProfile ||--o{ SavedJob : "bookmarks openings"
    Job ||--o{ Application : "receives"
    WorkerProfile ||--o{ Application : "applies"
    Application ||--o{ ApplicationTimelineEvent : "has events"
    Application ||--o| Interview : "schedules 1:1"
    WorkerProfile ||--o{ VerificationDocument : "submits"
    User ||--o{ Notification : "receives"
    User ||--o{ PlatformReport : "files"
```

---

## 3. Core Database Entities & Field Specifications

### 3.1 `accounts.User` (Extends `AbstractUser`)
- **`role`**: `CharField` (`choices=['worker', 'employer', 'admin']`, `default='worker'`, indexed).
- **`phone`**: `CharField(max_length=20, blank=True)`.
- **`location`**: `CharField(max_length=255, blank=True)`.
- **`avatar_url`**: `URLField(max_length=500, blank=True)`.
- **`language_preference`**: `CharField(choices=['en', 'te', 'hi'], default='en')`.
- **`is_verified`**: `BooleanField(default=False, db_index=True)`.

---

### 3.2 `workers.WorkerProfile`
- **`user`**: `OneToOneField(User, on_delete=CASCADE, related_name='worker_profile')`.
- **`primary_trade`**: `CharField(max_length=100, db_index=True)` (e.g. Electrician, Welder, CNC Operator).
- **`years_of_experience`**: `PositiveIntegerField(default=0, db_index=True)`.
- **`availability`**: `CharField(choices=['available_now', 'within_15_days', 'within_1_month', 'not_available'])`.
- **`trust_score_total`**: `PositiveIntegerField(default=0, db_index=True)` (0 to 100 points).
- **`expected_salary_min` / `expected_salary_max`**: Monthly salary expectations in INR.

---

### 3.3 `jobs.Job`
- **`employer`**: `ForeignKey(EmployerProfile, on_delete=CASCADE, related_name='jobs')`.
- **`trade_category`**: `CharField(max_length=100, db_index=True)`.
- **`salary_min` / `salary_max`**: `PositiveIntegerField` with `salary_period='monthly'`.
- **`experience_required_years`**: `PositiveIntegerField(default=0, db_index=True)`.
- **`job_type`**: `CharField(choices=['Full-time', 'Part-time', 'Contract', 'Shift-based'])`.
- **`shift`**: `CharField(choices=['Day Shift', 'Night Shift', 'Rotational', 'Flexible'])`.
- **`required_skills` / `preferred_skills`**: `JSONField(default=list)`.
- **`status`**: `CharField(choices=['active', 'draft', 'paused', 'closed'], default='active', db_index=True)`.

---

### 3.4 `applications.Application`
- **`job`**: `ForeignKey(Job, on_delete=CASCADE, related_name='applications')`.
- **`worker`**: `ForeignKey(WorkerProfile, on_delete=CASCADE, related_name='applications')`.
- **`current_stage`**: `CharField(choices=['Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected', 'Hired', 'Rejected'], default='Applied', db_index=True)`.
- **`match_score`**: `PositiveIntegerField(default=0)` (Calculated explainable compatibility).
- **Constraint**: `unique_together = ['job', 'worker']` (Prevents duplicate applications).

---

## 4. Performance Indexes & Data Integrity Constraints

| Table | Index Name / Fields | Purpose |
| :--- | :--- | :--- |
| `jobs_job` | `[status, created_at]` | High-speed default catalog sorting |
| `jobs_job` | `[trade_category, city, status]` | Fast multi-field discovery queries |
| `jobs_job` | `[salary_min, salary_max]` | Fast salary range boundary filtering |
| `jobs_job` | `[job_type, shift]` | Fast shift/employment type filtering |
| `jobs_job` | `[experience_required_years]` | Fast experience threshold filtering |
| `workers_workerprofile` | `[primary_trade, city]` | Fast candidate geo-trade discovery |
| `workers_workerprofile` | `[trust_score_total, availability]` | High-trust available candidate search |
| `workers_workerprofile` | `[years_of_experience]` | Experience-based candidate filtering |
| `accounts_user` | `[role, is_verified]` | Fast authentication & permission check |
| `jobs_savedjob` | `unique_together = ['worker', 'job']` | Prevents duplicate bookmark records |
| `employers_savedcandidate` | `unique_together = ['employer', 'worker']` | Prevents duplicate saved candidate records |
| `applications_application` | `unique_together = ['job', 'worker']` | Restricts one application per worker/job |
| `workers_supervisorreview`| `unique_together = ['reviewer', 'worker', 'application']` | Restricts one verified review per hired application |
