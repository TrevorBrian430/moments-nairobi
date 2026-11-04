import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopnetic Admin & POS | Moments Nairobi",
  description: "Moments Nairobi physical store POS & inventory management system.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900/90 p-2 sm:p-6 flex items-center justify-center font-sans antialiased selection:bg-[#B85C6E] selection:text-white">
      {/* App window frame */}
      <div className="w-full max-w-[1550px] min-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 flex flex-col">
        {/* macOS style window header bar */}
        <div className="bg-slate-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-400 inline-block" />
            <span className="h-3 w-3 rounded-full bg-green-400 inline-block" />
            <span className="ml-4 font-mono font-medium text-gray-600">
              momentsnairobi.co.ke/admin • POS Terminal (Twilight Suites F4-08)
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Live Terminal
            </span>
            <span>Shop Attendant: Brian</span>
          </div>
        </div>

        {/* Interior layout */}
        <div className="flex-1 flex overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
