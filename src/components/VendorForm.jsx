import React, { useState } from "react";

export default function VendorForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    business_name: "",
    phone: "",
    category: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/vendors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to create vendor");
      onCreated && onCreated(data.id);
      setForm({ name: "", email: "", business_name: "", phone: "", category: "", website: "" });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="input" placeholder="Contact name" name="name" value={form.name} onChange={handleChange} required />
        <input className="input" placeholder="Email" name="email" value={form.email} onChange={handleChange} required />
      </div>
      <input className="input" placeholder="Business name" name="business_name" value={form.business_name} onChange={handleChange} required />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="input" placeholder="Phone" name="phone" value={form.phone} onChange={handleChange} />
        <input className="input" placeholder="Category" name="category" value={form.category} onChange={handleChange} />
        <input className="input" placeholder="Website" name="website" value={form.website} onChange={handleChange} />
      </div>
      <button disabled={loading} className="btn-primary">
        {loading ? "Creating..." : "Create vendor"}
      </button>
    </form>
  );
}
