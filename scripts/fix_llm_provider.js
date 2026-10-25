const fs = require('fs');
let c = fs.readFileSync('src/lib/llmProvider.ts', 'utf8');

const target = '  // Try Antigravity first!\n  if (antigravityKeys.length && Array.isArray(config.antigravityModels) && config.antigravityModels.length) {\n    for (const key of antigravityKeys) {';

const replacement = '  // Try Antigravity first with circuit breaker!\n  let consecutiveExhausted = 0;\n  if (antigravityKeys.length && Array.isArray(config.antigravityModels) && config.antigravityModels.length) {\n    for (const key of antigravityKeys) {\n      if (consecutiveExhausted >= 2) {\n        console.warn("[LLMProvider] Circuit breaker tripped (2 accounts exhausted). Falling back to instant local copy.");\n        break;\n      }';

if (c.includes('  // Try Antigravity first!')) {
  c = c.replace(target, replacement);
  c = c.replace("console.warn(`Account-level issue detected on key ${key.slice(0, 10)}..., skipping remaining models for this account.`);", "consecutiveExhausted++;\n            console.warn(`Account-level issue detected on key ${key.slice(0, 10)}..., skipping remaining models for this account.`);");
  fs.writeFileSync('src/lib/llmProvider.ts', c, 'utf8');
  console.log('Successfully added circuit breaker to llmProvider.ts');
} else {
  console.log('Already updated or pattern not found');
}
