# KaushalConnect — End-to-End User Journeys & Workflow Diagrams

---

## 1. Worker Journey: From Onboarding to Industrial Employment

```mermaid
sequenceDiagram
    autonumber
    actor W as Blue-Collar Worker
    participant UI as Worker Portal (React)
    participant API as Django Backend API
    participant Mod as Admin Moderation
    actor E as Industrial Recruiter

    Note over W,UI: Phase 1: Identity & Profile Creation
    W->>UI: Registers with Phone / Email & selects Primary Trade
    UI->>API: POST /api/v1/auth/register/ (role='worker')
    API-->>UI: JWT Tokens Issued + Worker Profile Created
    W->>UI: Adds Trade Skills, Experience & Photo Proof of Work
    UI->>API: POST /api/v1/workers/me/proof-of-work/

    Note over W,Mod: Phase 2: Credential Verification & Trust Boost
    W->>UI: Uploads NCVT Diploma / Aadhaar eKYC scan
    UI->>API: POST /api/v1/verification/submit/
    Mod->>API: POST /api/v1/admin/verifications/{id}/approve/
    API->>API: Recalculates Trust Score (e.g. 94/100)

    Note over W,E: Phase 3: Job Discovery & Application
    W->>UI: Searches Electrician Jobs in Vijayawada with > ₹25,000 salary
    UI->>API: GET /api/v1/jobs/?trade=Electrical&min_salary=25000
    UI->>UI: Displays Match Score (91%) with Strengths & Gaps
    W->>UI: Clicks "Apply to Job"
    UI->>API: POST /api/v1/jobs/{id}/apply/
    API-->>E: Notification: "New High-Fit Verified Applicant"

    Note over W,E: Phase 4: Assessment, Selection & Review
    E->>API: POST /api/v1/applications/{id}/schedule-interview/ (Trade Test)
    API-->>W: Notification: "Trade Test Scheduled at Autonagar Substation"
    W->>E: Attends Practical Trade Test at Plant
    E->>API: PATCH /api/v1/applications/{id}/stage/ (stage='Hired')
    E->>API: POST /api/v1/applications/{id}/review-worker/ (5.0★ Review)
    API->>API: Updates Worker Trust Score with Supervisor Feedback
```

---

## 2. Employer Journey: Industrial Talent Acquisition & Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor E as Industrial Recruiter / Plant HR
    participant UI as Employer Portal (React)
    participant API as Django Backend API
    actor W as Verified Technician

    Note over E,UI: 1. Enterprise Onboarding & Job Creation
    E->>UI: Registers Enterprise Account (GSTIN & Company Details)
    UI->>API: POST /api/v1/auth/register/ (role='employer')
    E->>UI: Posts Vacancy: "6G TIG Pipeline Welder (4 Openings, ₹28K-₹36K)"
    UI->>API: POST /api/v1/employer/jobs/
    API-->>UI: Vacancy Activated with Dynamic Compatibility Rules

    Note over E,UI: 2. Active Candidate Sourcing & Shortlisting
    E->>UI: Discovers Candidates filtered by Trust Score > 80 & 6G TIG Skill
    UI->>API: GET /api/v1/workers/?skill=6G+TIG&minimum_trust_score=80
    UI->>UI: Shows Candidates with Photo Proofs of Boiler Welds
    E->>UI: Bookmarks Top Candidates & Reviews Direct Applicants

    Note over E,W: 3. Pipeline Governance & Trade Assessment
    E->>UI: Advances Candidate: Applied -> Screening -> Shortlisted
    UI->>API: PATCH /api/v1/applications/{id}/stage/
    E->>UI: Schedules On-Site Welding Test (Coupon Radiography)
    UI->>API: POST /api/v1/applications/{id}/schedule-interview/
    API-->>W: In-App Alert with Plant Address & Safety Instructions
    E->>UI: Logs Test Feedback: "100% Radiographic Pass - Approved"
    UI->>API: POST /api/v1/interviews/{id}/complete/
    E->>UI: Marks Candidate as 'Selected' & issues Offer
```

---

## 3. Explainable AI Matching & Recommendation Flow

```mermaid
flowchart TD
    Start[Worker Requests Recommended Jobs] --> FetchWorker[Load Worker Profile: Skills, Certs, Exp, City]
    FetchWorker --> FetchJobs[Load All Active Job Vacancies]
    
    subgraph Scoring Loop per Job
        CalculateSkills[Skills Fit: 40% Required + 10% Preferred]
        CalculateExp[Experience Fit: Compares Verified Tenure]
        CalculateLoc[Location Proximity: City & Radius Matching]
        CalculateCerts[Certification Fit: Verified Trade Diplomas]
        CalculateAvail[Availability Fit: Immediate vs Notice Period]
        
        CalculateSkills --> SumScore[Sum Total Compatibility: 0 - 100%]
        CalculateExp --> SumScore
        CalculateLoc --> SumScore
        CalculateCerts --> SumScore
        CalculateAvail --> SumScore
        
        SumScore --> GenerateStrengths[Generate Human-Readable Strengths List]
        SumScore --> GenerateGaps[Generate Missing Skills & Gap List]
    end
    
    FetchJobs --> ScoringLoop[Scoring Loop]
    ScoringLoop --> RankJobs[Rank Jobs in Descending Match Order]
    RankJobs --> Output[Return Top Recommendations with Diagnostic Breakdown]
```

---

## 4. Admin Verification & Platform Moderation Flow

```mermaid
flowchart LR
    A[Worker Submits Aadhaar / ITI Diploma] --> B[VerificationDocument Model: Status = PENDING]
    B --> C[Admin Moderation Queue /api/v1/admin/verifications/]
    C --> D{Admin Review Decision}
    
    D -->|Valid & Clear| E[Approve Document]
    E --> F[Update Document Status = APPROVED]
    F --> G[Auto Recalculate Worker Trust Score +10-20 pts]
    G --> H[Send Notification: 'Document Approved']

    D -->|Blurry / Fake / Invalid| I[Reject Document with Feedback Reason]
    I --> J[Update Document Status = REJECTED]
    J --> K[Send Notification: 'Please Re-upload Clear Image']
```
