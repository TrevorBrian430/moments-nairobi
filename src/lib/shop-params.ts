export interface ShopFilterParams {
  category?: string;
  min?: number;
  max?: number;
  color?: string[];
  size?: string[];
  sort?: "newest" | "price-asc" | "price-desc";
  page?: number;
}

export function parseShopParams(searchParams: URLSearchParams): ShopFilterParams {
  const category = searchParams.get("category") || undefined;

  const minStr = searchParams.get("min");
  const min = minStr && !isNaN(Number(minStr)) ? Number(minStr) : undefined;

  const maxStr = searchParams.get("max");
  const max = maxStr && !isNaN(Number(maxStr)) ? Number(maxStr) : undefined;

  const colorStr = searchParams.get("color");
  const color = colorStr
    ? colorStr
        .split(",")
        .map((c) => c.trim().toLowerCase())
        .filter(Boolean)
    : undefined;

  const sizeStr = searchParams.get("size");
  const size = sizeStr
    ? sizeStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  const sortParam = searchParams.get("sort");
  const sort =
    sortParam === "price-asc" || sortParam === "price-desc" || sortParam === "newest"
      ? sortParam
      : "newest";

  const pageStr = searchParams.get("page");
  const page = pageStr && !isNaN(Number(pageStr)) ? Math.max(1, Number(pageStr)) : 1;

  return {
    category: category && category !== "all" ? category : undefined,
    min,
    max,
    color: color && color.length > 0 ? color : undefined,
    size: size && size.length > 0 ? size : undefined,
    sort,
    page,
  };
}

export function serializeShopParams(params: ShopFilterParams): string {
  const sp = new URLSearchParams();

  if (params.category && params.category !== "all") {
    sp.set("category", params.category);
  }
  if (typeof params.min === "number" && params.min > 0) {
    sp.set("min", params.min.toString());
  }
  if (typeof params.max === "number" && params.max > 0) {
    sp.set("max", params.max.toString());
  }
  if (params.color && params.color.length > 0) {
    sp.set("color", params.color.join(","));
  }
  if (params.size && params.size.length > 0) {
    sp.set("size", params.size.join(","));
  }
  if (params.sort && params.sort !== "newest") {
    sp.set("sort", params.sort);
  }

  const query = sp.toString();
  return query ? `?${query}` : "";
}
