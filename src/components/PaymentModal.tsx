import React, { useState } from 'react';
import { Student } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  onPaymentSuccess: (amount: number, description: string, method: 'Mobile Money' | 'Bank Deposit' | 'Cash Receipt') => void;
  pendingAmount: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  student,
  onPaymentSuccess,
  pendingAmount,
}) => {
  const [amount, setAmount] = useState<number>(pendingAmount > 0 ? pendingAmount : 150);
  const [description, setDescription] = useState('School Fees & Practical Consumables');
  const [method, setMethod] = useState<'Mobile Money' | 'Bank Deposit' | 'Cash Receipt'>('Mobile Money');
  const [momoNetwork, setMomoNetwork] = useState('MTN Mobile Money');
  const [phoneNumber, setPhoneNumber] = useState('0244123456');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<{ receiptNo: string; date: string } | null>(null);

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const receiptNo = `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const date = new Date().toLocaleString();
      setReceipt({ receiptNo, date });
      onPaymentSuccess(amount, description, method);
    }, 1200);
  };

  const handleDone = () => {
    setReceipt(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#14294b] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-money-bill-wave text-yellow-400"></i>
            <h3 className="font-bold text-base">Make Fee Payment</h3>
          </div>
          {!isProcessing && (
            <button
              onClick={handleDone}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          )}
        </div>

        {receipt ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              <i className="fa-solid fa-check"></i>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-1">Payment Successful!</h4>
            <p className="text-sm text-gray-600 mb-4">
              Your fee payment has been officially recorded in the NKAS finance ledger.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Student Name:</span>
                <span className="font-semibold text-gray-900">{student.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Student ID:</span>
                <span className="font-mono font-semibold text-blue-900">{student.student_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Receipt No:</span>
                <span className="font-mono font-bold text-gray-900">{receipt.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount Paid:</span>
                <span className="font-bold text-emerald-700 text-sm">GHS {amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Channel:</span>
                <span className="font-semibold text-gray-900">{method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date & Time:</span>
                <span className="text-gray-700">{receipt.date}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDone}
              className="custom-btn w-full text-sm font-semibold"
            >
              Done & Return to Fees
            </button>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex items-center justify-between">
              <div>
                <span className="text-gray-600 block">Paying for:</span>
                <span className="font-bold">{student.full_name} ({student.student_id})</span>
              </div>
              {pendingAmount > 0 && (
                <div className="text-right">
                  <span className="text-gray-600 block">Outstanding:</span>
                  <span className="font-bold text-red-600">GHS {pendingAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Mobile Money', 'Bank Deposit', 'Cash Receipt'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all ${
                      method === m
                        ? 'bg-[#153c78] text-white border-[#153c78] font-bold shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {m === 'Mobile Money' && <i className="fa-solid fa-mobile-screen mr-1"></i>}
                    {m === 'Bank Deposit' && <i className="fa-solid fa-building-columns mr-1"></i>}
                    {m === 'Cash Receipt' && <i className="fa-solid fa-receipt mr-1"></i>}
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {method === 'Mobile Money' && (
              <div className="space-y-3 p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
                <div>
                  <label className="block text-xs font-semibold text-amber-900 mb-1">
                    Select Network
                  </label>
                  <select
                    value={momoNetwork}
                    onChange={(e) => setMomoNetwork(e.target.value)}
                    className="w-full text-xs bg-white border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-600 outline-none"
                  >
                    <option>MTN Mobile Money</option>
                    <option>Telecel (Vodafone) Cash</option>
                    <option>AT (AirtelTigo) Money</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-900 mb-1">
                    Subscriber Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full text-xs bg-white border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-600 outline-none font-mono"
                    placeholder="024 XXX XXXX"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Amount to Pay (GHS)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-bold">GHS</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-12 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none font-bold text-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Fee Purpose / Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 outline-none"
                placeholder="e.g. First Term Tuition & PTA Dues"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing || amount <= 0}
                className="custom-btn w-full text-sm font-semibold flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-lock"></i>
                    <span>Pay GHS {amount.toFixed(2)} Securely</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
