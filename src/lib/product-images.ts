const CATEGORY_IMAGES: Readonly<Record<string, string>> = {
  accessories: "/images/categories/accessories.svg",
  beverages: "/images/categories/beverages.svg",
  concentrates: "/images/categories/concentrates.svg",
  edibles: "/images/categories/edibles.svg",
  flower: "/images/categories/flower.svg",
  vapes: "/images/categories/vapes.svg",
};

export function categoryImage(categoryName: string): string {
  const normalized = categoryName.trim().toLowerCase();
  return CATEGORY_IMAGES[normalized] ?? CATEGORY_IMAGES.flower;
}

export function usableProductImages(
  images: readonly string[] | null | undefined,
  categoryName: string,
): string[] {
  const validImages = (images ?? [])
    .filter((image) => {
      if (typeof image !== "string" || image === "[object Object]") return false;
      return image.startsWith("/") || /^https:\/\/(?:static\.wixstatic\.com|images\.unsplash\.com|res\.cloudinary\.com|lh3\.googleusercontent\.com)\//i.test(image);
    })
    .map((image) => image.includes("static.wixstatic.com")
      ? image
          .replace(/\/v1\/fill\/w_\d+,h_\d+,/, "/v1/fit/w_1200,h_1200,")
          .replace(/q_\d+,/, "q_92,")
          .replace(/blur_\d+,/, "")
      : image);

  return validImages.length > 0 ? Array.from(new Set(validImages)) : [categoryImage(categoryName)];
}
