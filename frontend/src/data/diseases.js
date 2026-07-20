// Educational reference data only. Severity here means "how commonly
// severe this condition tends to run" as general information, not an
// assessment of any individual user's condition.

export const diseases = [
  {
    id: "digital-eye-strain",
    name: "Digital Eye Strain",
    description: "A cluster of eye and vision problems linked to prolonged screen use, also called Computer Vision Syndrome.",
    causes: ["Extended screen time without breaks", "Poor posture or screen distance", "Glare and poor lighting"],
    symptoms: ["Tired or sore eyes", "Blurred vision after screen use", "Difficulty focusing"],
    riskLevel: "Moderate",
    prevention: ["Follow the 20-20-20 rule", "Adjust screen brightness to match your room", "Position screen at eye level, arm's length away"],
    treatment: "Usually resolves with better habits; persistent cases warrant an eye exam.",
    recommendedScreenTime: "Take a break every 20 minutes; keep total recreational screen time reasonable for your day.",
    severity: 45
  },
  {
    id: "dry-eye-syndrome",
    name: "Dry Eye Syndrome",
    description: "Occurs when eyes don't produce enough tears or the tears evaporate too quickly, often worsened by reduced blink rate during screen focus.",
    causes: ["Reduced blinking while focused on screens", "Air conditioning or fans", "Contact lens wear"],
    symptoms: ["Gritty or burning sensation", "Redness", "Paradoxical excess watering"],
    riskLevel: "Moderate",
    prevention: ["Blink consciously and fully", "Use a humidifier", "Consider artificial tears if advised by a professional"],
    treatment: "Lubricating drops and environmental changes; see a doctor if persistent.",
    recommendedScreenTime: "Break up long screen sessions; avoid direct airflow on your face while working.",
    severity: 40
  },
  {
    id: "computer-vision-syndrome",
    name: "Computer Vision Syndrome",
    description: "The broader medical term encompassing the visual and eye symptoms caused by computer, tablet, and phone use.",
    causes: ["Uncorrected vision problems", "Poor lighting", "Improper viewing distance"],
    symptoms: ["Eye strain", "Headaches", "Neck and shoulder pain"],
    riskLevel: "Moderate",
    prevention: ["Get an updated eye prescription if needed", "Use proper ergonomic setup"],
    treatment: "Ergonomic correction and, if needed, corrective lenses.",
    recommendedScreenTime: "Match breaks to session length; longer sessions need more frequent breaks.",
    severity: 45
  },
  {
    id: "eye-fatigue",
    name: "Eye Fatigue",
    description: "General tiredness of the eyes from sustained visual effort.",
    causes: ["Long uninterrupted focus", "Poor sleep", "Uncorrected vision"],
    symptoms: ["Heavy eyelids", "Difficulty concentrating", "Increased blinking or squinting"],
    riskLevel: "Low to Moderate",
    prevention: ["Regular breaks", "Adequate sleep"],
    treatment: "Rest and reduced visual load; persistent fatigue should be checked.",
    recommendedScreenTime: "Shorter, more frequent sessions rather than long unbroken stretches.",
    severity: 30
  },
  {
    id: "blurred-vision",
    name: "Blurred Vision (Screen-Related)",
    description: "Temporary difficulty focusing clearly after extended near-work on screens.",
    causes: ["Focusing fatigue", "Dry eyes", "Uncorrected refractive error"],
    symptoms: ["Vision that takes time to sharpen", "Difficulty shifting focus between distances"],
    riskLevel: "Moderate",
    prevention: ["Near-far focus exercises", "Regular breaks"],
    treatment: "If blur persists beyond rest, an eye exam is needed to rule out a refractive issue.",
    recommendedScreenTime: "Pause and refocus on a distant object every 20 minutes.",
    severity: 35
  },
  {
    id: "myopia-progression",
    name: "Myopia Progression",
    description: "Worsening nearsightedness, associated in research with high amounts of near-work and limited outdoor time, especially in children and teens.",
    causes: ["Extended near-work", "Limited time outdoors", "Genetic factors"],
    symptoms: ["Increasing difficulty seeing distant objects clearly"],
    riskLevel: "Needs professional monitoring",
    prevention: ["Time outdoors", "Balanced near/far activity", "Regular eye exams, especially for children"],
    treatment: "Corrective lenses; a doctor may discuss myopia control options for children.",
    recommendedScreenTime: "Prioritize outdoor time daily; this is not something a website can assess -- see an eye doctor for tracking.",
    severity: 60
  },
  {
    id: "red-eyes",
    name: "Red Eyes",
    description: "Visible redness from irritation, dryness, or blood vessel dilation in the eye's surface.",
    causes: ["Dryness", "Extended screen exposure", "Allergies or irritants"],
    symptoms: ["Visible redness", "Mild irritation"],
    riskLevel: "Low, unless accompanied by pain or vision change",
    prevention: ["Blink more often", "Reduce irritant exposure", "Take breaks"],
    treatment: "Usually resolves with rest; sudden severe redness with pain needs urgent care.",
    recommendedScreenTime: "Reduce continuous exposure; increase blink breaks.",
    severity: 25
  },
  {
    id: "burning-eyes",
    name: "Burning Eyes",
    description: "A stinging or burning sensation often tied to dryness or irritation.",
    causes: ["Dry eye", "Screen glare", "Environmental irritants"],
    symptoms: ["Burning or stinging sensation", "Watering"],
    riskLevel: "Low to Moderate",
    prevention: ["Humidify your space", "Reduce glare", "Blink consciously"],
    treatment: "Usually improves with hydration and reduced exposure; persistent cases need evaluation.",
    recommendedScreenTime: "Break up sessions; avoid staring without blinking.",
    severity: 30
  },
  {
    id: "watery-eyes",
    name: "Watery Eyes",
    description: "Excess tearing, often a paradoxical response to dryness or irritation from screens.",
    causes: ["Dry eye overcompensation", "Irritation", "Wind or AC exposure"],
    symptoms: ["Frequent tearing", "Blurred vision from excess moisture"],
    riskLevel: "Low to Moderate",
    prevention: ["Reduce direct airflow", "Blink fully and regularly"],
    treatment: "Usually resolves by addressing underlying dryness or irritation.",
    recommendedScreenTime: "Shorter sessions with regular breaks.",
    severity: 25
  },
  {
    id: "screen-headaches",
    name: "Headaches Caused by Screens",
    description: "Tension-type headaches linked to visual strain, posture, and screen glare.",
    causes: ["Eye strain", "Poor posture", "Glare and lighting issues", "Uncorrected vision"],
    symptoms: ["Dull ache around forehead or temples", "Worsens with continued screen use"],
    riskLevel: "Moderate",
    prevention: ["Ergonomic setup", "Regular breaks", "Address glare"],
    treatment: "Usually improves with better habits; frequent headaches warrant medical review.",
    recommendedScreenTime: "Break long sessions into shorter blocks.",
    severity: 40
  },
  {
    id: "focus-difficulty",
    name: "Difficulty Focusing",
    description: "Trouble shifting or maintaining visual focus, especially after long near-work sessions.",
    causes: ["Focusing fatigue", "Uncorrected vision", "Sleep deprivation"],
    symptoms: ["Slow refocusing between distances", "Mental fatigue while reading"],
    riskLevel: "Moderate",
    prevention: ["Near-far focus exercises", "Adequate sleep"],
    treatment: "Rest and exercises; persistent issues need a professional check.",
    recommendedScreenTime: "Pair with regular break intervals.",
    severity: 35
  },
  {
    id: "blue-light-sleep",
    name: "Sleep Problems from Blue Light",
    description: "Evening screen exposure can suppress melatonin and delay sleep onset.",
    causes: ["Screen use close to bedtime", "Bright, cool-toned lighting at night"],
    symptoms: ["Difficulty falling asleep", "Feeling unrested despite adequate hours in bed"],
    riskLevel: "Moderate",
    prevention: ["Avoid screens for an hour before bed", "Use night mode / warmer tones in the evening"],
    treatment: "Behavioral changes usually help; persistent insomnia needs medical attention.",
    recommendedScreenTime: "None in the hour before sleep.",
    severity: 35
  }
];
