# How-To Guide: GenAI Verification ROI Calculator (V4)

## 1. Getting Started

This tool helps technical leaders decide between **building** their own AI infrastructure (Self-Hosted H100s) or **renting** via simplified APIs (Cloud API).

### The Core Question
> *"At what volume of daily verification jobs does it become cheaper to own GPUs rather than pay per token?"*

---

## 2. Choosing a Compute Mode

The calculator has two distinct modes, selected at the top of the **Control Panel**:

### Mode A: Self-Hosted GPU ⚡
Use this when you plan to rent or buy H100 clusters.
*   **Key Inputs:**
    *   **Number of H100 GPUs**: Your hardware fleet size.
    *   **Depreciation Period**: (Advanced) How fast you write off the hardware (default: 24 months).
    *   **Electricity/Admin**: Additional overheads.

### Mode B: Cloud API ☁️
Use this when you use an LLM provider (e.g., Claude 3.5 Sonnet).
*   **Key Inputs:**
    *   **Interactive Jobs/Day**: Jobs triggered manually by engineers (calculated ×20 days/mo).
    *   **Regression Runs/Night**: Nightly CI/CD pipelines (calculated ×30 days/mo).
    *   **Avg. Agent Retries**: How often the agent loops to fix code. This acts as a **Token Multiplier** (e.g., 2 retries = 3x token cost).

---

## 3. Understanding the Math (V4 Logic)

### Split Volume Calculation
We don't just multiply "daily jobs" by 30. We respect the nature of the work:
*   **Interactive Work**: `Jobs × Engineers × 20 Business Days`
*   **Regression Work**: `Runs × 30 Calendar Days`

### The "Retry" Multiplier
Agentic workflows are iterative.
*   **Formula**: `Total Cost = Base Cost × (1 + Retries)`
*   **Insight**: If you set Retries to 0, you simulate a "Zero-Shot" perfect model. If you set it to 5, you simulate a struggling agent that burns tokens.
    *   *Tip: High retries drastically inflate Cloud API costs but have zero marginal cost on owned GPUs (until you run out of capacity).*

### Break-Even Volume (Blended)
In Cloud API mode, the chart shows a "Break-Even Volume".
*   This is the number of **daily jobs** where the monthly API bill equals the monthly cost of owning the equivalent GPU power.
*   If your volume is **higher** than this number, you should switch to Self-Hosted.

---

## 4. Exporting Data (Safe Mode)

We use a **Snapshot Strategy** for Excel exports to ensure financial integrity.

### What is "Safe Mode"?
*   The `.xlsx` file contains **values**, not formulas.
*   **Why?** This guarantees that the Excel file perfectly matches the web dashboard at the moment of export. There is zero risk of an Excel formula breaking or diverging from the app's logic.

### The Excel Structure
1.  **Parameters Sheet**: A complete audit trail of every input assumption (e.g., "Retries = 2", "Depreciation = 24mo").
2.  **Summary Sheet**: The high-level KPIs and the **Granular Cost Breakdown**:
    *   `↳ Interactive Cost (OpEx)`
    *   `↳ Regression Cost (Infra)`
    *   `↳ Retry Overhead (Waste)`
3.  **Cash Flow Sheet**: 12-month projections.

---

## 5. Troubleshooting / FAQs

**Q: Why doesn't the "Hardware Cost" change when I increase utilization?**
A: Owned hardware is a **Fixed Cost**. You pay for the H100s whether you use them 10% or 100%.

**Q: Why is "Retry Overhead" labeled as waste?**
A: It represents the cost of the agent failing to get it right the first time. In a perfect world, this would be zero.

**Q: How do I adjust the hardware lifecycle?**
A: Go to **Advanced Settings** > **Depreciation Period**. We default to 24 months because H100s become obsolete quickly.
