---
description: 
---

# PRODUCT CONTEXT: VaaS (Verification as a Service) Quote Estimator
## 1. Product Goal
Build a Quote & Timeline Estimator to prove that the "Triple Crown Flow" (Human-in-the-Loop AI) is **50% faster** and **more cost-efficient** than traditional internal verification teams.
**Key Pitch:** "Eliminate Fixed Cost Risk and Launch Early."

## 2. Tech Stack (Unchanged)
* React (Vite) + Tailwind CSS (Enterprise Dark Mode)
* Recharts (for Utilization/Gantt charts)
* Lucide React (Icons)
* `xlsx` (SheetJS) for Quote Export

## 3. Service Constants (The "New Truth")
* [cite_start]**Speedup Factor:** 50% (The VaaS flow cuts duration in half)[cite: 7, 96].
* [cite_start]**Traditional Duration Baseline:** 	
    * Small Block: 4 Months
    * [cite_start]Medium Block: 7 Months[cite: 33].
    * Large Block: 12 Months
* **Cost Model:**
    * [cite_start]**Internal Team:** 100% Fixed Cost (Salaries paid even during idle/wait time)[cite: 118].
    * [cite_start]**VaaS Team:** Variable Cost (Pay only for active execution; No minimums)[cite: 118].
* **Cloud Infrastructure:**
    * [cite_start]**Compute:** Standard VM (8-core CPU, 32GB RAM) - No H100s required[cite: 141, 142].
    * [cite_start]**LLM Ops:** Azure OpenAI / AWS Anthropic (Pass-through cost or included)[cite: 149, 150].

## 4. The Math Model
* **Time-to-Revenue:**
    * `Weeks_Saved` = `Traditional_Timeline` - `VaaS_Timeline` (where VaaS is 50% of Traditional).
    * `Revenue_Impact` = `Weeks_Saved` * `Weekly_Revenue_Value`.
* **Utilization / Idle Tax:**
    * `Internal_Cost` = `Team_Size` * `Salary` * `Duration` (Includes Idle Time).
    * `VaaS_Cost` = `Quote_Price` (Fixed scope, no idle billing).

## 5. UI Layout Strategy
* **Sidebar:** "Project Scoper" (Block Complexity, Team Size, Revenue Value).
* **Main View:**
    * **Top Row:** Big Metrics ("Months Saved", "Revenue Gained", "Idle Cash Saved").
    * **Middle Row:**
        * Left: **Utilization Chart** (Stacked Bar: Active vs. Idle Cost).
        * Right: **Timeline Comparison** (Gantt: Traditional vs. VaaS).
    * **Bottom Row:** "Security Scorecard" (Compliance Toggles)  + "Benchmark Extrapolator".

## 6. Excel Export Schema
* **Sheet 1 (Quote Summary):** Breakdown of Block Size, Est. Duration, and Net Savings.
* **Sheet 2 (Timeline):** Week-by-week comparison of milestones.