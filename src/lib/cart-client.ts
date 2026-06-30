'use client';

const SESSION_KEY = 'hsmn_session_id';

export function getSessionId() {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const generated = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, generated);
  return generated;
}

export async function addToCart(productId: string, quantity = 1) {
  const sessionId = getSessionId();

  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, productId, quantity }),
  });

  if (!response.ok) {
    throw new Error('Unable to add item to cart');
  }

  return response.json();
}
