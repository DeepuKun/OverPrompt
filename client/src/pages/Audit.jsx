import { useState } from "react";

// ─────────────────────────────────────────────────────────────
// 1. Pricing Data (Source of Truth) — unchanged from original,
//    re-verify against official pricing pages periodically.
// ─────────────────────────────────────────────────────────────
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
  "Anthropic API": { API: { price: 0, type: "api", label: "Direct API Usage (Token-metered)" } },
  "OpenAI API": { API: { price: 0, type: "api", label: "Direct API Usage (Token-metered)" } },
  "Gemini API": { API: { price: 0, type: "api", label: "Direct API Usage (Token-metered)" } }
};

const OVERLAP_GROUPS = {
  coding: ["Cursor", "GitHub Copilot", "Windsurf"],
  assistant: ["Claude", "ChatGPT", "Gemini"],
  api: ["Anthropic API", "OpenAI API", "Gemini API"]
};

const RANKING = {
  coding: ["Cursor", "Windsurf", "GitHub Copilot"],
  assistant: ["Claude", "ChatGPT", "Gemini"],
  api: ["Anthropic API", "OpenAI API", "Gemini API"]
};

const TEAM_TO_INDIVIDUAL_MAP = {
  Cursor: { target: "Pro", price: 20 },
  "GitHub Copilot": { target: "Pro", price: 10 },
  Claude: { target: "Pro", price: 20 },
  ChatGPT: { target: "Plus", price: 20 },
  Windsurf: { target: "Pro", price: 20 }
};

// index 0 in every ladder = free tier, index 1 = entry paid tier.
const LADDERS = {
  Cursor: ["Hobby", "Pro", "Pro+", "Ultra"],
  "GitHub Copilot": ["Free", "Pro", "Pro+"],
  Claude: ["Free", "Pro", "Max 5x", "Max 20x"],
  ChatGPT: ["Free", "Go", "Plus", "Pro ($100 tier)", "Pro ($200 tier)"],
  Gemini: ["Free", "Google AI Plus", "Google AI Pro", "Google AI Ultra (entry)", "Google AI Ultra (top)"],
  Windsurf: ["Free", "Pro", "Max"]
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const r2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const spendOf = (t) => parseFloat(t.reported_monthly_spend) || 0;

const emptyToolRow = (overrides = {}) => ({
  tool_name: "Cursor",
  plan: "Pro",
  reported_monthly_spend: 20,
  seats: 1,
  usage_intensity: "moderate",
  overage_frequency: "never",
  spend_touched: false,
  ...overrides
});

const Audit = () => {
  const [step, setStep] = useState(1);
  const [loadingText, setLoadingText] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [primaryUseCase, setPrimaryUseCase] = useState("mixed");
  const [reportedTools, setReportedTools] = useState([emptyToolRow()]);
  const [auditResult, setAuditResult] = useState(null);
  const [activeCheckboxes, setActiveCheckboxes] = useState({});

  const loadingPhrases = [
    "Caching pricing indices from live sources...",
    "Scanning user stack for redundant workflows...",
    "Analyzing seat allocations vs organizational controls...",
    "Mapping usage parameters against vendor quota rules...",
    "Compiling custom cost-efficiency options..."
  ];

  // FIX (bug 1): reported_monthly_spend only auto-recalculates when the
  // user hasn't manually typed their own number. Editing seats/plan after
  // a manual edit no longer silently overwrites the real reported spend.
  const handleToolChange = (index, field, value) => {
    const updated = [...reportedTools];
    updated[index] = { ...updated[index], [field]: value };

    if (field === "reported_monthly_spend") {
      updated[index].spend_touched = true;
    }

    if (field === "tool_name") {
      const firstPlan = Object.keys(PRICING_DATA[value])[0];
      updated[index].plan = firstPlan;
      updated[index].spend_touched = false; // new tool = fresh suggestion baseline
    }

    if (["tool_name", "plan", "seats"].includes(field) && !updated[index].spend_touched) {
      const toolName = updated[index].tool_name;
      const planName = updated[index].plan;
      const seatsCount = parseInt(updated[index].seats) || 1;
      const unitPrice = PRICING_DATA[toolName]?.[planName]?.price || 0;
      updated[index].reported_monthly_spend = r2(unitPrice * seatsCount);
    }

    setReportedTools(updated);
  };

  const addToolRow = () => {
    const currentNames = reportedTools.map((t) => t.tool_name);
    const available = Object.keys(PRICING_DATA).find((name) => !currentNames.includes(name));
    const nextTool = available || "Claude";
    const firstPlan = Object.keys(PRICING_DATA[nextTool])[0];
    setReportedTools([
      ...reportedTools,
      emptyToolRow({
        tool_name: nextTool,
        plan: firstPlan,
        reported_monthly_spend: PRICING_DATA[nextTool][firstPlan].price
      })
    ]);
  };

  const removeToolRow = (index) => {
    if (reportedTools.length > 1) setReportedTools(reportedTools.filter((_, i) => i !== index));
  };

  const executeAudit = () => {
    setStep(2);
    let phraseIndex = 0;
    setLoadingText(loadingPhrases[0]);
    const timer = setInterval(() => {
      phraseIndex++;
      if (phraseIndex < loadingPhrases.length) setLoadingText(loadingPhrases[phraseIndex]);
    }, 550);

    setTimeout(() => {
      clearInterval(timer);
      const results = runPipelineLogic();
      setAuditResult(results);
      const initialChecked = {};
      results.tools.forEach((item, idx) => {
        if (item.monthly_savings > 0) initialChecked[idx] = true;
      });
      setActiveCheckboxes(initialChecked);
      setStep(3);
    }, 2800);
  };

  // ───────────────────────────────────────────────────────────
  // Audit pipeline
  // ───────────────────────────────────────────────────────────
  const runPipelineLogic = () => {
    const outputs = [];
    const upgradeWarnings = [];
    const dataWarnings = [];

    // Data-consistency guard (FIX 10): flag seats that don't square with
    // the stated team size, and reported spend that's wildly off from
    // the plan's catalog price × seats — soft warnings, non-blocking.
    reportedTools.forEach((t) => {
      const seatsCount = parseInt(t.seats) || 1;
      if (teamSize > 1 && seatsCount > teamSize) {
        dataWarnings.push(
          `${t.tool_name}: you reported ${seatsCount} seats but a total team size of ${teamSize} — double-check this number.`
        );
      }
      const listPrice = PRICING_DATA[t.tool_name]?.[t.plan]?.price ?? 0;
      const expected = listPrice * seatsCount;
      const reported = spendOf(t);
      if (expected > 0 && Math.abs(reported - expected) / expected > 0.8) {
        dataWarnings.push(
          `${t.tool_name} (${t.plan}): reported spend $${r2(reported)}/mo is far from the catalog price (~$${r2(expected)}/mo for ${seatsCount} seat(s)) — worth confirming.`
        );
      }
    });

    // FIX 4: detect literal duplicate subscriptions to the same tool before
    // anything else. The lower-tier duplicate(s) are flagged as an outright
    // cancellation and skipped from the rest of the per-tool pipeline.
    const nameCount = {};
    reportedTools.forEach((t) => {
      nameCount[t.tool_name] = (nameCount[t.tool_name] || 0) + 1;
    });

    const keepIndexForName = {};
    Object.keys(nameCount).forEach((name) => {
      if (nameCount[name] <= 1) return;
      const rows = reportedTools.map((r, i) => ({ r, i })).filter((x) => x.r.tool_name === name);
      const keep = rows.reduce((best, cur) => {
        const bestPrice = PRICING_DATA[name][best.r.plan]?.price ?? 0;
        const curPrice = PRICING_DATA[name][cur.r.plan]?.price ?? 0;
        return curPrice > bestPrice ? cur : best;
      }, rows[0]);
      keepIndexForName[name] = keep.i;
    });

    const toolMap = {};
    reportedTools.forEach((t) => (toolMap[t.tool_name] = t));

    reportedTools.forEach((t, index) => {
      const toolName = t.tool_name;
      const planName = t.plan;
      const seatsCount = parseInt(t.seats) || 1;
      const intensity = t.usage_intensity;
      const overages = t.overage_frequency;
      const currentSpend = spendOf(t);
      const planMeta = PRICING_DATA[toolName][planName];
      const isTeamTier = planMeta?.type === "team";
      const listPrice = planMeta?.price || 0;

      // Duplicate-subscription short-circuit
      if (nameCount[toolName] > 1 && keepIndexForName[toolName] !== index) {
        outputs.push({
          tool_name: toolName,
          current_plan: planName,
          current_monthly_spend: r2(currentSpend),
          recommended_action: "cancel_duplicate",
          recommended_plan_or_tool: `Consolidate into your other ${toolName} subscription`,
          monthly_savings: r2(currentSpend),
          reasoning_sentence: `You reported ${nameCount[toolName]} separate ${toolName} subscriptions — this one is redundant and can be cancelled outright.`,
          confidence: "high",
          secondary_note: null
        });
        return; // skip steps 1–5 for this row
      }

      const primaryCandidates = [];
      const noteCandidates = [];

      // STEP 1 — seat/plan-size sanity check
      if (seatsCount < 3 && isTeamTier) {
        const mapping = TEAM_TO_INDIVIDUAL_MAP[toolName];
        if (mapping) {
          const savings = r2((listPrice - mapping.price) * seatsCount);
          if (savings > 0) {
            primaryCandidates.push({
              check: "step1",
              action: "downgrade",
              recommended_plan_or_tool: mapping.target,
              monthly_savings: savings,
              reasoning_sentence: `Downgrading from team-tier (${planName}) to individual ${mapping.target} seats saves $${savings}/mo for ${seatsCount} seat(s) without losing core capability.`,
              confidence: "high"
            });
          }
        }
      }

      // STEP 2 — same-vendor plan-fit check
      // FIX 6 + 7: overage_frequency is now the primary, objective signal.
      // "sometimes" now has a defined (lower-confidence) path, and the
      // upgrade path is no longer capped at planIndex <= 1.
      const ladder = LADDERS[toolName];
      if (ladder) {
        const planIndex = ladder.indexOf(planName);
        if (planIndex !== -1) {
          if (overages === "often" && planIndex < ladder.length - 1) {
            const nextPlan = ladder[planIndex + 1];
            const nextPrice = PRICING_DATA[toolName][nextPlan]?.price || 0;
            const addedCost = r2(nextPrice * seatsCount - currentSpend);
            if (addedCost > 0) {
              primaryCandidates.push({
                check: "step2_upgrade",
                action: "upgrade",
                recommended_plan_or_tool: nextPlan,
                monthly_savings: 0,
                added_cost: addedCost,
                reasoning_sentence: `You're frequently hitting limits on ${planName} — upgrading to ${nextPlan} (+$${addedCost}/mo) avoids the throttling, regardless of how you'd otherwise rate your usage.`,
                confidence: "high"
              });
              upgradeWarnings.push({
                tool_name: toolName,
                added_monthly_cost: addedCost,
                reasoning: `${toolName}: frequent limit-outs on ${planName} — upgrading to ${nextPlan} costs +$${addedCost}/mo but removes the throttling.`
              });
            }
          } else if (overages !== "often") {
            let target = null;
            if (intensity === "light" && planIndex >= 1) {
              target = planIndex > 1 ? 1 : 0;
            } else if (intensity === "moderate" && planIndex >= 2) {
              target = 1;
            }
            if (target !== null && target < planIndex) {
              const targetPlan = ladder[target];
              const targetPrice = PRICING_DATA[toolName][targetPlan]?.price || 0;
              const savings = r2(currentSpend - targetPrice * seatsCount);
              if (savings > 0) {
                const isSoft = overages === "sometimes";
                primaryCandidates.push({
                  check: "step2_downgrade",
                  action: "downgrade",
                  recommended_plan_or_tool: targetPlan,
                  monthly_savings: savings,
                  reasoning_sentence: isSoft
                    ? `Usage looks ${intensity} and you only occasionally hit limits — dropping to ${targetPlan} saves $${savings}/mo, but keep an eye on overages after switching.`
                    : `With ${intensity} usage and no limits ever reached, ${targetPlan} covers you and saves $${savings}/mo.`,
                  confidence: isSoft ? "medium" : "high"
                });
              }
            }
          }
        }
      }

      // STEP 3 — cross-tool redundancy check
      // FIX 3: consolidation target is chosen by actual cost, not a fixed
      // capability rank alone. The pricier "more capable" tool is only
      // preferred when usage is genuinely heavy, and the trade-off is
      // always stated explicitly so nothing is hidden.
      let groupName = null;
      let groupMembers = [];
      Object.entries(OVERLAP_GROUPS).forEach(([name, members]) => {
        if (members.includes(toolName)) {
          groupName = name;
          groupMembers = members;
        }
      });

      let redundancyFired = false;
      if (groupName) {
        const activeGroupTools = reportedTools.filter(
          (item) => groupMembers.includes(item.tool_name) && spendOf(item) > 0
        );

        if (activeGroupTools.length >= 2) {
          const qualifies =
            seatsCount <= 2 ||
            teamSize <= 2 ||
            (groupName === "coding" && primaryUseCase === "coding") ||
            (groupName === "assistant" && ["writing", "data", "research"].includes(primaryUseCase));

          if (qualifies) {
            const ranking = RANKING[groupName];
            const withUnit = activeGroupTools.map((item) => ({
              tool_name: item.tool_name,
              spend: spendOf(item),
              unitCost: spendOf(item) / (parseInt(item.seats) || 1)
            }));
            const cheapest = [...withUnit].sort((a, b) => a.unitCost - b.unitCost)[0];
            const mostCapable = [...withUnit].sort(
              (a, b) => ranking.indexOf(a.tool_name) - ranking.indexOf(b.tool_name)
            )[0];

            const preferCapability = intensity === "heavy";
            const bestTool = preferCapability ? mostCapable.tool_name : cheapest.tool_name;

            if (toolName !== bestTool) {
              redundancyFired = true;
              const caveat =
                bestTool !== cheapest.tool_name
                  ? ` Keeping ${bestTool} instead of the cheaper ${cheapest.tool_name} ($${r2(cheapest.spend)}/mo) is worth it only if you actually need the extra capability for heavy use — otherwise ${cheapest.tool_name} would save more.`
                  : "";
              primaryCandidates.push({
                check: "step3",
                action: "consolidate",
                recommended_plan_or_tool: bestTool,
                monthly_savings: r2(currentSpend),
                reasoning_sentence: `You're paying for multiple ${groupName === "coding" ? "in-editor coding tools" : "general AI assistants"} that cover the same job — dropping ${toolName} and keeping ${bestTool} saves $${r2(currentSpend)}/mo.${caveat}`,
                confidence: "high"
              });
            }
          }
        }
      }

      // STEP 4 — cheaper cross-vendor alternative
      // FIX 8 + 9: removed the "assistant" branch entirely (it was just
      // restating Step 2's own-tool downgrade under a misleading "switch"
      // label). The coding-group branch now guards against recommending
      // a tool switch to itself and only fires on a genuine ≥30% gap.
      if (!redundancyFired && groupName === "coding" && intensity === "light" && toolName !== "GitHub Copilot") {
        const effectiveUnitCost = currentSpend / seatsCount;
        const alt = 10; // GitHub Copilot Pro
        if (effectiveUnitCost > 0 && (effectiveUnitCost - alt) / effectiveUnitCost >= 0.3) {
          const savings = r2((effectiveUnitCost - alt) * seatsCount);
          noteCandidates.push({
            check: "step4",
            action: "switch",
            recommended_plan_or_tool: "GitHub Copilot Pro ($10/mo)",
            monthly_savings: savings,
            reasoning_sentence: `As a light coder, GitHub Copilot Pro ($10/mo) may cover your needs for $${savings}/mo less than ${toolName} — though you'd lose ${toolName}'s multi-file agent mode.`,
            confidence: "medium",
            isNote: true
          });
        }
      }

      // STEP 5 — subscription vs. direct API
      // FIX 5: now gated on heavy intensity too, since subscription + API
      // for the same vendor is very often two legitimate, non-overlapping
      // uses (chatting vs. building a product) rather than true redundancy.
      const highTier = planName.includes("Max") || planName.includes("Pro (") || planName.includes("Ultra");
      if (highTier && intensity === "heavy") {
        const correspondingApi =
          toolName === "Claude" ? "Anthropic API" : toolName === "ChatGPT" ? "OpenAI API" : toolName === "Gemini" ? "Gemini API" : null;
        if (correspondingApi && toolMap[correspondingApi]) {
          noteCandidates.push({
            check: "step5_api_overlap",
            action: "consolidate",
            recommended_plan_or_tool: correspondingApi,
            monthly_savings: 0,
            reasoning_sentence: `If any of your heavy ${toolName} usage is actually scripted/programmatic rather than interactive chat, that portion is usually cheaper run through the ${correspondingApi} directly. Worth checking your usage split before assuming these are redundant.`,
            confidence: "medium",
            isNote: true
          });
        }
      }
      if (planName === "API" && intensity === "heavy") {
        const correspondingSub =
          toolName === "Anthropic API" ? "Claude Max" : toolName === "OpenAI API" ? "ChatGPT Pro" : toolName === "Gemini API" ? "Gemini AI Ultra" : "a subscription plan";
        noteCandidates.push({
          check: "step5_sub_instead",
          action: "switch",
          recommended_plan_or_tool: correspondingSub,
          monthly_savings: 0,
          reasoning_sentence: `Sustained heavy direct-API usage can exceed subscription costs. If your usage is steady day-to-day, compare your actual API bill against ${correspondingSub} before renewing.`,
          confidence: "medium",
          isNote: true
        });
      }

      // FIX 2: primary recommendation is only ever chosen from
      // primaryCandidates. Notes never get promoted to the headline card;
      // if nothing primary fired, this correctly falls through to the
      // "already optimal" branch below, with the best note attached as
      // a secondary_note instead of masquerading as the main result.
      if (primaryCandidates.length > 0) {
        const scored = primaryCandidates
          .map((c) => ({ ...c, score: c.monthly_savings + (c.confidence === "high" ? 1000 : 0) + (c.action === "downgrade" ? 200 : 0) }))
          .sort((a, b) => b.score - a.score);
        const winner = scored[0];
        const secondary = noteCandidates[0] || scored.find((c) => c !== winner);

        outputs.push({
          tool_name: toolName,
          current_plan: planName,
          current_monthly_spend: r2(currentSpend),
          recommended_action: winner.action,
          recommended_plan_or_tool: winner.recommended_plan_or_tool,
          monthly_savings: winner.monthly_savings,
          reasoning_sentence: winner.reasoning_sentence,
          confidence: winner.confidence,
          secondary_note: secondary ? secondary.reasoning_sentence : null
        });
      } else if (noteCandidates.length > 0) {
        // Only low-confidence notes exist — tool is fundamentally fine,
        // but surface the note honestly as secondary, not primary.
        outputs.push({
          tool_name: toolName,
          current_plan: planName,
          current_monthly_spend: r2(currentSpend),
          recommended_action: "keep",
          recommended_plan_or_tool: planName,
          monthly_savings: 0,
          reasoning_sentence: "Your current plan is a reasonable fit for your reported usage.",
          confidence: "high",
          secondary_note: noteCandidates[0].reasoning_sentence
        });
      } else {
        // STEP 6 — already-optimal honesty check
        outputs.push({
          tool_name: toolName,
          current_plan: planName,
          current_monthly_spend: r2(currentSpend),
          recommended_action: "keep",
          recommended_plan_or_tool: planName,
          monthly_savings: 0,
          reasoning_sentence: "Your current plan aligns well with your reported usage — no changes needed.",
          confidence: "high",
          secondary_note: null
        });
      }
    });

    const totalSavings = r2(outputs.reduce((sum, item) => sum + item.monthly_savings, 0));
    let overallStatus = "already_optimal";
    if (totalSavings > 100) overallStatus = "high_savings";
    else if (totalSavings >= 15) overallStatus = "moderate_savings";

    return {
      tools: outputs,
      total_monthly_savings: totalSavings,
      total_annual_savings: r2(totalSavings * 12),
      upgrade_warnings: upgradeWarnings,
      data_warnings: dataWarnings,
      overall_status: overallStatus
    };
  };

  const getDynamicSavings = () => {
    if (!auditResult) return { monthly: 0, annual: 0 };
    let monthly = 0;
    auditResult.tools.forEach((item, index) => {
      if (activeCheckboxes[index] && item.monthly_savings > 0) monthly += item.monthly_savings;
    });
    return { monthly: r2(monthly), annual: r2(monthly * 12) };
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
              {auditResult.data_warnings.length > 0 && (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-600 font-semibold space-y-1.5">
                  {auditResult.data_warnings.map((w, i) => (
                    <div key={i}>⚠️ {w}</div>
                  ))}
                </div>
              )}

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
                              {item.recommended_action === "cancel_duplicate" && `Cancel duplicate ${item.tool_name}`}
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
                              ? "bg-amber-100 text-amber-900 border border-amber-200"
                              : "bg-blue-50 text-blue-800 border border-blue-100"
                          }`}
                        >
                          {isOptimal ? "Well-Suited" : item.recommended_action.replace("_", " ")}
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
                            <span className="text-gray-500 font-bold block mb-0.5">Worth investigating:</span>
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
                    setReportedTools([emptyToolRow()]);
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
