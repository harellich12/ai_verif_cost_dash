# GenAI Verification ROI Calculator

A sophisticated financial modeling tool designed to help CTOs and Engineering Managers evaluate the return on investment (ROI) of deploying AI coding agents versus traditional hiring for hardware verification tasks.

![Dashboard Preview](./screenshot.png) *(Note: Add a screenshot here if available)*

## 🚀 Features

- **Interactive Financial Modeling**: Real-time calculation of ROI, Net Present Value (NPV), and Break-Even analysis.
- **Dynamic Cash Flow Projections**: 12-month visual forecast of expenses vs. savings.
- **Scenario Planning**:
    - Compare **Cloud Rental** ($3/hr), **On-Premise Purchase** ($30k/card), or **Hybrid** strategies.
    - Adjust AI efficiency gains, GPU utilization, and bug reduction rates.
- **Advanced Configuration**: Fine-tune **Electricity Costs**, **Admin Overhead**, and **Storage/Egress Fees**.
- **Tax Implications**: Toggle **CapEx Depreciation Tax Credits** (21%) for On-Prem hardware.
- **Risk Analysis**: Quantify the financial impact of AI-driven bug reduction (avoiding silicon respins).
- **Executive Summary**: Auto-generated business recommendations based on model outputs.
- **Export Capabilities**:
    - **PDF Brief**: One-click confidential strategy report.
    - **Excel Model**: Fully interactive `.xlsx` with live formulas.

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
- **Team Scale**: Set current number of engineers and desired number of GPUs.
- **Performance**: Adjust "AI Efficiency Gain" (how much time AI saves per engineer) and "GPU Utilization".
- **Risk Profile**: Set baseline bug probability and how much AI reduces that risk.
- **Deployment Mode**: Choose **Cloud**, **On-Prem**, or **Hybrid**.
- **Advanced Settings**: (Collapsed by default)
    - Customize **Electricity Rate** ($/kWh).
    - Set **IT Admin Overhead** (%).
    - Add **Storage & Egress** costs.

### 2. Analyze Results
- **KPI Cards**: Review Net Savings, ROI %, Break-Even Month, and Risk Reduction Value.
- **Charts**: Visualize the "Cumulative Savings" vs. "Cumulative Cost" crossover point.
- **Executive Summary**: Read the generated strategic recommendation at the bottom.

### 3. Share & Export
- **Export PDF**: Click the file icon in the header for a professional "Confidential" brief.
- **Export Excel**: Download the full editable model for finance reviews.

## 📄 License
Private Property - IESE Business School / Project Owner.
