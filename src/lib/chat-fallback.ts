export function hasInventoryIntent(message: string): boolean {
  const lower = message.toLowerCase();
  return ["in stock", "available", "inventory", "current", "carry", "sell", "menu", "have any"].some(term => lower.includes(term));
}

export function ruleBasedResponse(message: string, productSummary: string): string {
  const lower = message.toLowerCase();
  const inventoryIntent = hasInventoryIntent(message);
  const requestedCategory = ["flower", "edible", "vape", "concentrate", "beverage", "accessor"].find(category => lower.includes(category));
  if (inventoryIntent && productSummary) {
    const matchingProducts = requestedCategory
      ? productSummary.split("\n").filter(line => line.toLowerCase().includes(`(${requestedCategory}`)).join("\n")
      : productSummary;
    return matchingProducts
      ? `Here is the current ${requestedCategory ?? "storefront"} inventory I can verify:\n\n${matchingProducts}\n\nAvailability can change, so confirm the product page before ordering.`
      : `I could not find a currently available ${requestedCategory} item in the latest catalog. Try another format or check the Shop page for the newest update.`;
  }
  if (lower.includes("hour") || lower.includes("open") || lower.includes("close")) {
    return "Our team is available Monday–Saturday 10am–9pm and Sunday 11am–7pm, with delivery service available Tuesday, Thursday, and Saturday.";
  }
  if (lower.includes("pickup") || lower.includes("delivery") || lower.includes("order")) {
    return "High Society MN is delivery-only — no in-person pickup. We deliver on Tuesday, Thursday, and Saturday throughout Saint Paul and the greater Minneapolis–Saint Paul metro area.";
  }
  if (lower.includes("drop") || lower.includes("new product") || lower.includes("restock")) {
    return "New product drops happen every Tuesday, Thursday, and Saturday at 10am. Check our Drops page to see what's landing next.";
  }
  if (lower.includes("thc") || lower.includes("cbd") || lower.includes("potency")) {
    return "All our products are third-party lab tested, and THC/CBD percentages are listed on each product page. I can also help you compare potency options for adults 21+.";
  }
  if (lower.includes("discount") || lower.includes("coupon") || lower.includes("promo") || lower.includes("deal")) {
    return "Sign up for our newsletter to get 10% off your first delivery order and be first to hear about fresh drops and exclusive offers.";
  }
  if (lower.includes("flower")) {
    return "Our flower selection includes premium sativa, indica, and hybrid strains. Browse the Flower category for current availability, terpene profiles, and THC/CBD details.";
  }
  if (lower.includes("edible")) {
    return "We carry a wide range of edibles including gummies, chocolates, mints, and more. They're precisely dosed for consistency — start low and go slow.";
  }
  if (lower.includes("vape") || lower.includes("cartridge")) {
    return "Our vape lineup includes live resin and full-spectrum options across sativa, indica, and hybrid profiles. Check the Vapes section for current inventory.";
  }
  if (lower.includes("concentrate") || lower.includes("wax") || lower.includes("rosin") || lower.includes("shatter")) {
    return "We carry premium concentrates including live rosin, badder, and shatter. These are high-potency products best suited for experienced adult consumers.";
  }
  if (lower.includes("product") || lower.includes("available") || lower.includes("sell") || lower.includes("carry")) {
    return `We carry flower, edibles, vapes, concentrates, beverages, and accessories. Here's a quick overview of current inventory:\n\n${productSummary}\n\nYou can browse the full menu on our Shop page and place a delivery order for eligible areas.`;
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("help")) {
    return "Hey there! 👋 Welcome to High Society MN. I can help with product recommendations, delivery info, drops, and general cannabis questions for adults 21+. What can I help you with today?";
  }
  return `Thanks for your question! I'm here to help with product info, delivery details, drops, and more.\n\nWe carry flower, edibles, vapes, concentrates, beverages, and accessories, and we deliver Tuesday, Thursday, and Saturday across Saint Paul and the greater Minneapolis–Saint Paul metro area.\n\nIs there something specific I can help you with?`;
}
