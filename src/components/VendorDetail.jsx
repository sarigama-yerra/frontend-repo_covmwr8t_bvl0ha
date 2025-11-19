import React, { useEffect, useState } from "react";

function Section({ title, children, action }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function VendorDetail({ vendor }) {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [notes, setNotes] = useState([]);

  const load = async () => {
    const base = import.meta.env.VITE_BACKEND_URL;
    const [cRes, dRes, nRes] = await Promise.all([
      fetch(`${base}/contacts?vendor_id=${vendor.id}`),
      fetch(`${base}/deals?vendor_id=${vendor.id}`),
      fetch(`${base}/notes?vendor_id=${vendor.id}`),
    ]);
    setContacts(await cRes.json());
    setDeals(await dRes.json());
    setNotes(await nRes.json());
  };

  useEffect(() => { load(); }, [vendor.id]);

  const quickAdd = async (type) => {
    const base = import.meta.env.VITE_BACKEND_URL;
    if (type === 'contact') {
      await fetch(`${base}/contacts`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ vendor_id: vendor.id, name: 'New Contact', email: '', phone: '', role: '' })});
    } else if (type === 'deal') {
      await fetch(`${base}/deals`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ vendor_id: vendor.id, title: 'New Deal', value: 0, stage: 'lead', notes: '' })});
    } else if (type === 'note') {
      await fetch(`${base}/notes`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ vendor_id: vendor.id, content: 'New note', author: 'System' })});
    }
    await load();
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
        <div className="text-lg font-semibold text-white">{vendor.business_name}</div>
        <div className="text-blue-200/80">{vendor.name} • {vendor.email}</div>
      </div>

      <Section title="Contacts" action={<button className="btn-secondary" onClick={()=>quickAdd('contact')}>Add</button>}>
        <ul className="space-y-2">
          {contacts.map(c => (
            <li key={c.id} className="text-blue-200/90">{c.name} {c.email ? `• ${c.email}`: ''}</li>
          ))}
          {contacts.length===0 && <div className="text-blue-200/60">No contacts yet</div>}
        </ul>
      </Section>

      <Section title="Deals" action={<button className="btn-secondary" onClick={()=>quickAdd('deal')}>Add</button>}>
        <ul className="space-y-2">
          {deals.map(d => (
            <li key={d.id} className="text-blue-200/90">{d.title} • ${'{'}d.value{'}'} • {d.stage}</li>
          ))}
          {deals.length===0 && <div className="text-blue-200/60">No deals yet</div>}
        </ul>
      </Section>

      <Section title="Notes" action={<button className="btn-secondary" onClick={()=>quickAdd('note')}>Add</button>}>
        <ul className="space-y-2">
          {notes.map(n => (
            <li key={n.id} className="text-blue-200/90">{n.content}</li>
          ))}
          {notes.length===0 && <div className="text-blue-200/60">No notes yet</div>}
        </ul>
      </Section>
    </div>
  );
}
