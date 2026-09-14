export const foldPolicyText=v=>String(v||'')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g,'')
  .toLowerCase()
  .replace(/[_-]+/g,' ')
  .replace(/[^a-z0-9]+/g,' ')
  .replace(/\s+/g,' ')
  .trim();

export function matchesPolicyTerm(text,term){
  const hay=foldPolicyText(text),needle=foldPolicyText(term);
  if(!hay||!needle)return false;
  return (` ${hay} `).includes(` ${needle} `);
}

export function matchesAnyPolicyTerm(text,terms){
  return (Array.isArray(terms)?terms:[]).some(term=>matchesPolicyTerm(text,term));
}
