# Patient Journey (Inpatient Workflow) - Implementation Plan

## Scope Summary
Build a comprehensive Inpatient Management System (IPD) covering the full patient lifecycle from registration to discharge/mortuary, including ward management, investigations, treatment, and financial reporting. The system will feature role-based access control and seamless IPD/OPD integration.

**Non-Goals:**
- Real-time printer driver integration (will simulate "Print" via browser print/PDF).
- Real-world MOH API integrations (will simulate data formats and transmission).
- Real-time hardware vital monitoring (manual entry only).

## Affected Areas
- **Frontend:** New dashboard layout with role-based navigation, specialized modules for Registration, Admission, Ward, Lab, Pharmacy, Finance, and Mortuary.
- **State Management:** Complex client-side state for the "Live Census Board" and cross-module "Diagnostic Loop Back".
- **Logic:** Age calculation from DOB, ICD-10/11 linking, billing reconciliation logic, and audit logging.

## Assumptions & Open Questions
- **Assumption:** Since no Supabase is available, all data persistence will be handled via `localStorage` for the duration of the session.
- **Assumption:** "MOH Forms" (302, 214, 102, GP 138A) will be implemented as stylized UI templates/modals.
- **Question:** Are there specific UI preferences for the "Live Census Board" (e.g., floor plan vs. grid list)? (Defaulting to a visual grid).

## Ordered Phases

### Phase 1: Core Framework & RBAC
- Setup routing for different roles (Director, Doctor, Nurse, Technologist, Finance).
- Implement a global `AuthContext` to simulate role-switching and session management.
- Create the main dashboard layout with a sidebar that adapts to the current role.
- **Deliverable:** Functional navigation framework and role-switcher.
- **Owner:** `frontend_engineer`

### Phase 2: Registration & Admission
- Build the Registration form with DOB age auto-calculation.
- Implement Guardian requirement logic for children.
- Create the Admission module with bed/ward allocation and ICD-10/11 search (mock data).
- **Deliverable:** Working registration/admission flow and hospital ID generation.
- **Owner:** `frontend_engineer`

### Phase 3: Ward Management & Clinical Workflow
- Develop the "Live Census Board" showing bed occupancy.
- Build Ward Management views: Nurses (Vitals/Notes), Doctors (Treatment Plans).
- Implement Vital details flagging logic (e.g., highlighting abnormal ranges).
- **Deliverable:** Interactive census board and clinical documentation forms.
- **Owner:** `frontend_engineer`

### Phase 4: Investigations & Treatment
- Create the Central Hub for Lab/Radiology orders.
- Implement the "Diagnostic Loop Back" (simulating result entry and notification to doctors).
- Build the Pharmacy module: prescription list, dispensing with audit timestamps.
- **Deliverable:** Integrated diagnostic and pharmacy workflow.
- **Owner:** `frontend_engineer`

### Phase 5: Finance & Billing
- Develop the Revenue Ledger for real-time billing updates.
- Create the Chart of Accounts for service/tariff classification.
- Implement Financial Reporting (Daily/Weekly/Monthly) using visual charts.
- **Deliverable:** Complete billing lifecycle and financial dashboard.
- **Owner:** `frontend_engineer`

### Phase 6: Discharge, Mortuary & Audit
- Build the Discharge module (MOH Form 102) with clearance checks.
- Implement the Mortuary Integration (Mortality Register, Form GP 138A).
- Create the Audit Log tab to track system access/changes.
- **Deliverable:** End-of-journey workflows and system-wide audit logs.
- **Owner:** `frontend_engineer`

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Builds the entire frontend application and logic layers.

**Per-agent instructions:**
### 1. frontend_engineer
- **Phases:** 1-6
- **Scope:** Create a multi-module SPA for hospital management. Use `localStorage` for data persistence. Ensure all MOH forms are rendered as printable UI components. Implement the role-based dashboard first.
- **Files:**
  - `src/App.tsx` (Routing & Layout)
  - `src/components/` (Shared UI like BedGrid, FormTemplates)
  - `src/modules/` (Registration, Admission, Ward, Investigations, Finance, Mortuary)
  - `src/hooks/` (useHospitalData, useAuth)
- **Depends on:** none
- **Acceptance criteria:** 
  - Role-switching updates the UI menus.
  - Registration calculates age and enforces guardian rules.
  - Vitals flag abnormal values.
  - Lab results appear in the doctor's consultation view (Loop Back).
  - Billing updates automatically when procedures/meds are logged.
  - Audit log tracks navigation and actions.

**Do not dispatch:**
- supabase_engineer (No database access available in this session)
- quick_fix_engineer (Not needed for initial build)
