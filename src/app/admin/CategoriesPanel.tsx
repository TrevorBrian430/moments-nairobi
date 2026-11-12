"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit2, Plus, Trash2 } from "lucide-react";
import type { Category, Product } from "@/lib/constants";

type CategoryDraft = Pick<Category, "name" | "description" | "image"> & { id?: string };
const empty: CategoryDraft = { name: "", description: "", image: "/images/bagpack 1.jpg" };
const field = "mt-1 block min-h-11 w-full rounded-[9px] border border-[#d9c2b0] bg-[#fffaf5] px-3 py-2 text-sm";

export default function CategoriesPanel({ categories, products, busy, save, remove, viewProducts }: {
  categories: Category[];
  products: Product[];
  busy: boolean;
  save: (category: CategoryDraft) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  viewProducts: (slug: string) => void;
}) {
  const [draft, setDraft] = useState<CategoryDraft>();
  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Categories</h1>
          <p className="mt-1 text-sm text-[#705648]">Organize the catalog and manage the collections shoppers see.</p>
        </div>
        <button disabled={busy} onClick={() => setDraft(empty)}
          className="inline-flex min-h-11 items-center gap-2 rounded-[9px] bg-[#733d29] px-4 text-sm font-semibold text-white">
          <Plus size={17} /> Add category
        </button>
      </header>
      {draft && (
        <form className="space-y-4 rounded-[16px] border border-[#e4d6ca] bg-[#fffaf5] p-4 sm:p-6"
          onSubmit={async (event) => {
            event.preventDefault();
            if (await save(draft)) setDraft(undefined);
          }}>
          <h2 className="font-semibold">{draft.id ? "Edit category" : "New category"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">Name
              <input required maxLength={80} value={draft.name} className={field}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            </label>
            <label className="text-sm font-medium">Cover image path or URL
              <input required maxLength={500} value={draft.image} placeholder="https://… or /images/…" className={field}
                onChange={(event) => setDraft({ ...draft, image: event.target.value })} />
            </label>
            <label className="text-sm font-medium sm:col-span-2">Description
              <textarea rows={3} maxLength={500} value={draft.description} className={field}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button disabled={busy} className="min-h-11 rounded-[9px] bg-[#733d29] px-4 text-sm font-semibold text-white">Save category</button>
            <button type="button" disabled={busy} onClick={() => setDraft(undefined)} className="min-h-11 px-3 text-sm">Cancel</button>
          </div>
        </form>
      )}
      {!categories.length && <p className="text-sm text-[#705648]">Add a category before creating a product.</p>}
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {categories.map((category) => {
          const count = products.filter((product) => product.category === category.slug).length;
          return (
            <article key={category.id} className="min-w-0 rounded-[16px] border border-[#e4d6ca] bg-[#fffaf5] p-4">
              <div className="relative aspect-[3/1] overflow-hidden rounded-[10px] bg-[#efe1d6]">
                <Image src={category.image} unoptimized={category.image.startsWith("https://")} alt="" fill sizes="(min-width: 640px) 40vw, 90vw" className="object-cover" />
              </div>
              <h2 className="mt-3 break-words text-lg font-semibold">{category.name}</h2>
              {category.description && <p className="mt-1 break-words text-sm text-[#705648]">{category.description}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <button className="min-h-11 font-semibold text-[#733d29] hover:underline" onClick={() => viewProducts(category.slug)}>
                  {count} {count === 1 ? "product" : "products"}
                </button>
                <button disabled={busy} className="ml-auto grid size-11 place-items-center rounded-[9px] hover:bg-[#efe1d6]"
                  aria-label={`Edit ${category.name}`} onClick={() => { setDraft(category); window.scrollTo(0, 0); }}>
                  <Edit2 size={17} />
                </button>
                <button disabled={busy} className="grid size-11 place-items-center rounded-[9px] text-red-700 hover:bg-red-50"
                  aria-label={`Delete ${category.name}`} onClick={() => {
                    if (confirm(`Delete "${category.name}"? Categories must be empty before deletion.`)) void remove(category.id);
                  }}>
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
