# How-To Guide: GenAI Verification ROI Calculator (V4)

## 1. Getting Started

This tool helps technical leaders decide between **building** their own AI infrastructure (Self-Hosted H100s) or **renting** via simplified APIs (Cloud API).

Use the header toggle to choose:
- **ROI mode** for infrastructure economics
- **VaaS mode** for fixed-quote outsourcing comparisons

Use the view toggle to choose:
- **Admin** (full controls)
- **Presentation** (filtered client view)
- **Sales** (VaaS only; external/traditional cost framing)

### The Core Question
> *"At what volume of daily verification jobs does it become cheaper to own GPUs rather than pay per token?"*

---

## 2. Choosing a Compute Mode (ROI mode)

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

### Custom Block Size (VaaS)
You can select **Custom** in `Block Size` and enter manual months using `#`.
*   **Formula input**: `traditionalDurationMonths = customBlockDurationMonths` (when custom is selected)
*   This custom duration is used in timeline, cost, and export calculations.

---

## 4. Sales Presentation Mode (VaaS only)

Use Sales mode when presenting **client external verification costs regardless of VaaS quote**.

### What changes in Sales mode
*   Keeps the same VaaS page structure and section layout.
*   Remaps KPI and chart labels/values to **traditional/internal external cost** framing.
*   Hides VaaS quote-centric economics in sales-specific outputs.

### Core Sales Metrics
*   `External Cost / Block = internalTeamCost + idleCashSaved`
*   `External Cost / Year = External Cost / Block × annualBlockCount`
*   `Active Verification Cost = internalTeamCost`
*   `Idle Time Cost = idleCashSaved`
*   `Annual Idle Cost (workload card) = annualWorkloadHours × engineerHourlyRate × idleTimePercent`
    *(parallel-adjusted because annualWorkloadHours is divided by parallelBlocks in the card)*
*   `Delay Cost = costOfRtlDelay`

---

## 5. Exporting Data (Safe Mode)

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
4.  Values are exported as a snapshot; editing cells in Excel does not recalculate the model.
5.  In **Sales mode (VaaS)**, the workbook is sales-filtered:
    * Summary shows external/traditional costs.
    * Schedule focuses on traditional active + idle + external accrual.
    * VaaS quote/client-review/net-benefit rows are excluded.

---

## 6. Troubleshooting / FAQs

**Q: Why doesn't the "Hardware Cost" change when I increase utilization?**
A: Owned hardware is a **Fixed Cost**. You pay for the H100s whether you use them 10% or 100%.

**Q: Why is "Retry Overhead" labeled as waste?**
A: It represents the cost of the agent failing to get it right the first time. In a perfect world, this would be zero.

**Q: How do I adjust the hardware lifecycle?**
A: Go to **Advanced Settings** > **Depreciation Period**. We default to 24 months because H100s become obsolete quickly.
