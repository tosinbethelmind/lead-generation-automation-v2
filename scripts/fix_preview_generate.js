const fs = require('fs');
let c = fs.readFileSync('src/app/api/preview/generate/route.ts', 'utf8');

const target = `      try {
        const { generateCopyWithProviders } = await import('@/lib/llmProvider');
        // Lightning-fast 800ms max timeout so page loads instantly
        const llmPromise = generateCopyWithProviders(lead);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('LLM timeout')), 800));
        generatedResponse = await Promise.race([llmPromise, timeoutPromise]);
      } catch (err: any) {
        // Instant fallback to optimized local copy engine (<1ms)
      }`;

const replacement = `      if (process.env.NODE_ENV === 'production' && config.antigravityApiKey) {
        try {
          const { generateCopyWithProviders } = await import('@/lib/llmProvider');
          const llmPromise = generateCopyWithProviders(lead);
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('LLM timeout')), 800));
          generatedResponse = await Promise.race([llmPromise, timeoutPromise]);
        } catch (err: any) {
          // Instant fallback to optimized local copy engine (<1ms)
        }
      }`;

if (c.includes("const { generateCopyWithProviders } = await import('@/lib/llmProvider');")) {
  c = c.replace(target, replacement);
  fs.writeFileSync('src/app/api/preview/generate/route.ts', c, 'utf8');
  console.log('Successfully optimized preview generate route!');
} else {
  console.log('Pattern not matched');
}
