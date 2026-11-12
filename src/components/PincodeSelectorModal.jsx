import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { MapPin, X, Check, AlertCircle, RefreshCw, Undo2, ShieldCheck } from 'lucide-react';

export default function PincodeSelectorModal({ isOpen, onClose }) {
  const { 
    effectivePincode, 
    tempPincode, 
    isTempPincode, 
    user, 
    setDeliveryPincode, 
    clearTempPincode, 
    clearDeliveryPincode,
    isPincodeLoading
  } = useCart();

  const [inputPin, setInputPin] = useState(effectivePincode || '');
  const [saveToProfile, setSaveToProfile] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputPin(effectivePincode || '');
      setErrorMsg('');
      setSuccessMsg('');
      setSaveToProfile(!user?.pincode);
    }
  }, [isOpen, effectivePincode, user]);

  if (!isOpen) return null;

  const handleApply = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPin = String(inputPin || '').trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setErrorMsg('Please enter a valid 6-digit postal pincode.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await setDeliveryPincode(cleanPin, user ? saveToProfile : false);
      if (res && res.success) {
        setSuccessMsg(`Delivery prices updated for pincode ${cleanPin}!`);
        setTimeout(() => {
          onClose();
        }, 700);
      } else {
        setErrorMsg(res?.message || 'Failed to apply pincode.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error applying pincode.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevertToProfile = () => {
    clearTempPincode();
    setSuccessMsg(`Reverted back to your saved profile pincode (${user.pincode}).`);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const handleClear = () => {
    clearDeliveryPincode();
    setInputPin('');
    setSuccessMsg('Pincode cleared. Showing default store prices.');
    setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 relative space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#128C7E] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black font-serif text-black uppercase text-base tracking-wide">
              Delivery Location
            </h3>
            <p className="text-xs text-gray-500">
              Enter delivery pincode to see accurate product pricing
            </p>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Current status banner */}
        {effectivePincode && (
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/70 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Active Pincode:</span>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                {effectivePincode}
              </span>
            </div>

            {isTempPincode && user?.pincode && (
              <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
                <span className="text-[11px] text-amber-800">
                  Temporary (Profile: {user.pincode})
                </span>
                <button
                  type="button"
                  onClick={handleRevertToProfile}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#128C7E] hover:underline cursor-pointer"
                >
                  <Undo2 className="w-3 h-3" />
                  Revert to Profile
                </button>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleApply} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-700 block">
              Enter 6-Digit Delivery Pincode
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                maxLength={6}
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 600017"
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-[#128C7E]/20 focus:border-[#128C7E]"
              />
            </div>
          </div>

          {/* Logged-in customer option */}
          {user ? (
            <div className="space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-700 select-none">
                <input
                  type="checkbox"
                  checked={saveToProfile}
                  onChange={(e) => setSaveToProfile(e.target.checked)}
                  className="rounded text-[#128C7E] focus:ring-[#128C7E] mt-0.5"
                />
                <span>
                  Save this as my default profile delivery pincode
                  <span className="block text-[10px] text-gray-400">
                    (Otherwise applies temporarily for this session)
                  </span>
                </span>
              </label>
            </div>
          ) : (
            <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
              Guest pincode is saved in this browser for quick visits.
            </p>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2">
            {effectivePincode && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving || isPincodeLoading || inputPin.length !== 6}
              className="flex-1 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {(isSaving || isPincodeLoading) ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Updating Prices...
                </>
              ) : (
                'Check & Apply Pincode'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

