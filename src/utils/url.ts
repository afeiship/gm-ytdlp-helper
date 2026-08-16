export function cleanUrl(url: string): string {
  return url.split('?')[0].replace(/\/$/, '');
}