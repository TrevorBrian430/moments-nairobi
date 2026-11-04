import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin CMS & Inventory Control | Moments Nairobi",
  description: "Moments Nairobi product catalog management, orders, and store settings.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 p-2 sm:p-5 flex items-center justify-center font-sans antialiased selection:bg-[#B85C6E] selection:text-white">
      {/* App window frame */}
      <div className="w-full max-w-[1550px] min-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col">
        {/* Top window header bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-5 py-3 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-green-500/80 inline-block" />
            <span className="ml-3 font-mono font-medium text-slate-300">
              momentsnairobi.co.ke/admin &bull; Store CMS Terminal
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
            <span className="text-slate-300 font-bold">Moments Nairobi Admin</span>
          </div>
        </div>

        {/* Interior layout */}
        <div className="flex-1 flex overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
