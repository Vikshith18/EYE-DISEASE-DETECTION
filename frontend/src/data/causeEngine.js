export const questions = [
  { cause: "strain", tag: "Screen habits", text: "On an average day, how many hours do you spend looking at a phone, laptop, or computer screen?",
    options: [{ label: "Less than 2 hours", value: 0 }, { label: "2 – 5 hours", value: 1 }, { label: "5 – 8 hours", value: 2 }, { label: "More than 8 hours", value: 3 }] },
  { cause: "strain", tag: "Screen habits", text: "Do you follow any break routine, like the 20-20-20 rule, during screen use?",
    options: [{ label: "Yes, consistently", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
  { cause: "strain", tag: "Screen habits", text: "By the end of a screen-heavy day, how do your eyes usually feel?",
    options: [{ label: "Completely fine", value: 0 }, { label: "A little tired", value: 1 }, { label: "Sore or heavy", value: 2 }, { label: "Aching or hard to keep open", value: 3 }] },
  { cause: "dry", tag: "Dryness", text: "Do your eyes feel dry, gritty, or like something's in them?",
    options: [{ label: "Never", value: 0 }, { label: "Occasionally", value: 1 }, { label: "Often, especially with screens", value: 2 }, { label: "Constantly", value: 3 }] },
  { cause: "dry", tag: "Dryness", text: "Are you regularly under a fan, AC, or heater while working?",
    options: [{ label: "Rarely", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Most of the day", value: 2 }] },
  { cause: "dry", tag: "Dryness", text: "Do your eyes water more than seems normal, especially during or after screen use?",
    options: [{ label: "No", value: 0 }, { label: "A little", value: 1 }, { label: "Yes, noticeably", value: 2 }] },
  { cause: "light", tag: "Lighting & setup", text: "How is the room lit when you're on a screen at night?",
    options: [{ label: "Well-lit room", value: 0 }, { label: "Dim room with some light", value: 1 }, { label: "Only the screen's glow, most nights", value: 3 }] },
  { cause: "light", tag: "Lighting & setup", text: "Is your screen roughly at eye level and an arm's length away?",
    options: [{ label: "Yes, both", value: 0 }, { label: "One of the two", value: 1 }, { label: "Neither -- too close or too low", value: 2 }] },
  { cause: "light", tag: "Lighting & setup", text: "Do you notice glare or reflections on your screen while working?",
    options: [{ label: "Rarely", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }] },
  { cause: "sleep", tag: "Sleep", text: "How many hours of sleep do you usually get?",
    options: [{ label: "7–9 hours", value: 0 }, { label: "6–7 hours", value: 1 }, { label: "Less than 6 hours", value: 3 }] },
  { cause: "sleep", tag: "Sleep", text: "Do you use a screen within an hour of falling asleep?",
    options: [{ label: "Rarely", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Almost every night", value: 2 }] },
  { cause: "sleep", tag: "Sleep", text: "Do your eyes feel heavy or fatigued even on days with less screen time?",
    options: [{ label: "No", value: 0 }, { label: "Occasionally", value: 1 }, { label: "Yes, regularly", value: 2 }] },
  { cause: "vision", tag: "Vision clarity", text: "Do you find yourself squinting to read distant text -- signs, whiteboards, subtitles?",
    options: [{ label: "Never", value: 0 }, { label: "Occasionally", value: 1 }, { label: "Regularly", value: 3 }] },
  { cause: "vision", tag: "Vision clarity", text: "Does your vision stay blurry even after resting your eyes for a while?",
    options: [{ label: "No, it clears up with rest", value: 0 }, { label: "Sometimes it lingers", value: 2 }, { label: "Yes, it often stays blurry", value: 3 }] },
];

export const causeMeta = {
  strain: { name: "Digital Eye Strain", color: "#4fa3e3", max: 9 },
  dry: { name: "Dry Eye", color: "#f2a65a", max: 7 },
  light: { name: "Lighting & Ergonomics", color: "#e0b34f", max: 7 },
  sleep: { name: "Sleep-Related Fatigue", color: "#6fbf8b", max: 7 },
  vision: { name: "Possible Uncorrected Vision Issue", color: "#e2665a", max: 6 },
};

export const causeNotes = {
  strain: {
    affected: "Your screen hours and habits line up closely with digital eye strain. This is the most common and most fixable cause.",
    mild: "Some signs of digital eye strain are showing up, but it's not dominant yet.",
    clear: "Your screen habits aren't showing strong strain signals right now.",
  },
  dry: {
    affected: "Your answers point clearly to dry eye -- likely reduced blinking combined with airflow exposure.",
    mild: "There are some early dry eye signs. Watch your blink rate and airflow exposure.",
    clear: "Dry eye doesn't look like a significant factor for you right now.",
  },
  light: {
    affected: "Your setup -- lighting, glare, or screen distance -- is actively working against your eyes.",
    mild: "Your setup has a few issues worth adjusting, even if it's not the main driver.",
    clear: "Your lighting and screen setup look reasonable.",
  },
  sleep: {
    affected: "Sleep looks like a real contributor here. Fatigue from poor sleep can look identical to screen strain.",
    mild: "Sleep may be adding to your eye fatigue, even if it's not the main cause.",
    clear: "Sleep doesn't look like a major factor for you right now.",
  },
  vision: {
    affected: "This pattern is not typical of simple screen strain. It specifically needs a comprehensive eye exam to check for an uncorrected refractive error. This tool cannot confirm or rule this out on its own.",
    mild: "There are a couple of signals worth mentioning to an eye doctor at your next exam.",
    clear: "No strong signals of an uncorrected vision problem.",
  },
};

export function verdictFor(pct) {
  if (pct >= 0.55) return { key: "affected", label: "Affected" };
  if (pct >= 0.25) return { key: "mild", label: "Mild Signs" };
  return { key: "clear", label: "Unlikely" };
}

export function scoreAnswers(answers) {
  const totals = { strain: 0, dry: 0, light: 0, sleep: 0, vision: 0 };
  questions.forEach((q, i) => { totals[q.cause] += answers[i] || 0; });

  const results = Object.keys(totals).map((key) => {
    const pct = totals[key] / causeMeta[key].max;
    return { key, pct, verdict: verdictFor(pct) };
  });

  const sorted = [...results].sort((a, b) => b.pct - a.pct);
  const top = sorted[0];
  const primaryCause = top.pct >= 0.25 ? causeMeta[top.key].name : null;
  const primaryKey = top.pct >= 0.25 ? top.key : null;

  return { results, primaryCause, primaryKey };
}
