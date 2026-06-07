// City Twin — local response engine for the hackathon demo.
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │ CLAUDE API INTEGRATION POINT                                              │
// │ Replace this local heuristic with a Claude structured-JSON response.      │
// │ Send `inputText` to Claude and ask it to return the same CityTwinResponse │
// │ shape below (role, stage, origin, language, needs, categories+reasons,    │
// │ scores, message). The UI renders ONLY what this function returns.         │
// └─────────────────────────────────────────────────────────────────────────┘

import { CATEGORIES, OPPORTUNITIES, type CategoryId, type Opportunity } from '../data/mockData';

export interface ResponseCategory {
  id: CategoryId;
  label: string; // short label (node)
  fullLabel: string; // full category name
  color: string;
  reason: string; // why this category was chosen, from the input
  opportunities: Opportunity[];
}

export interface CityTwinResponse {
  role: string;
  stage: string;
  origin: string | null;
  language: string;
  needs: string[];
  categories: ResponseCategory[];
  scoreBefore: number;
  scoreAfter: number;
  riskBefore: string;
  riskAfter: string;
  summary: string;
  message: string;
}

// Secondary "Try an example" chips — these are the exact required test inputs,
// so clicking one demonstrates correct, distinct detection.
export const EXAMPLES: { key: string; label: string; text: string }[] = [
  { key: 'student', label: 'Student', text: 'I am a student and I am looking for scholarships in Hong Kong.' },
  { key: 'founder', label: 'Founder', text: 'I am an AI founder from Germany. I need startup funding and founder community.' },
  { key: 'researcher', label: 'Researcher', text: 'I am an AI researcher from India and I want to turn my research into a startup.' },
];

// ---- keyword groups ----
const KW = {
  student: /\b(students?|scholarships?|universit(y|ies)|bachelor|master'?s?|exchange|erasmus|study|studying|education|campus|degree|tuition|hku|hkust|cuhk|beca(s)?|estudiante)\b/,
  founder: /\b(founders?|startups?|start-up|business|compan(y|ies)|entrepreneurs?|co-?founder|accelerator|incubator|venture|pitch|build a (company|startup))\b/,
  funding: /\b(funding|fund|grants?|investment|investor|capital|seed|accelerator|incubator|money for (a )?startup)\b/,
  researcher: /\b(researchers?|research|phd|labs?|scientist|academic|commerciali[sz]ation|deep ?tech|innovation)\b/,
  social: /\b(friends?|lonely|volunteer(ing)?|social life|meet people|language exchange|cultural|voluntariado|make friends)\b/,
  community: /\b(communit(y|ies)|network(ing)?|people|comunidad)\b/,
  visa: /\b(visa|relocation|relocat(e|ing)?|moving|move to|just arrived|arrived|arriving|settle|settling|housing|residence|permit|top talent pass|ttps|qmas|living in hong kong)\b/,
  ai: /\b(ai|a\.i\.|artificial intelligence|machine learning|ml|deep ?tech)\b/,
};

interface Origin {
  country: string | null;
  adj: string | null; // e.g. "Spanish"
  language: string;
}
function detectOrigin(text: string): Origin {
  if (/\b(spanish|spain|madrid|barcelona|espa[nñ]a|espa[nñ]ol(a)?|hispanohablante)\b/.test(text))
    return { country: 'Spain', adj: 'Spanish', language: 'Spanish' };
  if (/\b(german|germany|berlin|munich|m[uü]nchen|deutsch)\b/.test(text))
    return { country: 'Germany', adj: 'German', language: 'German/English' };
  if (/\b(indian|india|delhi|mumbai|bangalore|bengaluru|hindi)\b/.test(text))
    return { country: 'India', adj: 'Indian', language: 'English/Hindi' };
  if (/\b(french|france|paris|fran[cç]ais)\b/.test(text))
    return { country: 'France', adj: 'French', language: 'French/English' };
  if (/\b(mandarin|china|mainland|chinese)\b/.test(text))
    return { country: 'China', adj: 'Chinese', language: 'Mandarin' };
  return { country: null, adj: null, language: 'English' };
}

function detectStage(text: string): string {
  if (/\b(just arrived|recently arrived|arrived|seit einem monat|acabo de llegar|moved here)\b/.test(text))
    return 'Recently arrived';
  if (/\b(considering|thinking|planning|pensando|move to|moving to|relocat)\b/.test(text))
    return 'Considering Hong Kong';
  return 'Exploring Hong Kong';
}

const REASONS: Record<CategoryId, string> = {
  funding: 'You mentioned funding or building a company.',
  scholarship: 'You’re a student looking at study and scholarships.',
  nationality: 'You named where you’re from — here’s your community.',
  entrepreneurship: 'You want founders and startup community.',
  student: 'You’re a student — here’s campus life and peers.',
  social: 'You mentioned community, friends or integration.',
  visa: 'You mentioned moving, arriving or visa needs.',
  research: 'You want to turn research into a venture.',
};

function phrase(items: string[]): string {
  const a = items.map((s) => s.toLowerCase());
  if (a.length === 0) return 'a first path into the ecosystem';
  if (a.length === 1) return a[0];
  return `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`;
}

export function generateCityTwinResponse(inputText: string): CityTwinResponse {
  const text = (inputText || '').toLowerCase();
  console.log('CityTwin input:', inputText);

  const has = {
    student: KW.student.test(text),
    founder: KW.founder.test(text),
    funding: KW.funding.test(text),
    researcher: KW.researcher.test(text),
    social: KW.social.test(text),
    community: KW.community.test(text),
    visa: KW.visa.test(text),
    ai: KW.ai.test(text),
  };
  const origin = detectOrigin(text);

  // --- role + base categories (strict; optional ones added only on demand) ---
  let role: string;
  const ids: CategoryId[] = [];
  let scoreBefore = 33;
  let scoreAfter = 80;

  const add = (id: CategoryId) => {
    if (!ids.includes(id)) ids.push(id);
  };

  if (has.researcher) {
    role = has.ai ? 'AI Researcher' : 'Researcher';
    scoreBefore = 29;
    scoreAfter = 84;
    add('research');
    if (has.founder) add('entrepreneurship');
    if (has.funding) add('funding');
    if (has.student) add('scholarship');
  } else if (has.founder) {
    role = has.ai ? 'AI Founder' : 'Founder';
    scoreBefore = 34;
    scoreAfter = 86;
    add('funding');
    add('entrepreneurship');
    if (has.ai) add('research');
  } else if (has.student) {
    role = 'Student';
    scoreBefore = 31;
    scoreAfter = 79;
    add('scholarship');
    add('student');
  } else {
    role = 'Newcomer';
    scoreBefore = 33;
    scoreAfter = 80;
    if (has.community || has.social) add('social');
  }

  // --- universal optional categories (only when their cue is present) ---
  if (has.funding) add('funding'); // e.g. a student who explicitly asks about grants
  if (origin.country) add('nationality'); // only when an origin/language is detected
  if (has.social) add('social');
  if (has.visa) add('visa');

  // Newcomer with nothing actionable → a calm sensible default (never funding).
  if (ids.length === 0) {
    add('social');
    add('visa');
  }

  const categoryIds = ids.slice(0, 6);

  // --- needs (readable, aligned to role + cues) ---
  const needs: string[] = [];
  if (role === 'Student') {
    needs.push('Scholarships');
    if (origin.adj && has.community) needs.push(`${origin.adj} community`);
    else needs.push('Education');
  } else if (role.includes('Founder')) {
    needs.push(has.funding ? 'Startup funding' : 'Funding');
    needs.push('Founder community');
  } else if (role.includes('Researcher')) {
    needs.push('Research commercialization');
    needs.push(has.founder ? 'Startup path' : has.funding ? 'Funding' : 'Innovation network');
  } else {
    if (has.social || has.community) needs.push('Community');
    if (has.visa) needs.push('Visa guidance');
    if (needs.length === 0) needs.push('Orientation', 'Community');
  }
  const topNeeds = Array.from(new Set(needs)).slice(0, 3);

  // --- assemble rich category objects (UI renders ONLY these) ---
  const categories: ResponseCategory[] = categoryIds.map((id) => ({
    id,
    label: CATEGORIES[id].short,
    fullLabel: CATEGORIES[id].label,
    color: CATEGORIES[id].color,
    reason: REASONS[id],
    opportunities: OPPORTUNITIES[id],
  }));

  const language = origin.language;
  const stage = detectStage(text);
  const summary = `${role} · ${stage} · ${language} · ${topNeeds.slice(0, 2).join(' + ')}`;

  const response: CityTwinResponse = {
    role,
    stage,
    origin: origin.country,
    language,
    needs: topNeeds,
    categories,
    scoreBefore,
    scoreAfter,
    riskBefore: 'High',
    riskAfter: scoreAfter >= 75 ? 'Low' : 'Medium',
    summary,
    message: `Welcome to Hong Kong. I detected that you’re looking for ${phrase(topNeeds)}. Let me build your constellation.`,
  };

  console.log('Detected response:', response);
  return response;
}
