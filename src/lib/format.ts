export function formatUsd(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function potencyLabel(thc: number) {
  if (thc < 10) return 'light';
  if (thc < 20) return 'medium';
  return 'strong';
}

export function firstImage(images: string[]) {
  return images[0] ?? 'https://picsum.photos/seed/hsmn-fallback/800/800';
}
