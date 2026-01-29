---
description: Context and guardrails for the project
---

# PRODUCT CONTEXT: GenAI Verification ROI Calculator

## 1. Product Goal
Build an interactive "Cost vs. Benefit" calculator to help CTOs decide between:
A. Hiring more Verification Engineers (Manual Human Labor).
B. Deploying a Private AI Coding Agent on H100 GPUs (Automated Labor).

## 2. Tech Stack Requirements
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS (Dark Mode by default: Slate/Zinc palette)
* **Charts:** Recharts (ResponsiveContainer)
* **Icons:** Lucide-React
* **Excel Export:** `xlsx` (SheetJS) - Client-side generation.
* **State Management:** Local React State (No backend).

## 3. Financial Constants (The "Truth")
* **H100 GPU Cost (Rental):** $3.00 / hour.
* **H100 GPU Cost (Purchase):** $30,000 / card + $10,000 chassis overhead.
* **Engineer Salary:** $200,000 / year (Fully loaded).
* **EDA License Cost:** $25,000 / year / engineer.
* **Silicon Respin Cost:** $5,000,000.
* **Debug Time Ratio:** 50% (Engineers spend half their time debugging).

## 4. The Math Model
Calculated outputs required:
1.  **OpEx Delta:** (Cost of Cloud GPUs) vs. (Value of Engineering Hours Saved).
2.  **Break-Even Point:** Month index where `Cumulative_Savings > Cumulative_Cost`.
3.  **Risk Adjusted Value:** `Probability_of_Bug` * `Respin_Cost`.

## 5. UI Layout Strategy
* **Sidebar:** Inputs.
* **Main View:** KPI Cards (Top), Line Chart (Middle), Executive Summary (Bottom).
* **Header Actions:** "Reset Defaults" and **"Export Model (.xlsx)"** button.

## 6. Excel Export Schema (New Requirement)
The exported file must contain two sheets:
* **Sheet 1 (Summary):** A static table of the Inputs and the final KPI results (Net Savings, ROI %).
* **Sheet 2 (Cash Flow):** A 12-month row-by-row breakdown:
    * Columns: Month, GPU Cost, Engineer Cost (Baseline), Engineer Cost (with AI), Net Savings, Cumulative Savings.

## 7. Advanced Logic Requirements (V2 Features)
* **Hybrid Mode:** User can split workload (e.g., 80% On-Prem, 20% Cloud Burst).
* **CapEx Depreciation:** For On-Prem hardware, assume a 3-year useful life.
    * *Formula:* Monthly Credit = (Total Hardware Cost / 36) * 0.21 (Corporate Tax Rate).
* **Power & Cooling:**
    * *Formula:* GPU Power (700W) * PUE (1.5) * Hours * $/kWh ($0.12).
* **Utilization Rate:** Cloud costs scale linearly with usage. On-Prem costs are fixed regardless of usage.
    * *Logic:* If 'Cloud' is selected, multiply cost by `Utilization %`. If 'On-Prem', cost is flat 100%.