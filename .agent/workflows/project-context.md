---
description: Context and guardrails for the project
---

# PRODUCT CONTEXT: GenAI Verification ROI + VaaS Estimator

## 1. Product Goal
Provide an interactive planning tool for technical and business stakeholders to evaluate:
1. ROI mode: AI-assisted verification economics (self-hosted GPUs vs cloud API)
2. VaaS mode: fixed-quote verification outsourcing economics and timeline

## 2. Modes and Views
- App modes: `ROI`, `VaaS`
- View modes:
  - `Admin`: full controls
  - `Presentation`: filtered client view
  - `Sales` (VaaS only): external/traditional verification cost framing

## 3. Tech Stack
- React + TypeScript + Vite
- Tailwind CSS
- Recharts
- Lucide React
- Exports: SheetJS (`xlsx`) + jsPDF/html2canvas

## 4. Key ROI Model Anchors
- H100 rental baseline: `$3/hr`
- Purchase baseline: `$30K/card`
- Engineer economics baseline (ROI): `$200K/yr salary + $25K/yr EDA license`
- API path includes interactive + regression split and retry multiplier
- KPI outputs include net savings, ROI %, break-even month, risk reduction

## 5. Key VaaS Model Anchors
- Default speedup factor: `0.5` (50% faster)
- Block durations: `small=4`, `medium=7`, `large=12` months
- Custom block duration supported (`customBlockDurationMonths`)
- Hiring lag and RTL delay are mutually exclusive in cost logic
- HITL review is applied to saved effort base

## 6. Sales View (VaaS-only) Contract
Sales mode reuses VaaS layout but remaps displayed economics to external/traditional cost basis:
- `salesExternalCostPerBlock = internalTeamCost + idleCashSaved`
- `salesExternalCostAnnual = salesExternalCostPerBlock * annualBlockCount`
- `salesDelayCostPerBlock = costOfRtlDelay`
- `salesIdleCostPerBlock = idleCashSaved`
- `salesActiveCostPerBlock = internalTeamCost`
- `salesMonthlyData`: external/active/idle/progress series

## 7. Presentation Config Persistence
- Current key: `presentation-mode-config-v2`
- Legacy key fallback: `presentation-mode-config-v1`
- `v1` values are hydrated into both VaaS `presentation` and `sales` visibility groups

## 8. Exports
- PDF export reflects current UI state
- VaaS Excel export branches by view mode:
  - `Admin/Presentation`: quote-centric workbook
  - `Sales`: external-cost-only workbook
