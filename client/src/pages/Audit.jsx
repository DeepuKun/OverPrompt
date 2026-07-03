import React, { useState, useEffect } from "react";

// 1. Pricing Data (Source of Truth)
const PRICING_DATA = {
  Cursor: {
    Hobby: { price: 0, type: "individual", label: "Hobby ($0/mo)" },
    Pro: { price: 20, type: "individual", label: "Pro ($20/mo)" },
    "Pro+": { price: 60, type: "individual", label: "Pro+ ($60/mo)" },
    Ultra: { price: 200, type: "individual", label: "Ultra ($200/mo)" },
    Teams: { price: 40, type: "team", label: "Teams ($40/user/mo)" },
    Enterprise: { price: 60, type: "team", label: "Enterprise (Custom - Est. $60/user/mo)" }
  },
  "GitHub Copilot": {
    Free: { price: 0, type: "individual", label: "Free ($0/mo)" },
    Pro: { price: 10, type: "individual", label: "Pro ($10/mo)" },
    "Pro+": { price: 39, type: "individual", label: "Pro+ ($39/mo)" },
    Business: { price: 19, type: "team", label: "Business ($19/user/mo)" },
    Enterprise: { price: 39, type: "team", label: "Enterprise ($39/user/mo)" }
  },
  Claude: {
    Free: { price: 0, type: "individual", label: "Free ($0/mo)" },
    Pro: { price: 20, type: "individual", label: "Pro ($20/mo)" },
    "Max 5x": { price: 100, type: "individual", label: "Max 5x ($100/mo)" },
    "Max 20x": { price: 200, type: "individual", label: "Max 20x ($200/mo)" },
    "Team Standard": { price: 25, type: "team", label: "Team Standard ($25/user/mo - Min 5 seats)" },
    "Team Premium": { price: 125, type: "team", label: "Team Premium ($125/user/mo - Min 5 seats)" },
    Enterprise: { price: 150, type: "team", label: "Enterprise (Custom - Est. $150/user/mo)" }
  },
  ChatGPT: {
    Free: { price: 0, type: "individual", label: "Free ($0/mo)" },
    Go: { price: 8, type: "individual", label: "Go ($8/mo)" },
    Plus: { price: 20, type: "individual", label: "Plus ($20/mo)" },
    "Pro ($100 tier)": { price: 100, type: "individual", label: "Pro ($100/mo)" },
    "Pro ($200 tier)": { price: 200, type: "individual", label: "Pro ($200/mo)" },
    Business: { price: 25, type: "team", label: "Business ($25/user/mo - Min 2 seats)" },
    Enterprise: { price: 60, type: "team", label: "Enterprise (Custom - Est. $60/user/mo)" }
  },
  Gemini: {
    Free: { price: 0, type: "individual", label: "Free ($0/mo)" },
    "Google AI Plus": { price: 8, type: "individual", label: "Google AI Plus ($8/mo)" },
    "Google AI Pro": { price: 19.99, type: "individual", label: "Google AI Pro ($19.99/mo)" },
    "Google AI Ultra (entry)": { price: 99.99, type: "individual", label: "Google AI Ultra (entry) ($99.99/mo)" },
    "Google AI Ultra (top)": { price: 200, type: "individual", label: "Google AI Ultra (top) ($200/mo)" }
  },
  Windsurf: {
    Free: { price: 0, type: "individual", label: "Free ($0/mo)" },
    Pro: { price: 20, type: "individual", label: "Pro ($20/mo)" },
    Max: { price: 200, type: "individual", label: "Max ($200/mo)" },
    Teams: { price: 40, type: "team", label: "Teams ($40/user/mo)" },
    Enterprise: { price: 60, type: "team", label: "Enterprise (Custom - Est. $60/user/mo)" }
  },
  "Anthropic API": {
    API: { price: 0, type: "api", label: "Direct API Usage (Token-metered)" }
  },
  "OpenAI API": {
    API: { price: 0, type: "api", label: "Direct API Usage (Token-metered)" }
  },
  "Gemini API": {
    API: { price: 0, type: "api", label: "Direct API Usage (Token-metered)" }
  }
};

// Use-case Overlap Maps for Step 3
const OVERLAP_GROUPS = {
  coding: ["Cursor", "GitHub Copilot", "Windsurf"],
  assistant: ["Claude", "ChatGPT", "Gemini"],
  api: ["Anthropic API", "OpenAI API", "Gemini API"]
};

// Help helper for Step 1 cross-plan mapping
const TEAM_TO_INDIVIDUAL_MAP = {
  Cursor: { target: "Pro", price: 20 },
  "GitHub Copilot": { target: "Pro", price: 10 },
  Claude: { target: "Pro", price: 20 },
  ChatGPT: { target: "Plus", price: 20 },
  Windsurf: { target: "Pro", price: 20 }
};

// Same-vendor ladders for Step 2
const LADDERS = {
  Cursor: ["Hobby", "Pro", "Pro+", "Ultra"],
  "GitHub Copilot": ["Free", "Pro", "Pro+"],
  Claude: ["Free", "Pro", "Max 5x", "Max 20x"],
  ChatGPT: ["Free", "Go", "Plus", "Pro ($100 tier)", "Pro ($200 tier)"],
  Gemini: ["Free", "Google AI Plus", "Google AI Pro", "Google AI Ultra (entry)", "Google AI Ultra (top)"],
  Windsurf: ["Free", "Pro", "Max"]
};

const Audit = () => {
  // Step State
  // 1: Form entry, 2: Loading animation, 3: Results dashboard
  const [step, setStep] = useState(1);
  const [loadingText, setLoadingText] = useState("");
  
  // Global form variables
  const [teamSize, setTeamSize] = useState(1);
  const [primaryUseCase, setPrimaryUseCase] = useState("mixed");
  
  // Reported tools list
  const [reportedTools, setReportedTools] = useState([
    {
      tool_name: "Cursor",
      plan: "Pro",
      reported_monthly_spend: 20,
      seats: 1,
      usage_intensity: "moderate",
      overage_frequency: "never"
    }
  ]);

  // Output recommendation data
  const [auditResult, setAuditResult] = useState(null);
  
  // Checking list toggles for dynamic recalculation in results step
  const [activeCheckboxes, setActiveCheckboxes] = useState({});

  // Loading text phrases sequence
  const loadingPhrases = [
    "Caching pricing indices from live sources...",
    "Scanning user stack for redundant workflows...",
    "Analyzing seat allocations vs organizational controls...",
    "Mapping usage parameters against vendor quota rules...",
    "Compiling custom cost-efficiency options..."
  ];

  // Dynamically update default spend when plan or seats change
  const handleToolChange = (index, field, value) => {
    const updated = [...reportedTools];
    updated[index][field] = value;

    if (field === "tool_name") {
      const firstPlan = Object.keys(PRICING_DATA[value])[0];
      updated[index].plan = firstPlan;
      const unitPrice = PRICING_DATA[value][firstPlan].price;
      updated[index].reported_monthly_spend = unitPrice * updated[index].seats;
    } else if (field === "plan" || field === "seats") {
      const toolName = updated[index].tool_name;
      const planName = updated[index].plan;
      const seatsCount = parseInt(updated[index].seats) || 1;
      const unitPrice = PRICING_DATA[toolName][planName]?.price || 0;
      updated[index].reported_monthly_spend = unitPrice * seatsCount;
    }

    setReportedTools(updated);
  };

  const addToolRow = () => {
    // Find a tool not already added, default to Copilot/Claude if Cursor is taken
    const currentNames = reportedTools.map(t => t.tool_name);
    const available = Object.keys(PRICING_DATA).find(name => !currentNames.includes(name));
    const nextTool = available || "Claude";
    const firstPlan = Object.keys(PRICING_DATA[nextTool])[0];

    setReportedTools([
      ...reportedTools,
      {
        tool_name: nextTool,
        plan: firstPlan,
        reported_monthly_spend: PRICING_DATA[nextTool][firstPlan].price,
        seats: 1,
        usage_intensity: "moderate",
        overage_frequency: "never"
      }
    ]);
  };

  const removeToolRow = (index) => {
    if (reportedTools.length > 1) {
      setReportedTools(reportedTools.filter((_, i) => i !== index));
    }
  };

  // Run the full Audit Pipeline logic
  const executeAudit = () => {
    setStep(2);
    let phraseIndex = 0;
    setLoadingText(loadingPhrases[0]);

    const timer = setInterval(() => {
      phraseIndex++;
      if (phraseIndex < loadingPhrases.length) {
        setLoadingText(loadingPhrases[phraseIndex]);
      }
    }, 550);

    setTimeout(() => {
      clearInterval(timer);
      const results = runPipelineLogic();
      setAuditResult(results);
      
      // Initialize checkboxes for recommended fixes as true (enabled)
      const initialChecked = {};
      results.tools.forEach((item, idx) => {
        if (item.monthly_savings > 0) {
          initialChecked[idx] = true;
        }
      });
      setActiveCheckboxes(initialChecked);
      setStep(3);
    }, 2800);
  };

  const runPipelineLogic = () => {
    const outputs = [];
    const upgradeWarnings = [];

    // Helper map of tools present in the audit
    const toolMap = {};
    reportedTools.forEach(t => {
      toolMap[t.tool_name] = t;
    });

    // Run evaluations per tool
    reportedTools.forEach((t, index) => {
      const candidates = [];
      const toolName = t.tool_name;
      const planName = t.plan;
      const seatsCount = parseInt(t.seats) || 1;
      const intensity = t.usage_intensity;
      const overages = t.overage_frequency;
      const currentSpend = parseFloat(t.reported_monthly_spend) || 0;

      const planMeta = PRICING_DATA[toolName][planName];
      const isTeamTier = planMeta?.type === "team";
      const listPrice = planMeta?.price || 0;

      // STEP 1 - Seat/plan-size sanity check
      if (seatsCount < 3 && isTeamTier) {
        const mapping = TEAM_TO_INDIVIDUAL_MAP[toolName];
        if (mapping) {
          const unitSavings = listPrice - mapping.price;
          const savings = unitSavings * seatsCount;
          if (savings > 0) {
            candidates.push({
              check: "step1",
              action: "downgrade",
              recommended_plan_or_tool: mapping.target,
              monthly_savings: savings,
              reasoning_sentence: `Downgrading from team-tier (${planName}) to individual ${mapping.target} seats saves $${savings}/mo for ${seatsCount} seat(s) without losing core capabilities.`,
              confidence: "high"
            });
          }
        }
      }

      // STEP 2 - Same-vendor downgrade check
      const ladder = LADDERS[toolName];
      if (ladder) {
        const planIndex = ladder.indexOf(planName);

        if (planIndex !== -1) {
          // Rule A: Light usage + no overages, on a plan at or above the entry paid tier
          // Entry paid is index 1. If above index 1, downgrade to index 1. If on index 1, downgrade to index 0 (Free).
          if (intensity === "light" && overages === "never" && planIndex >= 1) {
            const targetIndex = planIndex > 1 ? 1 : 0;
            const entryPlan = ladder[targetIndex];
            const entryPrice = PRICING_DATA[toolName][entryPlan]?.price || 0;
            const savings = currentSpend - (entryPrice * seatsCount);
            if (savings > 0) {
              candidates.push({
                check: planIndex > 1 ? "step2_light_above_entry" : "step2_light_entry",
                action: "downgrade",
                recommended_plan_or_tool: entryPlan,
                monthly_savings: savings,
                reasoning_sentence: planIndex > 1
                  ? `With light usage and no limits reached, downgrading from ${planName} to the entry paid plan (${entryPlan}) saves $${savings}/mo.`
                  : `With light usage and no limits reached, downgrading from the paid ${planName} plan to the free tier (${entryPlan}) saves $${savings}/mo.`,
                confidence: "high"
              });
            }
          }

          // Rule B: Moderate usage + no overages, on Pro+/Ultra/Max (index >= 2)
          if (intensity === "moderate" && overages === "never" && planIndex >= 2) {
            // Base paid tier is index 1
            const basePlan = ladder[1];
            const basePrice = PRICING_DATA[toolName][basePlan]?.price || 0;
            const savings = currentSpend - (basePrice * seatsCount);
            if (savings > 0) {
              candidates.push({
                check: "step2_moderate",
                action: "downgrade",
                recommended_plan_or_tool: basePlan,
                monthly_savings: savings,
                reasoning_sentence: `Based on moderate activity, downgrading ${planName} to the base ${basePlan} plan covers your needs and saves $${savings}/mo.`,
                confidence: "high"
              });
            }
          }

          // Rule C: Heavy usage + frequent overages on Free/entry (index <= 1) -> recommend upgrade (added cost, warning)
          if (intensity === "heavy" && overages === "often" && planIndex <= 1) {
            const nextPlan = ladder[planIndex + 1] || ladder[ladder.length - 1];
            const nextPrice = PRICING_DATA[toolName][nextPlan]?.price || 0;
            const costIncrease = (nextPrice * seatsCount) - currentSpend;
            if (costIncrease > 0) {
              candidates.push({
                check: "step2_upgrade",
                action: "upgrade",
                recommended_plan_or_tool: nextPlan,
                monthly_savings: 0,
                added_cost: costIncrease,
                reasoning_sentence: `Heavy usage and daily limits throttling on ${planName} suggest an upgrade to ${nextPlan} (+ $${costIncrease}/mo) will avoid performance blocks.`,
                confidence: "high"
              });
              upgradeWarnings.push({
                tool_name: toolName,
                added_monthly_cost: costIncrease,
                reasoning: `Heavy usage and daily limits throttling on ${planName} suggest an upgrade to ${nextPlan} (+ $${costIncrease}/mo) will avoid performance blocks.`
              });
            }
          }
        }
      }

      // STEP 3 - Cross-tool redundancy check
      // Find overlap groups
      let groupName = null;
      let groupMembers = [];
      Object.entries(OVERLAP_GROUPS).forEach(([name, members]) => {
        if (members.includes(toolName)) {
          groupName = name;
          groupMembers = members;
        }
      });

      if (groupName) {
        // Count paid tools from this group in reported list
        const activeGroupTools = reportedTools.filter(
          item => groupMembers.includes(item.tool_name) && item.reported_monthly_spend > 0
        );

        if (activeGroupTools.length >= 2) {
          const isCodingGroup = groupName === "coding";
          const isAssistantGroup = groupName === "assistant";
          
          // Only trigger if seats <= 2 or primary usecase matches
          const qualifies = seatsCount <= 2 || teamSize <= 2 || 
                            (isCodingGroup && primaryUseCase === "coding") ||
                            (isAssistantGroup && ["writing", "data", "research"].includes(primaryUseCase));

          if (qualifies) {
            // Find highest capability tool active
            let bestTool = activeGroupTools[0].tool_name;
            if (isCodingGroup) {
              // Rank: Cursor > Windsurf > Copilot
              const ranking = ["Cursor", "Windsurf", "GitHub Copilot"];
              bestTool = activeGroupTools.sort((a, b) => ranking.indexOf(a.tool_name) - ranking.indexOf(b.tool_name))[0].tool_name;
            } else if (isAssistantGroup) {
              // Rank: Claude > ChatGPT > Gemini
              const ranking = ["Claude", "ChatGPT", "Gemini"];
              bestTool = activeGroupTools.sort((a, b) => ranking.indexOf(a.tool_name) - ranking.indexOf(b.tool_name))[0].tool_name;
            } else {
              // API Rank: Anthropic API > OpenAI API > Gemini API
              const ranking = ["Anthropic API", "OpenAI API", "Gemini API"];
              bestTool = activeGroupTools.sort((a, b) => ranking.indexOf(a.tool_name) - ranking.indexOf(b.tool_name))[0].tool_name;
            }

            if (toolName !== bestTool) {
              candidates.push({
                check: "step3",
                action: "consolidate",
                recommended_plan_or_tool: bestTool,
                monthly_savings: currentSpend,
                reasoning_sentence: `Consolidating multiple ${groupName === 'coding' ? 'IDE editors' : 'chat subscriptions'} to ${bestTool} saves $${currentSpend}/mo by canceling redundant ${toolName} access.`,
                confidence: "high"
              });
            }
          }
        }
      }

      // STEP 4 - Cheaper alternative-tool check
      // Only runs if step 3 overlap did not fire for this tool
      const hasRedundancyCheck = candidates.some(c => c.check === "step3");
      if (!hasRedundancyCheck && groupName) {
        // Compare effective unit cost vs cheapest in group that covers intensity
        // Let's check Cursor/Windsurf Pro+ vs Copilot Pro for light coders
        if (groupName === "coding" && intensity === "light" && planName !== "Hobby" && planName !== "Free") {
          // If they are paying > $10/user
          const effectiveUnitCost = currentSpend / seatsCount;
          if (effectiveUnitCost >= 20) {
            const savings = (effectiveUnitCost - 10) * seatsCount;
            if (savings > 0) {
              candidates.push({
                check: "step4",
                action: "switch",
                recommended_plan_or_tool: "GitHub Copilot (Pro)",
                monthly_savings: savings,
                reasoning_sentence: `As a light coder, switching from ${toolName} to GitHub Copilot Pro ($10/mo) saves $${savings}/mo, though you may lose agentic file edits.`,
                confidence: "medium"
              });
            }
          }
        }
        
        // Assistant group - high limit tiers vs standard $20 plans for light/mod
        if (groupName === "assistant" && (planName.includes("Max") || planName.includes("Pro (") || planName.includes("Ultra")) && (intensity === "light" || intensity === "moderate")) {
          const effectiveUnitCost = currentSpend / seatsCount;
          if (effectiveUnitCost > 20) {
            const savings = (effectiveUnitCost - 20) * seatsCount;
            candidates.push({
              check: "step4",
              action: "switch",
              recommended_plan_or_tool: "Claude Pro / ChatGPT Plus ($20/mo)",
              monthly_savings: savings,
              reasoning_sentence: `Based on your ${intensity} usage, switching to standard Claude Pro or ChatGPT Plus ($20/mo) saves $${savings}/mo over the premium plan quota.`,
              confidence: "medium"
            });
          }
        }
      }

      // STEP 5 - Subscription vs direct API check
      // Case A: High-tier subscription + API direct of same vendor
      if (planName.includes("Max") || planName.includes("Pro (") || planName.includes("Ultra")) {
        const correspondingApi = 
          toolName === "Claude" ? "Anthropic API" :
          toolName === "ChatGPT" ? "OpenAI API" :
          toolName === "Gemini" ? "Gemini API" : null;

        if (correspondingApi && toolMap[correspondingApi]) {
          candidates.push({
            check: "step5_api_overlap",
            action: "consolidate",
            recommended_plan_or_tool: correspondingApi,
            monthly_savings: 0,
            reasoning_sentence: `You are paying for a high-tier ${toolName} subscription alongside direct API keys. Shift automatic routines entirely to the API to cut licensing bills.`,
            confidence: "medium",
            isNote: true
          });
        }
      }

      // Case B: API only with heavy usage
      if (planName === "API" && intensity === "heavy") {
        const correspondingSub = 
          toolName === "Anthropic API" ? "Claude (Max)" :
          toolName === "OpenAI API" ? "ChatGPT (Pro)" :
          toolName === "Gemini API" ? "Gemini (Ultra)" : null;

        candidates.push({
          check: "step5_sub_instead",
          action: "switch",
          recommended_plan_or_tool: correspondingSub || "Subscription Plan",
          monthly_savings: 0,
          reasoning_sentence: `Heavy direct API workflows can exceed subscription costs. Switching repetitive tasks to a Claude Max or ChatGPT Pro subscription may reduce overall spend.`,
          confidence: "medium",
          isNote: true
        });
      }

      // Scoring & Pick Winner
      if (candidates.length > 0) {
        // Score each candidate:
        // score = savings_magnitude + (confidence === 'high' ? 1000 : 0) + (action === 'downgrade' ? 200 : 0)
        // High confidence/deterministic rules take precedent, same-vendor downgrades prefered over complex tool swaps
        const scored = candidates.map(c => {
          let score = c.monthly_savings;
          if (c.confidence === "high") score += 1000;
          if (c.action === "downgrade") score += 200;
          if (c.isNote) score -= 500; // API notes are secondary suggestions
          return { ...c, score };
        });

        // Sort descending
        scored.sort((a, b) => b.score - a.score);
        const winner = scored[0];

        // Keep secondary note if any
        const secondary = scored.find(c => c.isNote || (c.check === "step4" && winner.check !== "step4"));

        outputs.push({
          tool_name: toolName,
          current_plan: planName,
          current_monthly_spend: currentSpend,
          recommended_action: winner.action,
          recommended_plan_or_tool: winner.recommended_plan_or_tool,
          monthly_savings: winner.monthly_savings,
          reasoning_sentence: winner.reasoning_sentence,
          confidence: winner.confidence,
          secondary_note: secondary ? secondary.reasoning_sentence : null
        });
      } else {
        // STEP 6 — "Already optimal" honesty check
        outputs.push({
          tool_name: toolName,
          current_plan: planName,
          current_monthly_spend: currentSpend,
          recommended_action: "keep",
          recommended_plan_or_tool: planName,
          monthly_savings: 0,
          reasoning_sentence: "Your current subscription plan aligns perfectly with your usage activity. No adjustment is required.",
          confidence: "high"
        });
      }
    });

    // Aggregate values
    const totalSavings = outputs.reduce((sum, item) => sum + item.monthly_savings, 0);
    let overallStatus = "already_optimal";
    if (totalSavings > 100) {
      overallStatus = "high_savings";
    } else if (totalSavings >= 15) {
      overallStatus = "moderate_savings";
    }

    return {
      tools: outputs,
      total_monthly_savings: totalSavings,
      total_annual_savings: totalSavings * 12,
      upgrade_warnings: upgradeWarnings,
      overall_status: overallStatus
    };
  };

  // Recalculate totals dynamically based on selected checkboxes in Step 3
  const getDynamicSavings = () => {
    if (!auditResult) return { monthly: 0, annual: 0 };
    
    let monthly = 0;
    auditResult.tools.forEach((item, index) => {
      if (activeCheckboxes[index] && item.monthly_savings > 0) {
        monthly += item.monthly_savings;
      }
    });
    
    return {
      monthly: Math.round(monthly * 100) / 100,
      annual: Math.round(monthly * 12 * 100) / 100
    };
  };

  const dynamicSavings = getDynamicSavings();

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto w-full">
      {/* ----------------- STEP 1: Form Input Stack ----------------- */}
      {step === 1 && (
        <div>
          {/* Header */}
          <div className="text-center mt-6 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200/60 bg-blue-50/50 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="text-blue-800 text-xs font-bold tracking-wider uppercase">
                Audit Engine Active
              </span>
            </div>

            <h1 className="bitcount-grid-double text-4xl md:text-7xl text-blue-700 mb-6">
              AI Spend Audit
            </h1>
            <p className="noto-sans text-2xl md:text-3xl font-bold text-gray-800 max-w-3xl mx-auto leading-tight">
              Uncover hidden subscription waste in 2 minutes.
            </p>
            <p className="noto-sans text-gray-400 text-base md:text-lg max-w-xl mx-auto mt-4 font-semibold">
              Fill out your team context and add your active AI tools to compute immediate savings options.
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 md:p-10">
            {/* Global Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 pb-8 border-b border-gray-100">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 noto-sans">
                  Total Organization Team Size
                </label>
                <input
                  type="number"
                  min="1"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition duration-200 text-gray-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 noto-sans">
                  Primary AI Use Case
                </label>
                <select
                  value={primaryUseCase}
                  onChange={(e) => setPrimaryUseCase(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 outline-none text-gray-800 bg-white"
                >
                  <option value="coding">Software Development & Coding</option>
                  <option value="writing">Content Copywriting & Editing</option>
                  <option value="data">Data Analytics & Operations</option>
                  <option value="research">Academic & Market Research</option>
                  <option value="mixed">General Mixed Use Case</option>
                </select>
              </div>
            </div>

            {/* Tools Rows */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="noto-sans text-xl font-extrabold text-gray-800">
                  Your AI Tools & Subscriptions
                </h3>
                <span className="text-xs text-gray-400 font-bold uppercase">
                  {reportedTools.length} reported
                </span>
              </div>

              <div className="space-y-6">
                {reportedTools.map((row, i) => (
                  <div
                    key={i}
                    className="p-5 border border-gray-100 rounded-2xl bg-slate-50/50 shadow-sm relative group"
                  >
                    {/* Remove button */}
                    {reportedTools.length > 1 && (
                      <button
                        onClick={() => removeToolRow(i)}
                        className="absolute -top-2.5 -right-2.5 p-1.5 bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 shadow-md transition-all duration-200 cursor-pointer"
                        title="Remove Tool"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {/* Tool Dropdown */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">
                          AI Tool
                        </label>
                        <select
                          value={row.tool_name}
                          onChange={(e) => handleToolChange(i, "tool_name", e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-blue-600 outline-none text-sm text-gray-800"
                        >
                          {Object.keys(PRICING_DATA).map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Plan Dropdown */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">
                          Active Plan
                        </label>
                        <select
                          value={row.plan}
                          onChange={(e) => handleToolChange(i, "plan", e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-blue-600 outline-none text-sm text-gray-800"
                        >
                          {Object.keys(PRICING_DATA[row.tool_name]).map(planKey => (
                            <option key={planKey} value={planKey}>
                              {PRICING_DATA[row.tool_name][planKey].label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Seats input */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">
                          Seats Purchased
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={row.seats}
                          onChange={(e) => handleToolChange(i, "seats", Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-blue-600 outline-none text-sm text-gray-800 bg-white"
                        />
                      </div>

                      {/* Reported Spend input */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">
                          Actual Monthly Spend ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={row.reported_monthly_spend}
                          onChange={(e) => handleToolChange(i, "reported_monthly_spend", Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-blue-600 outline-none text-sm text-gray-800 bg-white"
                        />
                      </div>

                      {/* Usage Intensity */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">
                          Usage Intensity
                        </label>
                        <select
                          value={row.usage_intensity}
                          onChange={(e) => handleToolChange(i, "usage_intensity", e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-blue-600 outline-none text-sm text-gray-800"
                        >
                          <option value="light">Light (Low activity, irregular)</option>
                          <option value="moderate">Moderate (Normal regular use)</option>
                          <option value="heavy">Heavy (High frequency / developer)</option>
                        </select>
                      </div>

                      {/* Overage Frequency */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">
                          Overage/Throttle Frequency
                        </label>
                        <select
                          value={row.overage_frequency}
                          onChange={(e) => handleToolChange(i, "overage_frequency", e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-blue-600 outline-none text-sm text-gray-800"
                        >
                          <option value="never">Never (Never hit plan limit)</option>
                          <option value="sometimes">Sometimes (Occasional throttle)</option>
                          <option value="often">Often (Frequently run out of quota)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Tool / Submit Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={addToolRow}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-blue-200 text-blue-700 font-semibold hover:bg-blue-50 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Add Another Tool
              </button>

              <button
                onClick={executeAudit}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white font-bold shadow-lg hover:shadow-blue-300/40 hover:scale-103 transition-all duration-300 cursor-pointer"
              >
                Run AI Spend Audit →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- STEP 2: Loading State Animation ----------------- */}
      {step === 2 && (
        <div className="flex flex-col items-center justify-center min-h-[450px]">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-700 animate-spin"></div>
          </div>

          <h2 className="noto-sans text-2xl font-bold text-gray-800 mb-3 animate-pulse">
            Analyzing Subscription Stack
          </h2>
          <p className="noto-sans text-gray-400 font-semibold text-center max-w-sm">
            {loadingText}
          </p>
        </div>
      )}

      {/* ----------------- STEP 3: Results Dashboard ----------------- */}
      {step === 3 && auditResult && (
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="bitcount-grid-double text-4xl md:text-6xl text-blue-700 mb-4">
              Audit Results
            </h2>
            <p className="noto-sans text-gray-500 font-bold text-lg">
              Here is your AI subscription optimization blueprint.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Big Headline Savings Banner */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl p-8 shadow-2xl flex flex-col justify-between sticky top-28 min-h-[420px]">
                <div>
                  <span className="px-3.5 py-1 rounded-full bg-white/20 border border-white/20 text-xs font-bold uppercase tracking-wider">
                    {auditResult.overall_status === "high_savings" && "High Value Plan"}
                    {auditResult.overall_status === "moderate_savings" && "Optimization Options"}
                    {auditResult.overall_status === "already_optimal" && "Optimal Setup"}
                  </span>

                  <h3 className="noto-sans text-lg font-bold mt-6 text-blue-100">
                    Estimated Annual Savings
                  </h3>
                  <div className="bitcount-grid-double text-5xl md:text-6xl font-black mt-2 text-white">
                    ${dynamicSavings.annual}
                  </div>
                  <p className="text-sm text-blue-100 mt-2 noto-sans">
                    Based on saving <strong className="text-white">${dynamicSavings.monthly}/month</strong>
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/20 text-sm">
                  {auditResult.overall_status === "already_optimal" ? (
                    <p className="leading-relaxed">
                      🎉 **Excellent spending structure!** Your current subscription choices map perfectly to your usage patterns.
                    </p>
                  ) : (
                    <p className="leading-relaxed text-blue-100">
                      💡 Select or clear the checkboxes in the plan to recalculate your potential savings in real-time.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Recommendations List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Checkbox Recalculation Checklist */}
              {auditResult.tools.some(t => t.monthly_savings > 0) && (
                <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-xl">
                  <h3 className="noto-sans font-extrabold text-gray-800 text-lg mb-4">
                    Action Plan Savings Checklist
                  </h3>
                  <div className="space-y-3">
                    {auditResult.tools.map((item, idx) => {
                      if (item.monthly_savings <= 0) return null;
                      return (
                        <label
                          key={idx}
                          className="flex items-start gap-3 p-3.5 hover:bg-slate-50/50 rounded-xl border border-gray-50 hover:border-gray-100 transition duration-200 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={!!activeCheckboxes[idx]}
                            onChange={(e) =>
                              setActiveCheckboxes({
                                ...activeCheckboxes,
                                [idx]: e.target.checked
                              })
                            }
                            className="mt-1 h-4.5 w-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <div className="text-sm">
                            <span className="font-bold text-gray-800 block">
                              {item.recommended_action === "downgrade" && `Downgrade ${item.tool_name}`}
                              {item.recommended_action === "consolidate" && `Consolidate ${item.tool_name}`}
                              {item.recommended_action === "switch" && `Switch ${item.tool_name}`}
                              <span className="text-blue-700 ml-2">Save ${item.monthly_savings}/mo</span>
                            </span>
                            <span className="text-gray-400 font-semibold">{item.reasoning_sentence}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Warnings (Upgrades, limits etc) */}
              {auditResult.upgrade_warnings.length > 0 && (
                <div className="p-6 bg-amber-50/50 border border-amber-100 rounded-3xl shadow-lg">
                  <div className="flex gap-3">
                    <svg className="w-6 h-6 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h4 className="noto-sans font-bold text-amber-800 text-base mb-1">
                        Active Usage Warnings
                      </h4>
                      <ul className="space-y-2 text-sm text-amber-700 font-semibold">
                        {auditResult.upgrade_warnings.map((warn, i) => (
                          <li key={i}>{warn.reasoning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Tool by Tool Details */}
              <div className="space-y-5">
                {auditResult.tools.map((item, index) => {
                  const isOptimal = item.recommended_action === "keep";
                  return (
                    <div
                      key={index}
                      className="p-6 bg-white border border-gray-100 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 relative overflow-hidden"
                    >
                      {/* Color bar indicator */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-2.5 ${
                          isOptimal ? "bg-emerald-500" : item.recommended_action === "upgrade" ? "bg-amber-500" : "bg-blue-600"
                        }`}
                      />

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-50 pb-4 mb-4">
                        <div>
                          <h4 className="noto-sans text-xl font-extrabold text-gray-800">
                            {item.tool_name}
                          </h4>
                          <p className="text-xs text-gray-400 font-bold uppercase mt-1">
                            Current: {item.current_plan} (${item.current_monthly_spend}/mo)
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            isOptimal
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                              : item.recommended_action === "upgrade"
                              ? "bg-amber-55 text-amber-900 border border-amber-200"
                              : "bg-blue-50 text-blue-800 border border-blue-100"
                          }`}
                        >
                          {isOptimal ? "Well-Suited" : `${item.recommended_action}`}
                        </span>
                      </div>

                      <p className="noto-sans text-gray-600 text-sm leading-relaxed mb-4">
                        {item.reasoning_sentence}
                      </p>

                      {item.secondary_note && (
                        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-gray-400 font-semibold leading-relaxed flex gap-2">
                          <svg className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <span className="text-gray-500 font-bold block mb-0.5">Alternative Recommendation:</span>
                            {item.secondary_note}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Start Over Button */}
              <div className="pt-6">
                <button
                  onClick={() => {
                    setStep(1);
                    setReportedTools([
                      {
                        tool_name: "Cursor",
                        plan: "Pro",
                        reported_monthly_spend: 20,
                        seats: 1,
                        usage_intensity: "moderate",
                        overage_frequency: "never"
                      }
                    ]);
                  }}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-slate-50 font-semibold transition duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
                  </svg>
                  Reset & Audit Another Stack
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Audit;
