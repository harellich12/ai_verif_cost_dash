# GenAI Verification ROI Calculator

A sophisticated financial modeling tool designed to help CTOs and Engineering Managers evaluate the return on investment (ROI) of deploying AI coding agents versus traditional hiring for hardware verification tasks.

![Dashboard Preview](./screenshot.png) *(Note: Add a screenshot here if available)*

## 🚀 Features

- **Dual Compute Strategies**:
    - **Self-Hosted GPU**: Model rental ($3/hr) or purchase ($30k/card) with depreciation cycles.
    - **Cloud API**: Model per-token costs (Claude 3.5 Sonnet pricing) with **Split-Volume Logic** (Interactive vs. Regression).
- **Advanced API Modeling**:
    - Differentiates between **Interactive Jobs** (Engineer-driven, 20d/mo) and **Nightly Regressions** (CI/CD-driven, 30d/mo).
    - Accounts for **Agent Retries** (token multiplier) and "Waste" cost.
- **Dynamic Cash Flow Projections**: 12-month visual forecast of expenses vs. savings.
- **Scenario Planning**:
    - Adjust AI efficiency gains, GPU utilization, and bug reduction rates.
    - Compare **API vs. GPU** Break-Even points (Blended Volume).
- **Advanced Configuration**: Fine-tune **Depreciation Period** (12-60mo), **Electricity Costs**, and **Admin Overhead**.
- **Risk Analysis**: Quantify the financial impact of AI-driven bug reduction (avoiding silicon respins).
- **Executive Summary**: Auto-generated business recommendations based on model outputs.
- **Export Capabilities**:
    - **PDF Brief**: One-click confidential strategy report.
    - **Excel Snapshot**: "Safe Mode" export (.xlsx) with granular cost breakdowns and 100% data parity (no formulas).

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (Premium Dark Mode)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Export**: SheetJS (xlsx), jspdf (PDF)

## 📦 Installation & Setup

1. **Prerequisites**: Ensure you have Node.js (v18+) installed.
2. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd genai-verification-roi-calculator
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Open the app**: Navigate to `http://localhost:5173` in your browser.

## 📖 Usage Guide

### 1. Configure Inputs (Left Sidebar)
- **Compute Mode**: Choose **Self-Hosted** (GPU) or **Cloud API**.
    - If **Cloud API**: Configure `Interactive Jobs/Day`, `Regression Runs/Night`, and `Avg. Retries`.
    - If **Self-Hosted**: Configure `Number of GPUs` and `Depreciation Period`.
- **Resources**: Set the number of verification engineers.
- **Performance**: Adjust "AI Efficiency Gain" and "Bug Reduction Probability".
- **Advanced Settings**: (Collapsed by default)
    - Customize **Electricity Rate**, **Admin Overhead**, and **Storage/Egress**.
    - Adjust **Hardware Depreciation** (default 24 months).

### 2. Analyze Results
- **KPI Cards**: Review Net Savings, ROI %, Break-Even Month, and Risk Reduction Value.
- **Charts**: Visualize the "Cumulative Savings" vs. "Cumulative Cost" crossover.
- **API Comparison**: In Cloud API mode, see the **Break-Even Volume** where GPU becomes cheaper.
- **Executive Summary**: Read the strategic recommendation (e.g., "Switch to Self-Hosted if volume > 850 jobs/day").

### 3. Share & Export
- **Export PDF**: Click the file icon in the header for a professional "Confidential" brief.
- **Export Excel**: Download the full editable model for finance reviews.

## 📄 License
Private Property - IESE Business School / Project Owner.
