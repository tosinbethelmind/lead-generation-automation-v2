/**
 * Dynamic resolution of application root working directory.
 * Prevents Next.js Turbopack / Webpack static NFT bundler tracing
 * from trying to resolve root-level script paths as module imports at build time.
 */
export function getAppCwd(): string {
  if (typeof process === 'undefined') return '';
  const method = ['cw', 'd'].join('');
  return typeof (process as any)[method] === 'function' ? (process as any)[method]() : '';
}
