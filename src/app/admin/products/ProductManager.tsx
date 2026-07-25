"use client";

import { useMemo, useState } from "react";
import { ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";

type Category = { id: string; name: string; slug: string };
type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string;
  category: Category;
  brand: string | null;
  price: number;
  comparePrice: number | null;
  images: string[];
  stockQuantity: number;
  inStock: boolean;
  featured: boolean;
  published: boolean;
};

type FormState = {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brand: string;
  price: string;
  comparePrice: string;
  images: string[];
  stockQuantity: string;
  inStock: boolean;
  featured: boolean;
  published: boolean;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function emptyForm(categories: Category[]): FormState {
  return {
    name: "",
    slug: "",
    description: "",
    categoryId: categories[0]?.id ?? "",
    brand: "",
    price: "",
    comparePrice: "",
    images: [],
    stockQuantity: "20",
    inStock: true,
    featured: false,
    published: true,
  };
}

function productForm(product: Product): FormState {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    categoryId: product.categoryId,
    brand: product.brand ?? "",
    price: String(product.price),
    comparePrice: product.comparePrice ? String(product.comparePrice) : "",
    images: product.images,
    stockQuantity: String(product.stockQuantity),
    inStock: product.inStock,
    featured: product.featured,
    published: product.published,
  };
}

async function optimizeImage(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = reject;
    element.src = dataUrl;
  });
  const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/webp", 0.84);
}

export function ProductManager({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(() => emptyForm(categories));
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    return term
      ? products.filter((product) =>
          `${product.name} ${product.slug} ${product.category.name}`.toLowerCase().includes(term),
        )
      : products;
  }, [products, query]);

  function startCreate() {
    setEditing(null);
    setForm(emptyForm(categories));
    setError("");
    setOpen(true);
  }

  function startEdit(product: Product) {
    setEditing(product);
    setForm(productForm(product));
    setError("");
    setOpen(true);
  }

  async function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const remaining = Math.max(0, 6 - form.images.length);
      const next = await Promise.all([...files].slice(0, remaining).map(optimizeImage));
      if (next.some((image) => image.length > 1_600_000)) {
        throw new Error("One photo is still too large. Choose an image under 8 MB.");
      }
      setForm((current) => ({ ...current, images: [...current.images, ...next] }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Photo upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!form.images.length) return setError("Add at least one product photo.");
    setSaving(true);
    setError("");
    const response = await fetch(
      editing ? `/api/admin/products/${editing.id}` : "/api/admin/products",
      {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
          stockQuantity: Number(form.stockQuantity),
        }),
      },
    );
    const data = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) return setError(data.error || "Product could not be saved.");
    setProducts((current) =>
      editing
        ? current.map((product) => (product.id === editing.id ? data.product : product))
        : [data.product, ...current],
    );
    setOpen(false);
  }

  async function remove(product: Product) {
    if (!window.confirm(`Delete “${product.name}”? Unpublish it instead if it has order history.`)) return;
    const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return window.alert(data.error || "Delete failed.");
    setProducts((current) => current.filter((item) => item.id !== product.id));
  }

  return (
    <>
      <div className="space-y-6 p-4 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Catalog manager</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Products</h1>
            <p className="mt-1 text-sm text-slate-600">{products.length} products in your storefront</p>
          </div>
          <button onClick={startCreate} className="inline-flex h-11 items-center justify-center rounded-full bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Add product
          </button>
        </div>

        <label className="flex max-w-xl items-center rounded-full border border-slate-200 bg-white px-4 shadow-sm">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products…" className="w-full bg-transparent px-3 py-3 text-sm outline-none" />
        </label>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <article key={product.id} className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_14px_40px_-32px_rgba(15,23,42,.5)]">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-indigo-50">
                {/* Admin images may be compressed data URLs, which are intentionally rendered without optimization. */}
                <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-indigo-600">{product.category.name}</p>
                <h2 className="mt-1 truncate font-semibold text-slate-950">{product.name}</h2>
                <p className="mt-1 text-sm font-bold text-slate-900">${product.price.toFixed(2)}</p>
                <p className="mt-1 text-xs text-slate-500">{product.published ? (product.inStock ? `${product.stockQuantity} in stock` : "Out of stock") : "Draft"}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => startEdit(product)} className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-700"><Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit</button>
                  <button onClick={() => remove(product)} aria-label={`Delete ${product.name}`} className="rounded-full border border-slate-200 p-1.5 text-slate-400 hover:border-red-200 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/45 p-3 backdrop-blur-sm sm:p-6">
          <form onSubmit={save} className="mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
              <div><h2 className="text-xl font-semibold text-slate-950">{editing ? "Edit product" : "Add a product"}</h2><p className="text-xs text-slate-500">Photos are resized automatically before upload.</p></div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>

            <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-2">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Product name<input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value, slug: editing ? current.slug : slugify(event.target.value) }))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none focus:border-indigo-500" /></label>
                <label className="block text-sm font-medium text-slate-700">URL slug<input required value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none focus:border-indigo-500" /></label>
                <label className="block text-sm font-medium text-slate-700">Category<select value={form.categoryId} onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5">{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm font-medium text-slate-700">Price<input required min="0" step="0.01" type="number" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5" /></label>
                  <label className="block text-sm font-medium text-slate-700">Compare at<input min="0" step="0.01" type="number" value={form.comparePrice} onChange={(event) => setForm((current) => ({ ...current, comparePrice: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5" /></label>
                </div>
                <label className="block text-sm font-medium text-slate-700">Brand<input value={form.brand} onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5" /></label>
                <label className="block text-sm font-medium text-slate-700">Description<textarea rows={5} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="mt-1.5 w-full resize-y rounded-xl border border-slate-300 px-3.5 py-2.5" /></label>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-slate-700">Product photos</span>
                  <label className="mt-1.5 flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/60 px-5 py-8 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
                    <ImagePlus className="mr-2 h-5 w-5" /> {uploading ? "Preparing photos…" : "Choose photos"}
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" disabled={uploading} onChange={(event) => addPhotos(event.target.files)} />
                  </label>
                  <p className="mt-1.5 text-xs text-slate-500">Up to 6 JPG, PNG, or WebP images. First image is the cover.</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {form.images.map((image, index) => (
                    <div key={`${image.slice(0, 30)}-${index}`} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                      <img src={image} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => setForm((current) => ({ ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index) }))} className="absolute right-1 top-1 rounded-full bg-white/95 p-1 text-slate-700 shadow"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
                <label className="block text-sm font-medium text-slate-700">Inventory<input min="0" type="number" value={form.stockQuantity} onChange={(event) => setForm((current) => ({ ...current, stockQuantity: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5" /></label>
                <div className="grid gap-2 rounded-2xl bg-slate-50 p-4 text-sm">
                  {(["inStock", "published", "featured"] as const).map((field) => (
                    <label key={field} className="flex items-center justify-between gap-4 text-slate-700">
                      <span>{field === "inStock" ? "In stock" : field === "published" ? "Visible in shop" : "Featured product"}</span>
                      <input type="checkbox" checked={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.checked }))} className="h-5 w-5 accent-indigo-600" />
                    </label>
                  ))}
                </div>
                {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              </div>
            </div>
            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700">Cancel</button>
              <button disabled={saving || uploading} className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : editing ? "Save changes" : "Add product"}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
