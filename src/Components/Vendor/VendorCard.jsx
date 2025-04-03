import React from "react";

const VendorCard = ({ vendor }) => {
  return (
    <div className="w-full rounded-xl border border-white/10 bg-[#353839]  text-white flex flex-col">
      <div className="p-6">
        <div className="flex justify-between items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-white tracking-wide">{vendor.Name}</h2>
          <div 
            className={`px-4 py-2 rounded-lg ${
              vendor.TotalDue > 0 
                ? 'bg-red-500/20 text-red-300' 
                : 'bg-green-500/20 text-green-300'
            }`}
          >
            <span className="font-semibold whitespace-nowrap">
              ₹{Math.abs(vendor.TotalDue)?.toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="mt-4 space-y-4 bg-black/40 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-100">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-400">
                📱
              </span>
              <span className="text-gray-200 font-medium">
                {vendor.ContactInfo?.Phone || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-400">
                📍
              </span>
              <span className="text-gray-200 font-medium">
                {vendor.ContactInfo?.Address || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
