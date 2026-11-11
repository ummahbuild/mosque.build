export const CONCEPT_HANDOFF_KEY = "mosque-build.concept-handoff.v1";
export const CONCEPT_PARSER_VERSION = "mosque.build/concept-parser@2";
export type ConceptField = "location" | "attendance" | "budget" | "currency" | "type" | "needs" | "style" | "storeys" | "notes";
export type ConceptSource = { start: number; end: number; quote: string };
export type ConceptEvidence = { status: "suggested" | "ambiguous" | "unspecified"; confidence: "explicit" | "interpreted" | "none"; sources: ConceptSource[]; reason: string };
export type ConceptFields = { location: string; attendance: string; budget: string; currency: string; type: string; needs: string[]; style: string[]; storeys: string; notes: string; warnings?: string[]; evidence?: Record<ConceptField, ConceptEvidence>; parserVersion?: typeof CONCEPT_PARSER_VERSION };

const numberPattern = String.raw`\d+(?:[.,]\d+)*`;
const rangePattern = String.raw`(?:[-–—]|\bto\b|\bor\b|\band\b|hadi|au|إلى|الى|أو|او)`;
const normalizeDigits = (s: string) => s.replace(/[٠-٩۰-۹٬٫]/g, char => char === "٬" ? "," : char === "٫" ? "." : String(char.charCodeAt(0) - (char >= "۰" && char <= "۹" ? 1776 : 1632)));
function numberValue(text: string): number | null {
  // Accept ordinary/Indian grouping, but never reinterpret decimal commas or malformed groups.
  if (!/^\d+(?:\.\d+)?$/.test(text) && !/^\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(text) && !/^\d{1,2}(?:,\d{2})*,\d{3}(?:\.\d+)?$/.test(text)) return null;
  const n = Number(text.replaceAll(",", ""));
  return Number.isFinite(n) ? n : null;
}
const currencyPattern = String.raw`(?:US\$|USD|KES|KSHS?|INR|MAD|GBP|EUR|AED|SAR|\$|£|€|₹|Rs\.?|dollars?|rupees?|dirhams?|DH)(?![\p{L}])`;
const budgetContext = String.raw`(?:\bbudget\b|\bunder\b|\bbelow\b|\bless than\b|\bup to\b|\bwithin\b|\bbajeti\b|\bchini ya\b|بميزانية|ميزانية|أقل من|اقل من)`;
const magnitudePattern = String.raw`(?:million|millioni|milioni|thousand|elfu|lakh|lac|crore|مليون|ملايين|ألف|الف|m|k)(?![\p{L}])`;
const currencyCode = (raw: string): string => (new Map<string,string>(Object.entries({ "US$": "USD", USD: "USD", KES: "KES", KSH: "KES", KSHS: "KES", INR: "INR", MAD: "MAD", GBP: "GBP", EUR: "EUR", AED: "AED", SAR: "SAR", "£": "GBP", "€": "EUR", "₹": "INR" }))).get(raw.toUpperCase()) || "";

export function parseMosqueConcept(input: string): ConceptFields {
  const notes = input.slice(0, 3000), normalized = normalizeDigits(notes), warnings: string[] = [];
  const unset=():ConceptEvidence=>({status:"unspecified",confidence:"none",sources:[],reason:"Not specified in this concept."});
  const evidence:Record<ConceptField,ConceptEvidence>={location:unset(),attendance:unset(),budget:unset(),currency:unset(),type:unset(),needs:unset(),style:unset(),storeys:unset(),notes:unset()};
  const source = (start: number, end: number): ConceptSource => ({ start, end, quote: notes.slice(start, end) });
  const mark = (field: ConceptField, status: ConceptEvidence["status"], sources: ConceptSource[], reason: string, interpreted = false) => {
    evidence[field] = { status, sources, reason, confidence: status === "suggested" ? interpreted ? "interpreted" : "explicit" : "none" };
    if (status === "ambiguous") warnings.push(reason);
  };
  if (input.length > 3000) warnings.push("Only the first 3,000 characters were reviewed. Keep the complete original separately.");
  if (notes) mark("notes", "suggested", [source(0, notes.length)], "Your original text, unchanged within the 3,000-character limit.");
  // Mask uncertain negative clauses without shifting source offsets. Do not guess
  // which items in a coordinated negative clause were actually requested.
  const positive = normalized.replace(/(?:\b(?:no|without|not including|not a|not an|not the|do not include|don't include|bila)\b|بدون|دون|لا(?: نريد)?)\s+[^.;!؟\n]+?(?=\b(?:but|however|instead|with|lakini|yenye)\b|لكن|[.;!؟\n]|$)/giu, match => {
    warnings.push("A negative requirement was found. Check the original text; the affected clause is not used for suggestions.");
    return " ".repeat(match.length);
  });
  const quantity = (field: "attendance" | "storeys", units: string, max: number) => {
    const re = new RegExp(`(?<![\\p{L}\\d.,])(${numberPattern})(?:\\s*${rangePattern}\\s*(${numberPattern}))?\\s*[- ]?\\s*(?:${units})(?![\\p{L}])`, "giu");
    const prefixUnits=field==="attendance"?"watu|waumini|capacity(?: of)?":"ghorofa|طوابق";
    const prefixRE=new RegExp(`(?:${prefixUnits})\\s+(${numberPattern})(?:\\s*${rangePattern}\\s*(${numberPattern}))?`,"giu");
    const matches = [...positive.matchAll(re),...positive.matchAll(prefixRE)];
    if (!matches.length) return "";
    const sources = matches.map(m => source(m.index!, m.index! + m[0].length));
    const values = matches.map(m => numberValue(m[1]));
    if (matches.some(m => m[2] || /(?:[-−]|at least|at most|more than|less than|over|under|below|population(?: of)?|neighbou?rhood(?: of)?|city(?: of)?)\s*$/i.test(positive.slice(Math.max(0, m.index! - 25), m.index!))) || values.some(n => n === null || !Number.isInteger(n) || n < 1 || n > max) || new Set(values).size !== 1) {
      mark(field, "ambiguous", sources, `${field === "attendance" ? "Attendance" : "Storeys"} contains a range, limit, alternative, contextual quantity or unsupported number. Enter one intended value in the brief.`);
      return "";
    }
    mark(field, "suggested", sources, "Explicit quantity in your concept; confirm it before planning.");
    return String(values[0]);
  };
  const attendance = quantity("attendance", "worshippers?|people|persons?|attendees|waumini|watu|مصل[يى](?:ن|اً|ا)?|مصلين|شخص(?:اً|ا)?", 50000);
  const storeys = quantity("storeys", "storeys?|stor(?:y|ies)|floors?|levels?|ghorofa|طوابق|طابق(?:ين)?|أدوار", 99);

  let location = "";
  const placeRE = /(?:\b(?:in|at|near|katika|karibu na)\b|بالقرب من|في)\s+([\p{L}][\p{L}\p{M}\s,'’.-]{1,100}?)(?=\s+(?:for|with|under|below|using|combining|that|to|budget|in|at|near|kwa|yenye|bajeti|katika|watu|waumini|but|however|instead|lakini)\b|\s+(?:بسعة|لعدد|بميزانية|لكن|لـ?\s*\d)|[;.!?\n]|$)/giu;
  const places = [...positive.matchAll(placeRE)];
  if (places.length) {
    const names = places.map(m => m[1].trim().replace(/[,\s]+$/, ""));
    const sources = places.map(m => { const start = m.index! + m[0].indexOf(m[1]); return source(start, start + names[places.indexOf(m)].length); });
    if (new Set(names.map(x => x.toLowerCase())).size > 1 || names.some(n => /^(?:St|Mt|Dr)$/i.test(n)||/\b(?:or|and|maybe|somewhere|existing|building|mosque|school|warehouse|courtyard|budget|prayer|storey|style|an?|the)\b|أو|او|مدرسة|مسجد/iu.test(n))) mark("location", "ambiguous", sources, "Location is unclear or contains alternatives. Enter the intended locality; no site is inferred.");
    else { location = names[0]; mark("location", "suggested", sources, "Place text supplied by you; no address or site has been verified."); }
  }

  let budget = "", currency = "";
  const moneyRE = new RegExp(`(?<![\\p{L}\\d.,])(?:(${budgetContext})\\s*(?:of|is|ya|ni|:)?\\s*)?(${currencyPattern})?\\s*(${numberPattern})\\s*(${magnitudePattern})?\\s*(${currencyPattern})?`, "giu");
  const amounts = [...positive.matchAll(moneyRE)].filter(m => m[1] || m[2] || m[5]);
  if (amounts.length) {
    const sources = amounts.map(m => {const end=m.index!+m[0].length;const tail=notes.slice(end).match(/^[^,;.!?\n]{0,100}/)?.[0]??"";return source(m.index!,end+tail.trimEnd().length)});
    const parsed = amounts.map(m => {
      const n = numberValue(m[3]);
      const mag = (m[4] || "").toLowerCase();
      const factor = /^(million|millioni|milioni|مليون|ملايين|m)$/.test(mag) ? 1e6 : /^(thousand|elfu|ألف|الف|k)$/.test(mag) ? 1e3 : /^(lakh|lac)$/.test(mag) ? 1e5 : mag === "crore" ? 1e7 : 1;
      const before = positive.slice(Math.max(0, m.index! - 25), m.index!), after = positive.slice(m.index! + m[0].length);
      const unitRate = /^\s*(?:per\b|\/|met(?:re|er)s?\b|m[²2]?\b|sq\b|people\b|persons?\b|worshippers?\b|storeys?\b|monthly\b|annually\b|kwa\s+(?:mtu|mita)|لكل|للمتر)/iu.test(after) || /(?:per\s+(?:person|worshipper|m[²2]|square metre)|لكل شخص)\s*$/iu.test(before);
      const range = new RegExp(`^\\s*${rangePattern}\\s*(?:${currencyPattern}\\s*)?${numberPattern}`, "iu").test(after);
      const a = currencyCode(m[2] || ""), b = currencyCode(m[5] || "");
      const unsupportedScale=/^\s*(?:billion|trillion|b|t)(?![\p{L}])/iu.test(after);
      const amount=n===null?NaN:n*factor;
      const invalid = unsupportedScale || amount<.01 || Math.abs(amount*100-Math.round(amount*100))>.001 || n === null || n <= 0 || !Number.isSafeInteger(Math.round(n * factor)) || n * factor > 1e12 || /(?:[-−]|\bnot)\s*$/.test(before) || (mag === "m" && !m[2] && !m[5]) || unitRate || range || (!!a && !!b && a !== b);
      return { amount: invalid ? "" : String(Number((n! * factor).toFixed(2))), code: a || b, rawCurrency: m[2] || m[5] || "" };
    });
    if (parsed.some(p => !p.amount) || new Set(parsed.map(p => `${p.amount}:${p.code}`)).size !== 1) {
      mark("budget", "ambiguous", sources, "The amount may be a range, alternative, dimension or unit rate. Confirm one overall budget rather than using it as a project total.");
      mark("currency", "ambiguous", sources, "Confirm the currency together with the overall budget.");
    } else {
      budget = parsed[0].amount; currency = parsed[0].code;
      mark("budget", "suggested", sources, amounts.some(m=>/under|below|less than|up to|chini ya|أقل من|اقل من/i.test(m[1]||""))?"Stated upper limit, not an exact cost estimate or verified price.":"Amount stated in your concept, not a cost estimate or verified price.");
      if (currency) mark("currency", "suggested", sources, "Currency explicitly identified in the text; no conversion was performed.");
      else {
        mark("currency", parsed[0].rawCurrency ? "ambiguous" : "unspecified", sources, "Currency is unspecified or ambiguous. Choose it explicitly; location and dollar/dirham/rupee shorthand do not establish a currency.");
        if (!parsed[0].rawCurrency) warnings.push(evidence.currency.reason);
      }
    }
  } else if (new RegExp(budgetContext, "iu").test(positive)) {
    const match = positive.match(new RegExp(`${budgetContext}[^.;!\n]*`, "iu"))!;
    mark("budget", "ambiguous", [source(match.index!, match.index! + match[0].length)], "A budget phrase was found, but its amount or format is unclear. Enter it in the brief.");
  }

  let programText=positive;for(const place of [...places,...amounts]){programText=programText.slice(0,place.index!)+" ".repeat(place[0].length)+programText.slice(place.index!+place[0].length)}
  const needs: string[] = [], needSources: ConceptSource[] = [];
  const programs: [string, RegExp][] = [
    ["Madrasa / classrooms", /\b(?:madrasa|schools?|classrooms?|education)\b|\bshule\b|مدرسة|مدارس|فصول/giu],
    ["Women / family", /\bwomen(?:'s)?\b|family prayer|\bwanawake\b|النساء/giu],
    ["Wudu", /\bwudu\b|ablution|washing facilities|\budhu\b|وضوء/giu],
    ["Accessibility", /\baccessible\b|step-free|\blifts?\b|wheelchair|ذوي الإعاقة/giu],
    ["Library", /\blibrary\b|\bmaktaba\b|مكتبة/giu], ["Youth", /\byouth\b|\bvijana\b|شباب/giu],
    ["Community hall", /community (?:hall|center|centre)|event space/giu], ["Kitchen / iftar", /\bkitchen\b|\biftar\b|\bjiko\b|إفطار/giu],
    ["Parking", /\bparking\b|maegesho|مواقف/giu], ["Janazah", /\bjanazah\b|جنازة/giu],
  ];
  for (const [name, re] of programs) { const matches = [...programText.matchAll(re)]; if (matches.length) { needs.push(name); needSources.push(...matches.map(m => source(m.index!, m.index! + m[0].length))); } }
  if (needs.length) mark("needs", "suggested", needSources, "Program words found in positive clauses; confirm the required spaces.", true);
  const style: string[] = [], styleSources: ConceptSource[] = [];
  const styles: [string, RegExp][] = [
    ["Moroccan", /\bMoroccan\b|\bMaghrebi\b|مغربي/giu], ["Indian", /\bIndian\b|هندي/giu], ["Swahili", /\bSwahili\b|\bKiswahili\b/giu],
    ["Ottoman", /\bOttoman\b|عثماني/giu], ["Mughal", /\bMughal\b|مغولي/giu], ["Sahelian", /\bSahelian\b/giu],
    ["modern", /\bmodern\b|حديث/giu], ["contemporary", /\bcontemporary\b/giu], ["minimal", /\bminimal\b/giu], ["traditional", /\btraditional\b/giu],
  ];
  for (const [name, re] of styles) { const m = re.exec(programText); if (m) { style.push(name); styleSources.push(source(m.index, m.index + m[0].length)); } }
  if (style.length) mark("style", "suggested", styleSources, "Architecture words supplied by you; these do not establish an authenticated style or design.", true);
  let type = "";
  const types: [string, RegExp][] = [
    ["Mosque expansion", /\b(?:expand|expansion|extend|extension)\b|توسعة|توسيع/iu],
    ["Adaptive reuse / conversion", /\b(?:mall|warehouse|convert|reuse|existing retail|airport)\b|تحويل/iu],
    ["Prayer room / musalla", /\b(?:prayer room|musalla)\b|مصلى/iu], ["Phased campus", /\bcampus\b/iu],
    ["Mosque + madrasa", /\b(?:madrasa|schools?|classrooms?)\b|\bshule\b|مدرسة|مدارس/iu],
    ["Community center", /community cent(?:er|re)/iu], ["New mosque", /\bmosque\b|\bmsikiti\b|مسجد/iu],
  ];
  for (const [name, re] of types) { if(name==="Mosque + madrasa"&&!/\bmosque\b|\bmsikiti\b|مسجد/iu.test(programText))continue;const m = re.exec(programText); if (m) { type = name; mark("type", "suggested", [source(m.index, m.index + m[0].length)], "Suggested category from your wording; choose whether it describes this project.", true); break; } }
  return { location, attendance, budget, currency, type, needs, style, storeys, notes, warnings: [...new Set(warnings)], evidence, parserVersion: CONCEPT_PARSER_VERSION };
}
