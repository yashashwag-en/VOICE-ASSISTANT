export const extractJsonObject = (text) => {
  if (!text || typeof text !== "string") return null;

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return null;
  }

  return text.slice(firstBrace, lastBrace + 1);
};

export const repairAndParseJson = (text) => {
  const jsonCandidate = extractJsonObject(text);
  if (!jsonCandidate) return null;

  const simpleRepairs = [
    jsonCandidate,
    jsonCandidate.replace(/,\s*}/g, "}"),
    jsonCandidate.replace(/,\s*]/g, "]"),
  ];

  for (const candidate of simpleRepairs) {
    try {
      return JSON.parse(candidate);
    } catch {
      // Try next repair
    }
  }

  return null;
};
