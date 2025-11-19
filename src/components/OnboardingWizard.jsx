import React, { useMemo, useState } from "react";

const stages = ["Prospect", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

export default function OnboardingWizard({ open, onClose, onCompleted }) {
  const base = useMemo(() => import.meta.env.VITE_BACKEND_URL, []);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [vendor, setVendor] = useState({
    business_name: "",
    name: "",
    email: "",
    phone: "",
    category: "",
    website: "",
  });
  const [createdVendor, setCreatedVendor] = useState(null);

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
  });

  const [deal, setDeal] = useState({
    title: "",
    value: "",
    currency: "USD",
    stage: "Prospect",
  });

  const [note, setNote] = useState({ content: "" });

  if (!open) return null;

  const reset = () => {
    setStep(1);
    setLoading(false);
    setError("");
    setVendor({ business_name: "", name: "", email: "", phone: "", category: "", website: "" });
    setCreatedVendor(null);
    setContact({ name: "", email: "", phone: "", title: "" });
    setDeal({ title: "", value: "", currency: "USD", stage: "Prospect" });
    setNote({ content: "" });
  };

  const handleClose = () => {
    reset();
    onClose && onClose();
  };

  const createVendor = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${base}/vendors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendor),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to create vendor");
      setCreatedVendor(data);
      setStep(2);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const createContact = async () => {
    if (!contact.name && !contact.email && !contact.phone) {
      // Skip if empty
      setStep(3);
      return;
    }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${base}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contact, vendor_id: createdVendor.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to add contact");
      setStep(3);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const createDeal = async () => {
    if (!deal.title) {
      setStep(4);
      return;
    }
    setLoading(true); setError("");
    try {
      const payload = { ...deal, value: deal.value ? Number(deal.value) : 0, vendor_id: createdVendor.id };
      const res = await fetch(`${base}/deals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to create deal");
      setStep(4);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    if (!note.content.trim()) {
      finish();
      return;
    }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${base}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...note, vendor_id: createdVendor.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to add note");
      finish();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const finish = () => {
    const v = createdVendor;
    reset();
    onCompleted && onCompleted(v);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="text-white font-semibold">Vendor Onboarding</div>
          <button onClick={handleClose} className="text-blue-200 hover:text-white">✕</button>
        </div>

        <div className="px-5 py-4">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            {[1,2,3,4].map((s)=> (
              <div key={s} className={`flex-1 h-1 rounded ${step>=s? 'bg-blue-500':'bg-slate-700'}`} />
            ))}
          </div>

          {error && (
            <div className="mb-3 text-red-400 bg-red-400/10 border border-red-400/30 px-3 py-2 rounded">{error}</div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-blue-200/80 text-sm">Start by adding the vendor's basic info.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="input" placeholder="Business name" value={vendor.business_name} onChange={e=>setVendor(v=>({...v,business_name:e.target.value}))} />
                <input className="input" placeholder="Category" value={vendor.category} onChange={e=>setVendor(v=>({...v,category:e.target.value}))} />
                <input className="input" placeholder="Primary contact name" value={vendor.name} onChange={e=>setVendor(v=>({...v,name:e.target.value}))} />
                <input className="input" placeholder="Primary contact email" value={vendor.email} onChange={e=>setVendor(v=>({...v,email:e.target.value}))} />
                <input className="input" placeholder="Phone" value={vendor.phone} onChange={e=>setVendor(v=>({...v,phone:e.target.value}))} />
                <input className="input" placeholder="Website" value={vendor.website} onChange={e=>setVendor(v=>({...v,website:e.target.value}))} />
              </div>
              <div className="flex justify-end gap-2">
                <button disabled={loading} onClick={createVendor} className="btn-primary disabled:opacity-60">{loading? 'Creating…':'Save & Continue'}</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-blue-200/80 text-sm">Add a primary contact (optional). You can skip this step.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="input" placeholder="Name" value={contact.name} onChange={e=>setContact(c=>({...c,name:e.target.value}))} />
                <input className="input" placeholder="Email" value={contact.email} onChange={e=>setContact(c=>({...c,email:e.target.value}))} />
                <input className="input" placeholder="Phone" value={contact.phone} onChange={e=>setContact(c=>({...c,phone:e.target.value}))} />
                <input className="input" placeholder="Title / Role" value={contact.title} onChange={e=>setContact(c=>({...c,title:e.target.value}))} />
              </div>
              <div className="flex justify-between">
                <button disabled={loading} onClick={()=>setStep(1)} className="btn-secondary">Back</button>
                <div className="flex gap-2">
                  <button disabled={loading} onClick={()=>setStep(3)} className="btn-secondary">Skip</button>
                  <button disabled={loading} onClick={createContact} className="btn-primary disabled:opacity-60">{loading? 'Saving…':'Save & Continue'}</button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-blue-200/80 text-sm">Create a first deal to track in your pipeline (optional).</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="input" placeholder="Deal title" value={deal.title} onChange={e=>setDeal(d=>({...d,title:e.target.value}))} />
                <input className="input" placeholder="Value" type="number" value={deal.value} onChange={e=>setDeal(d=>({...d,value:e.target.value}))} />
                <input className="input" placeholder="Currency" value={deal.currency} onChange={e=>setDeal(d=>({...d,currency:e.target.value}))} />
                <select className="input" value={deal.stage} onChange={e=>setDeal(d=>({...d,stage:e.target.value}))}>
                  {stages.map(s=> <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex justify-between">
                <button disabled={loading} onClick={()=>setStep(2)} className="btn-secondary">Back</button>
                <div className="flex gap-2">
                  <button disabled={loading} onClick={()=>setStep(4)} className="btn-secondary">Skip</button>
                  <button disabled={loading} onClick={createDeal} className="btn-primary disabled:opacity-60">{loading? 'Saving…':'Save & Continue'}</button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <p className="text-blue-200/80 text-sm">Leave a note to capture any context (optional).</p>
              <textarea className="input h-28" placeholder="Note content" value={note.content} onChange={e=>setNote({content:e.target.value})} />
              <div className="flex justify-between">
                <button disabled={loading} onClick={()=>setStep(3)} className="btn-secondary">Back</button>
                <div className="flex gap-2">
                  <button disabled={loading} onClick={finish} className="btn-secondary">Skip</button>
                  <button disabled={loading} onClick={createNote} className="btn-primary disabled:opacity-60">{loading? 'Saving…':'Finish'}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
