"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";

export type ProductVariant = {
  id: string;
  label: string;
  price: number;
  inStock: boolean;
  options?: Record<string, string>;
};

export type RequiredProductField = {
  title: string;
  required: boolean;
  maxLength?: number | null;
};

export function AddToCartButton({
  productId,
  disabled,
  variants = [],
  requiredFields = [],
}: {
  productId: string;
  disabled?: boolean;
  variants?: ProductVariant[];
  requiredFields?: RequiredProductField[];
}) {
  const [state, setState] = useState<"idle" | "loading" | "added" | "error">("idle");
  const [variantId, setVariantId] = useState(variants.length === 1 ? variants[0].id : "");
  const [customization, setCustomization] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const selectedVariant = variants.find((variant) => variant.id === variantId);

  async function add() {
    if (variants.length && !selectedVariant) {
      setMessage("Choose an available option before adding this product.");
      return;
    }
    const missingField = requiredFields.find(
      (field) => field.required && !customization[field.title]?.trim(),
    );
    if (missingField) {
      setMessage(`Complete “${missingField.title}” before adding this product.`);
      return;
    }
    setMessage("");
    setState("loading");
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1, variantId, customization }),
    });
    const data = await response.json().catch(() => ({}));
    setState(response.ok ? "added" : "error");
    if (!response.ok) setMessage(data.error || "Sign in to add this product.");
  }

  return (
    <div className="space-y-4">
      {variants.length > 0 && (
        <label className="block text-sm font-semibold text-slate-800">
          Choose an option <span className="text-red-600">*</span>
          <select
            value={variantId}
            onChange={(event) => {
              setVariantId(event.target.value);
              setState("idle");
              setMessage("");
            }}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal text-slate-900 outline-none focus:border-indigo-500"
          >
            {variants.length > 1 && <option value="">Select an option…</option>}
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id} disabled={!variant.inStock}>
                {variant.label} — ${variant.price.toFixed(2)}{variant.inStock ? "" : " (out of stock)"}
              </option>
            ))}
          </select>
        </label>
      )}
      {requiredFields.map((field) => (
        <label key={field.title} className="block text-sm font-semibold text-slate-800">
          {field.title} {field.required && <span className="text-red-600">*</span>}
          <textarea
            rows={3}
            maxLength={field.maxLength ?? undefined}
            value={customization[field.title] ?? ""}
            onChange={(event) =>
              setCustomization((current) => ({ ...current, [field.title]: event.target.value }))
            }
            className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-indigo-500"
          />
        </label>
      ))}
      {selectedVariant && (
        <p className="text-sm font-semibold text-indigo-700">
          Selected price: ${selectedVariant.price.toFixed(2)}
        </p>
      )}
      {message && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>}
      <Button size="lg" className="w-full gap-2" disabled={disabled || state === "loading" || selectedVariant?.inStock === false} onClick={add}>
        <ShoppingCart className="h-5 w-5" />
        {disabled ? "Out of stock" : state === "loading" ? "Adding…" : state === "added" ? "Added to bag" : "Add to bag"}
      </Button>
    </div>
  );
}
