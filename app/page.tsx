"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { fmtDate, uid } from "@/lib/mockDb";
import { Drawer } from "@/lib/types";
import DrawerTile from "@/components/DrawerTile";
import AddDrawerTile from "@/components/AddDrawerTile";
import AddDrawerModal from "@/components/AddDrawerModal";

export default function DashboardPage() {
  const { drawers } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="anim-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-mono font-bold text-2xl text-slate-900 tracking-tight">
            Přehled šuplíků
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {drawers.length} {drawers.length === 1 ? "šuplík" : drawers.length < 5 ? "šuplíky" : "šuplíků"} v systému
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {drawers.map((drawer) => (
          <DrawerTile key={drawer.id} drawer={drawer} />
        ))}
        <AddDrawerTile onClick={() => setIsModalOpen(true)} />
      </div>

      <AddDrawerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
