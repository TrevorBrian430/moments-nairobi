import React from "react";

export default function AnnouncementBar() {
  return (
    <aside
      aria-label="Store announcement"
      className="w-full h-9 bg-[#111111] text-[#E4E0D8] text-xs font-normal flex items-center justify-center px-4 tracking-normal border-b border-[#111111] select-none"
    >
      <span className="truncate">Free pickup in Nairobi CBD. Nationwide delivery.</span>
    </aside>
  );
}
