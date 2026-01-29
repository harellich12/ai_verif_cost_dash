# User Manual: GenAI Verification ROI Calculator

## 1. Introduction
This tool is designed to provide a data-driven answer to the question: *"Should we hire more verification engineers or invest in AI infrastructure?"* It models the complex trade-offs between capital expenditure (GPUs), operational expenditure (Cloud/Salaries), and productivity gains.

---

## 2. The Financial Model

### Core Assumptions (The "Truth")
The model is built on fixed industry-standard constants:
- **H100 GPU Rental**: $3.00 / hour
- **H100 GPU Purchase**: $30,000 / card + $10,000 chassis overhead per cluster
- **Engineer Cost**: $200,000 salary + $25,000 EDA license per year
- **Silicon Respin Cost**: $5,000,000 (Cost of a critical bug escaping to production)
- **Debug Time**: Engineers spend 50% of their time debugging.

### How ROI is Calculated
1. **Cost of AI**:
   - **Rental**: `GPUs × $3/hr × 730 hrs/month × Utilization %`
   - **Purchase**: `(GPUs × $30k + $10k) / 36 months` (Amortized over 3 years)
   - **Hybrid**: Mix of On-Prem (baseload) and Cloud (burst) based on your %.
   - **Tax Credit**: On-Prem costs can be reduced by 21% via the "Include Tax Depreciation" toggle.
2. **Value of AI**:
   - `Engineer Cost/Month × Total Engineers × 50% Debug Time × AI Efficiency Gain %`
   - *Example*: If 10 engineers cost $1.8M/yr, and AI makes debugging 30% faster, you save the equivalent of hiring ~1.5 more engineers.
3. **Net Savings**: `Value of AI - Cost of AI`

---

## 3. Input Guide

| Parameter | Recommended Range | Description |
|-----------|-------------------|-------------|
| **Verification Engineers** | 5 - 50 | Your current team size. More engineers = more potential time saved by AI. |
| **Number of H100 GPUs** | 1 - 32 | Number of GPUs dedicated to the inference/training of the agent. |
| **AI Efficiency Gain** | 10% - 50% | The % of debugging time the AI automates. Conservative estimate: 20-30%. |
| **GPU Utilization** | 30% - 80% | How efficiently you use the GPUs. 100% is unrealistic; 60% is typical. |
| **Bug Escape Probability** | 1% - 10% | Likelihood of a critical bug missing verification. |
| **Bug Reduction with AI** | 20% - 60% | How much the AI improves test coverage, reducing bug risks. |
| **Deployment Model** | Cloud / On-Prem / Hybrid | **Cloud** (OpEx), **On-Prem** (CapEx), or **Hybrid** (On-Prem baseload + Cloud burst). |
| **Advanced Settings** | *Collapsed by default* | Fine-tune **Electricity** ($0.12/kWh), **Admin Overhead** (15%), and **Storage** ($500/mo). |

---

## 4. Dashboard Features

### KPI Cards
- **Net Annual Savings**: The bottom-line impact. Green means the AI pays for itself and saves money.
- **ROI %**: Return on Investment. `(Savings - Cost) / Cost`.
- **Break-Even Point**: The month where your cumulative savings finally exceed your cumulative costs.
- **Risk Reduction**: The "Hidden Value". The dollar value of avoiding a $5M silicon respin.

### Charts
- **Red Line**: Cumulative Cost (GPU spend).
- **Green Line**: Cumulative Savings (Productivity gained).
- **Crossover Point**: Where the Green line crosses above the Red line is your Break-Even point.

### Executive Summary
The card at the bottom generates a text paragraph suitable for copying into an email or slide deck. It changes tone based on whether the investment is profitable or risky.

---

## 5. Export & Sharing
 
### PDF Brief
Click the **"Export PDF"** button (file icon) in the header to generate a "Confidential - Verification ROI Model" report. This single-page breakdown includes a snapshot of your current scenario and KPIs, ideal for email attachments or slide decks.

### Excel Export
Clicking **"Export Model (.xlsx)"** generates a sophisticated spreadsheet:
- **Sheet 1 (Summary)**: Contains the main assumptions and high-level KPIs.
- **Sheet 2 (Cash Flow)**: A detailed 12-month breakdown.
- **Features**: All cells use **LINKED FORMULAS**. You can give this Excel file to a Finance partner, and they can change the "Number of Engineers" in cell B6 to see everything update automatically, without needing the web app.
