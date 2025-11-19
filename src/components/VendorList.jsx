import React, { useEffect, useState } from "react";

export default function VendorList({ onSelect }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");

  const load = async () => {
    const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/vendors`);
    if (q) url.searchParams.set("q", q);
    const res = await fetch(url);
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input className="input flex-1" placeholder="Search business name" value={q} onChange={(e)=>setQ(e.target.value)} />
        <button onClick={load} className="btn-secondary">Search</button>
      </div>
      <ul className="divide-y divide-slate-700/50 rounded-lg overflow-hidden border border-slate-700/50">
        {items.map(v => (
          <li key={v.id} className="p-3 hover:bg-slate-800/60 cursor-pointer" onClick={()=>onSelect && onSelect(v)}>
            <div className="font-medium text-white">{v.business_name}</div>
            <div className="text-sm text-blue-200/80">{v.name} • {v.email}</div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="p-4 text-center text-blue-200/60">No vendors found</li>
        )}
      </ul>
    </div>
  );
}
