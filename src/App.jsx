import React, { useState } from 'react'
import Hero from './components/Hero'
import VendorForm from './components/VendorForm'
import VendorList from './components/VendorList'
import VendorDetail from './components/VendorDetail'

function App() {
  const [selected, setSelected] = useState(null)

  const quickOnboard = async () => {
    const base = import.meta.env.VITE_BACKEND_URL
    const res = await fetch(`${base}/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alex Vendor',
        email: 'alex@example.com',
        business_name: 'Alex Supplies Co.',
        phone: '',
        category: 'Supplies',
        website: 'https://example.com'
      })
    })
    const data = await res.json()
    if (res.ok) {
      // After create, refresh vendor list by forcing re-render; selection handled in VendorList
      alert('Sample vendor created! Use the list to select it.')
    } else {
      alert(data.detail || 'Failed to create vendor')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />

      <div className="relative min-h-screen p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <Hero onCreateVendor={quickOnboard} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-4">
                <h2 className="text-white font-semibold mb-3">Onboard Vendor</h2>
                <VendorForm onCreated={(id)=>{
                  // Ideally refresh the list or auto-select; keep simple for now
                  alert('Vendor created! Find it in the list and click to view details.')
                }} />
              </div>

              <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-4">
                <h2 className="text-white font-semibold mb-3">Vendors</h2>
                <VendorList onSelect={setSelected} />
              </div>
            </div>

            <div className="md:col-span-2">
              {!selected ? (
                <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 h-full min-h-[320px] flex items-center justify-center text-blue-200/70">
                  Select a vendor from the list to manage contacts, deals, and notes.
                </div>
              ) : (
                <VendorDetail vendor={selected} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Utility styles */}
      <style>{`
        .input { @apply bg-slate-900/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500/40; }
        .btn-primary { @apply bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition; }
        .btn-secondary { @apply bg-slate-700/70 hover:bg-slate-700 text-white font-medium px-3 py-1.5 rounded-lg transition; }
      `}</style>
    </div>
  )
}

export default App
