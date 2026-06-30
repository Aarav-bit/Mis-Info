export interface KeywordRule {
  required?: string[];
  optional?: string[];
  negation?: string[];
  weight?: number;
}

export interface ScoredRule {
  rule: KeywordRule;
  score: number;
  matchedRequired: string[];
  matchedOptional: string[];
  matchedNegation: string[];
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

function getNGrams(tokens: string[], n: number): string[] {
  const grams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    grams.push(tokens.slice(i, i + n).join(' '));
  }
  return grams;
}

function getAllPhrases(text: string): Set<string> {
  const tokens = tokenize(text);
  const phrases = new Set<string>();
  
  for (let n = 1; n <= 3; n++) {
    getNGrams(tokens, n).forEach(g => phrases.add(g));
  }
  
  tokens.forEach(t => phrases.add(t));
  return phrases;
}

export function computeKeywordScore(
  input: string,
  rule: KeywordRule,
  allRuleKeywords: string[] = []
): ScoredRule {
  const inputPhrases = getAllPhrases(input);
  const inputTokens = tokenize(input);
  
  const required = rule.required || [];
  const optional = rule.optional || [];
  const negation = rule.negation || [];
  const weight = rule.weight || 1;
  
  let matchedRequired: string[] = [];
  let matchedOptional: string[] = [];
  let matchedNegation: string[] = [];
  
  for (const kw of required) {
    const kwLower = kw.toLowerCase();
    if (inputPhrases.has(kwLower) || inputTokens.includes(kwLower)) {
      matchedRequired.push(kw);
    } else if (inputTokens.some(t => t.startsWith(kwLower) || t.startsWith(kwLower.replace(/s$/, '').replace(/ed$/, '').replace(/ing$/, '')))) {
      // Stem-like matching for morphological variants
      matchedRequired.push(kw);
    }
  }
  
  for (const kw of optional) {
    const kwLower = kw.toLowerCase();
    if (inputPhrases.has(kwLower) || inputTokens.includes(kwLower)) {
      matchedOptional.push(kw);
    } else if (inputTokens.some(t => t.startsWith(kwLower) || t.startsWith(kwLower.replace(/s$/, '').replace(/ed$/, '').replace(/ing$/, '')))) {
      matchedOptional.push(kw);
    }
  }
  
  for (const kw of negation) {
    const kwLower = kw.toLowerCase();
    if (inputPhrases.has(kwLower) || inputTokens.includes(kwLower)) {
      matchedNegation.push(kw);
    } else if (inputTokens.some(t => t.startsWith(kwLower) || t.startsWith(kwLower.replace(/s$/, '').replace(/ed$/, '').replace(/ing$/, '')))) {
      matchedNegation.push(kw);
    }
  }
  
  const requiredCount = required.length;
  const matchedRequiredCount = matchedRequired.length;
  const optionalCount = optional.length;
  const matchedOptionalCount = matchedOptional.length;
  const negationCount = matchedNegation.length;
  
  let score = 0;
  
  if (requiredCount > 0) {
    const requiredRatio = matchedRequiredCount / requiredCount;
    score += requiredRatio * 0.7 * weight;
  }
  
  if (optionalCount > 0) {
    const optionalRatio = matchedOptionalCount / optionalCount;
    score += optionalRatio * 0.3 * weight;
  }
  
  if (negationCount > 0) {
    score *= Math.max(0.1, 1 - negationCount * 0.3);
  }
  
  const allKeywords = [...required, ...optional];
  const keywordRarityBonus = allKeywords.length > 0 
    ? allKeywords.reduce((sum, kw) => {
        const freq = allRuleKeywords.filter(k => k.toLowerCase() === kw.toLowerCase()).length;
        return sum + (1 / Math.max(1, freq));
      }, 0) / allKeywords.length
    : 0;
  
  score += keywordRarityBonus * 0.1;
  
  return {
    rule,
    score: Math.min(1, score),
    matchedRequired,
    matchedOptional,
    matchedNegation,
  };
}

export function findBestRuleMatch(
  input: string,
  rules: Map<string, KeywordRule>
): { ruleId: string; scoredRule: ScoredRule } | null {
  const allKeywords: string[] = [];
  for (const rule of rules.values()) {
    if (rule.required) allKeywords.push(...rule.required);
    if (rule.optional) allKeywords.push(...rule.optional);
  }
  
  let bestMatch: { ruleId: string; scoredRule: ScoredRule } | null = null;
  let bestScore = 0;
  
  for (const [ruleId, rule] of rules.entries()) {
    const scored = computeKeywordScore(input, rule, allKeywords);
    if (scored.score > bestScore) {
      bestScore = scored.score;
      bestMatch = { ruleId, scoredRule: scored };
    }
  }
  
  if (bestMatch && bestMatch.scoredRule.score < 0.15) {
    return null;
  }
  
  return bestMatch;
}

export function calibrateConfidence(
  matchScore: number,
  ruleSpecificity: number,
  negationPenalty: number
): number {
  let confidence = matchScore * 0.6 + ruleSpecificity * 0.3 + (1 - negationPenalty) * 0.1;
  confidence = Math.max(0.35, Math.min(0.99, confidence));
  return Math.round(confidence * 100);
}