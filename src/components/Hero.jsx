import React from "react";

export default function Hero({ onCreateVendor }) {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
        Vendor CRM
      </h1>
      <p className="text-blue-200/90 mb-6">
        Onboard vendors, manage contacts and deals, and keep notes — all in one place.
      </p>
      <button
        onClick={onCreateVendor}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition"
      >
        Quick Onboard Sample Vendor
      </button>
    </div>
  );
}
