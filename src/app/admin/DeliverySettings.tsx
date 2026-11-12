"use client";

import { useState } from "react";
import type { DeliveryTown } from "@/config/policies";
import { STORE_INFO } from "@/lib/constants";

export default function DeliverySettings({ towns, busy, save }: {
  towns: DeliveryTown[];
  busy: boolean;
  save: (fees: Record<string, number>) => Promise<boolean>;
}) {
  const [changes, setChanges] = useState<Record<string, string>>({});
  return (
    <section className="max-w-3xl space-y-5">
      <h1 className="font-heading text-3xl font-extrabold">Store settings</h1>
      <div className="rounded-[16px] border border-[#e4d6ca] bg-[#fffaf5] p-5 text-sm">
        <h2 className="mb-2 font-bold">Store contact</h2>
        <p>{STORE_INFO.name} · {STORE_INFO.phone}</p>
        <p className="text-[#705648]">{STORE_INFO.address}</p>
      </div>
      <form className="space-y-4 rounded-[16px] border border-[#e4d6ca] bg-[#fffaf5] p-5"
        onSubmit={async (event) => {
          event.preventDefault();
          const fees = Object.fromEntries(towns.map(({ name, fee }) => [name, Number(changes[name] ?? fee)]));
          if (await save(fees)) setChanges({});
        }}>
        <h2 className="font-bold">Courier fees</h2>
        <p className="text-sm text-[#705648]">Set the KES amount charged at checkout for each destination. Store pickup is free.</p>
        <div className="divide-y divide-[#eadbd0]">
          {towns.map(({ name, fee }) => (
            <label key={name} className="flex items-center justify-between gap-3 py-2 text-sm">
              {name}
              <input type="number" min="0" max="10000000" step="1" required value={changes[name] ?? fee}
                onChange={(event) => setChanges({ ...changes, [name]: event.target.value })}
                className="min-h-10 w-20 shrink-0 rounded-[9px] border border-[#d9c2b0] px-2 py-1.5 text-right" />
            </label>
          ))}
        </div>
        <button disabled={busy || !Object.keys(changes).length} className="min-h-11 rounded-[9px] bg-[#733d29] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Save courier fees</button>
      </form>
    </section>
  );
}
