# User Manual: GenAI Verification ROI & VaaS Estimator

## 1. Purpose
This tool helps technical and business teams evaluate two paths:
- **ROI mode**: Build/use AI verification capability internally (self-hosted GPUs or cloud API).
- **VaaS mode**: Outsource verification to a fixed-price Verification-as-a-Service engagement.

Use this model for planning, prioritization, and client discussions. It is not a replacement for formal finance/accounting sign-off.

## 2. App Modes

### ROI mode
Focus: annual economics of AI-assisted verification.

### VaaS mode
Focus: timeline acceleration, capacity impact, and net economic value of VaaS vs internal execution.

### Admin vs Presentation (global)
The header includes a second toggle:
- **Admin**: full control and configuration visibility.
- **Presentation**: client-facing view based on your saved filters.

Presentation filters are configured from **Presentation Setup** (Admin only) and persisted in local storage.

## 3. Navigation and Controls
- **Header toggles**:
  - `ROI / VaaS`
  - `Admin / Presentation`
- **Presentation Setup**:
  - Select which sections are visible in Presentation mode.
  - Configure visibility for sidebar sections, KPI cards, and charts.
  - Use **Preview as Client** to switch directly into Presentation mode.
  - Use **Reset Presentation Filters** to restore defaults.
- **User Manual button**: opens in-app reference.
- **Export buttons**: generate PDF and Excel snapshots.

## 4. ROI Mode

### 4.1 Key Inputs
- **Verification Engineers**: team size impacted by AI assistance.
- **Compute Mode**:
  - **Self-Hosted**: infra cost path based on GPUs/deployment assumptions.
  - **Cloud API**: token-based cost path using jobs/runs/retries.
- **AI Efficiency Gain (%)**: proportion of debug effort improved by AI.
- **GPU Utilization (%)**: affects cloud-rental style compute economics.
- **Bug Escape Probability / Bug Reduction**: risk-value estimation inputs.
- **Advanced**:
  - Electricity rate
  - IT admin overhead
  - Storage/egress
  - Depreciation months

Tooltips (`?`) next to sliders explain each assumption.

### 4.2 ROI Outputs
- **Net Annual Savings**
- **ROI %**
- **Break-even Month**
- **Risk Reduction Value**
- **Compute Path Comparison**:
  - monthly API vs self-hosted baseline
  - crossover interactive volume
  - recommendation signal
- **Result chart**: cumulative 12-month cash-flow behavior.
- **Executive summary**: auto-generated narrative for business communication.

### 4.3 Interpreting ROI Safely
- A positive ROI is only as reliable as efficiency and workload assumptions.
- Validate with pilot data where possible (jobs/day, retries, utilization).
- Treat crossover points as directional unless calibrated from production telemetry.

## 5. VaaS Mode

### 5.1 Key Inputs
- **Block Type / Complexity**: baseline internal duration.
- **Internal Team Size**
- **Internal Hiring Lag (months)**
- **Estimated RTL Delay (weeks)**
  - Modeled as **mutually exclusive** with hiring lag.
  - If hiring lag > 0, RTL delay cost is not stacked.
- **VaaS Quote Price**
- **Annual Block Count**
- **Parallel Blocks**: adjusts annual calendar time-saved projection.
- **Market Upside ($/month)**: optional business upside from faster delivery.
- **Benchmark Validator (optional)**:
  - Replace default speedup with measured internal vs VaaS benchmark days.

Tooltips (`?`) are available for sliders and key value fields.

### 5.2 VaaS Outputs
- **Months Saved / Weeks Saved**
- **Capacity Unlocked (FTE-months)**
- **Cash Burn Prevented**
- **Business Upside per Block**
- **Net Benefit per Block**
- **Annual projections**:
  - total efficiency impact
  - parallelism-adjusted calendar time saved
  - annual net benefit
- **Timeline and cost charts** for internal vs VaaS progression.

### 5.3 VaaS Economics Logic (high level)
- `monthsSaved = (internal duration + hiring lag) - vaas duration`
- `businessUpsidePerBlock = monthsSaved * marketUpsidePerMonth`
- `netBenefitPerBlock = (internalTeamCost + idleCashSaved + businessUpsidePerBlock) - vaasQuotePrice`
- `projectedAnnualNetBenefit = netBenefitPerBlock * annualBlockCount`

Use `Market Upside = 0` for a strictly cost/capacity-only view.

## 6. Exports

### PDF Export
- Produces a paginated report of current dashboard state.

### Excel Export
- **ROI workbook**:
  - `Parameters`
  - `Summary`
  - `Cash Flow`
- **VaaS workbook**:
  - quote summary
  - schedule sheet
- All exports are **snapshot/value-only** (no live formulas).

## 7. Presentation Mode Workflow
1. Stay in **Admin** mode.
2. Open **Presentation Setup**.
3. Enable only the sections you want clients to see.
4. Click **Preview as Client**.
5. Present in **Presentation** mode (remaining controls stay interactive).
6. Return to **Admin** to adjust filters.

## 8. Calibration Recommendations
- Run sensitivity scenarios (low/base/high) for critical assumptions.
- For ROI:
  - calibrate retries and job volumes from logs.
  - validate utilization by actual cluster behavior.
- For VaaS:
  - calibrate with at least one benchmark project.
  - keep Market Upside explicit and defensible.

## 9. Troubleshooting
- If values look unrealistic, verify units (`/day`, `/night`, `%`, `$ / month`).
- If Presentation mode looks wrong, use **Reset Presentation Filters**.
- If exports differ from expectation, confirm active mode (ROI vs VaaS) and current inputs.
- If browser state feels stale, hard refresh and re-open setup.

## 10. Scope and Limits
- This is a planning estimator, not legal/accounting/GAAP guidance.
- Outputs depend strongly on assumption quality.
- Final decisions should combine this model with pilot evidence and finance review.

## 11. Reference Files
- ROI assumptions and formulas: `src/constants.ts`, `src/hooks/useROICalculator.ts`
- VaaS assumptions and formulas: `src/vaasConstants.ts`, `src/hooks/useVaaSEstimator.ts`
- Presentation mode logic: `src/App.tsx`
