// Words that trigger the safety UI — should be checked BEFORE scoring
export const CRISIS_KEYWORDS = [
  'kill', 'harm', 'end it', 'hurt myself', 'hurt me', 'suicide', 'suicidal',
  'self harm', 'self-harm', 'cut myself', 'not want to live', 'don\'t want to live',
  'want to die', 'wish i was dead', 'end my life', 'take my life',
];

export function hasCrisisKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

const STRESS_WORDS: [string, number][] = [
  // Mild (1–3)
  ['okay', 1], ['fine', 1], ['meh', 1], ['whatever', 1.5],
  ['tired', 2], ['bored', 2], ['slow', 1.5], ['blah', 2],
  ['slightly', 1.5], ['a bit', 1.5], ['sort of', 1.5],

  // Moderate (3–5)
  ['stressed', 3.5], ['anxious', 4], ['worried', 3.5], ['nervous', 3],
  ['upset', 3.5], ['frustrated', 4], ['annoyed', 3], ['irritated', 3.5],
  ['confused', 3], ['overwhelmed', 5], ['exhausted', 4.5],
  ['sad', 3.5], ['unhappy', 3.5], ['lonely', 4], ['lost', 3.5],
  ['struggling', 4.5], ['can\'t cope', 5], ['too much', 4],

  // High (5–7)
  ['terrified', 6], ['panicking', 6.5], ['panicked', 6.5], ['hate this', 5.5],
  ['hate my life', 7], ['hate myself', 7], ['crying', 5], ['breaking down', 6],
  ['falling apart', 6.5], ['hopeless', 7], ['helpless', 6.5], ['worthless', 7],
  ['useless', 6], ['disaster', 6], ['awful', 5.5], ['horrible', 5.5],
  ['terrible', 5], ['depressed', 6], ['depression', 6.5], ['anxiety', 5],
  ['dread', 6], ['rage', 6], ['furious', 6], ['livid', 6.5],

  // Very high (7–9)
  ['can\'t do this anymore', 8], ['done with everything', 7.5], ['can\'t take it', 7.5],
  ['nothing matters', 8], ['everything is wrong', 7.5], ['completely broken', 8.5],
  ['total mess', 7], ['falling apart', 7.5], ['mental breakdown', 8],
  ['i give up', 8], ['gave up', 7.5], ['no point', 8], ['no reason', 7.5],
  ['unbearable', 8], ['unlivable', 8.5], ['traumatized', 7.5], ['trauma', 7],
  ['suicidal thoughts', 9.5], ['don\'t want to be here', 9],

  // Intensifiers (multiplier, not absolute)
  ['so', 0.5], ['very', 0.5], ['really', 0.6], ['extremely', 1.5],
  ['insanely', 1.5], ['incredibly', 1], ['absolutely', 1], ['completely', 1.5],
  ['totally', 1], ['utterly', 1.5],

  // Exclamation / caps signals handled below
];

// Emoji stress signals
const STRESS_EMOJIS: [string, number][] = [
  ['😭', 5], ['😢', 4], ['😤', 5], ['😡', 6], ['🤯', 6], ['😰', 5],
  ['😫', 5], ['😩', 4.5], ['💔', 5], ['😖', 4.5], ['😣', 4.5],
  ['🥺', 3], ['😞', 3.5], ['😔', 3], ['😟', 3.5],
];

export function analyzeStress(text: string): number {
  if (!text || text.trim().length === 0) return 1;

  const lower = text.toLowerCase();
  let totalScore = 0;
  let matchCount = 0;

  // 1. Word matching
  for (const [word, weight] of STRESS_WORDS) {
    if (lower.includes(word)) {
      totalScore += weight;
      matchCount++;
    }
  }

  // 2. Emoji matching
  for (const [emoji, weight] of STRESS_EMOJIS) {
    const occurrences = (text.match(new RegExp(emoji, 'g')) || []).length;
    if (occurrences > 0) {
      totalScore += weight * Math.min(occurrences, 3); // cap at 3 to avoid spam
      matchCount += occurrences;
    }
  }

  // 3. ALL CAPS signal (angry/urgent)
  const capsWords = text.match(/\b[A-Z]{3,}\b/g) || [];
  totalScore += capsWords.length * 1.2;

  // 4. Exclamation marks signal
  const exclamations = (text.match(/!/g) || []).length;
  totalScore += Math.min(exclamations * 0.5, 2);

  // 5. Text length bonus — longer = more to say = potentially more stressed
  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount > 50) totalScore += 0.5;
  if (wordCount > 100) totalScore += 1;
  if (wordCount > 200) totalScore += 1.5;

  // If no stress signals found at all, baseline is 1
  if (matchCount === 0 && capsWords.length === 0 && exclamations === 0) {
    return Math.min(Math.max(1 + Math.floor(wordCount / 30), 1), 3);
  }

  // Normalize: divide by number of matches (weighted avg), then scale to 1–10
  const avgIntensity = totalScore / Math.max(matchCount, 1);
  // Map avgIntensity (roughly 0–10 range) to 1–10 score
  const rawScore = Math.min(Math.max(avgIntensity, 1), 10);

  return Math.round(rawScore * 10) / 10;
}

// Bear response messages keyed to stress bands
export function getBearMessage(score: number): string {
  if (score <= 2) {
    return "Hey, it sounds like things are pretty manageable right now 🌿 that's good! i'm here if you ever need to let more out 🤍";
  } else if (score <= 4) {
    return "Sounds like today's been a bit rough around the edges 🐾 it's okay — you felt it, you shared it, and that takes courage. breathe with me 💜";
  } else if (score <= 6) {
    return "That sounded like a lot to carry 😢 you're not alone in this. whatever you're going through, it's real and it's valid. i'm so glad you let it out 🫂";
  } else if (score <= 8) {
    return "Wow, you've been holding SO much. i felt every word. please be gentle with yourself today — you deserve rest, and care, and love 💔🤍";
  } else {
    return "I hear you. and i'm deeply worried about you. what you're feeling is serious — please don't face this alone. i care about you so much 💜 please reach out to someone you trust, or a helpline. you matter.";
  }
}

export function getComparisonMessage(current: number, previous: number | null): string {
  if (previous === null) return "this is our first time chatting — i'm so glad you're here 🤍";
  
  const diff = previous - current;

  if (diff > 1.5) {
    return `you're doing a bit better than last time we talked! i'm proud of you for finding some peace 🌿`;
  } else if (diff < -1.5) {
    return `it feels like things are heavier today than they were last time... i'm extra glad you came to let it out 🫂`;
  } else {
    return `you're carrying a similar weight to last time. remember, i'm always here to help you hold it 🐾`;
  }
}