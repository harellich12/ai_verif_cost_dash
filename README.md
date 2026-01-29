# GenAI Verification ROI Calculator

A sophisticated financial modeling tool designed to help CTOs and Engineering Managers evaluate the return on investment (ROI) of deploying AI coding agents versus traditional hiring for hardware verification tasks.

![Dashboard Preview](./screenshot.png) *(Note: Add a screenshot here if available)*

## 🚀 Features

- **Interactive Financial Modeling**: Real-time calculation of ROI, Net Present Value (NPV), and Break-Even analysis.
- **Dynamic Cash Flow Projections**: 12-month visual forecast of expenses vs. savings.
- **Scenario Planning**:
    - Compare **Cloud Rental** ($3/hr) vs. **On-Premise Purchase** ($30k/card) for H100 GPUs.
    - Adjust AI efficiency gains, GPU utilization, and bug reduction rates.
- **Risk Analysis**: Quantify the financial impact of AI-driven bug reduction (avoiding silicon respins).
- **Executive Summary**: Auto-generated business recommendations based on model outputs.
- **Excel Export**: Download a fully interactive `.xlsx` model with **live formulas** for offline presentation and further customization.

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (Premium Dark Mode)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Export**: SheetJS (xlsx) for formula-based Excel generation

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
- **Deployment Mode**: Toggle between "Rental" (OpEx) and "Purchase" (CapEx) models.

### 2. Analyze Results
- **KPI Cards**: Review Net Savings, ROI %, Break-Even Month, and Risk Reduction Value.
- **Charts**: Visualize the "Cumulative Savings" vs. "Cumulative Cost" crossover point.
- **Executive Summary**: Read the generated strategic recommendation at the bottom.

### 3. Export Report
- Click the **"Export Model (.xlsx)"** button in the header.
- This downloads a spreadsheet where **formulas are preserved**, allowing you to tweak assumptions in Excel and see results update instantly.

## 📄 License
Private Property - IESE Business School / Project Owner.
