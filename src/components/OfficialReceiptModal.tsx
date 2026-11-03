import React from 'react';
import { Fee, Student } from '../types';
import { Printer, Download, CheckCircle, ShieldCheck, X } from 'lucide-react';

interface OfficialReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: Fee | null;
  student: Student | undefined;
}

export const OfficialReceiptModal: React.FC<OfficialReceiptModalProps> = ({
  isOpen,
  onClose,
  fee,
  student,
}) => {
  if (!isOpen || !fee) return null;

  const handlePrint = () => {
    window.print();
  };

  const receiptSerial = fee.receipt_no || `NKAS-GES-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-300 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Action Header (Hidden during Print) */}
        <div className="bg-[#14294b] text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#d9b84a]" />
            <span className="font-bold text-sm">Official G.E.S. Security Payment Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d9b84a] hover:bg-[#c4a53d] text-[#14294b] font-bold text-xs rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 bg-[#fafaf9] print:p-0 print:bg-white text-gray-900 font-sans border-8 border-double border-[#14294b]/20 m-3 rounded-xl print:m-0 print:border-none">
          {/* Header */}
          <div className="text-center border-b-2 border-[#14294b] pb-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <img src="/logo.jpg" alt="NKAS Crest" className="w-14 h-14 rounded-full object-cover shadow-sm border border-gray-300" />
              <div>
                <div className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                  Republic of Ghana &bull; Ministry of Education
                </div>
                <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Ghana Education Service (G.E.S)
                </div>
                <h1 className="text-lg font-black text-[#14294b] tracking-wide mt-0.5">
                  NKROFUL AGRICULTURAL SECONDARY TECHNICAL SCHOOL
                </h1>
                <p className="text-[10px] text-gray-500 font-medium">
                  P.O. Box 15, Nkroful, Ellemabelle District, Western Region &bull; Tel: +233 24 333 4455
                </p>
              </div>
            </div>
            
            <div className="inline-block bg-[#14294b] text-white text-[11px] font-extrabold uppercase tracking-widest px-6 py-1 rounded-full shadow-xs mt-1">
              Official Bursary Payment Receipt
            </div>
          </div>

          {/* Receipt Serial & Date Grid */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-gray-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Receipt Serial No.</span>
              <span className="font-mono text-base font-black text-blue-900">{receiptSerial}</span>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified System Transaction</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Date & Time Issued</span>
              <span className="font-semibold text-gray-800">{fee.created_at}</span>
              <div className="text-[10px] text-gray-500 mt-1">
                Term: <span className="font-bold text-gray-700">{fee.term || '2026/2027 Term 1'}</span>
              </div>
            </div>
          </div>

          {/* Student Info Box */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 my-4 text-xs space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Student Name:</span>
                <p className="font-bold text-sm text-gray-900">{student?.full_name || 'Kwesi Mensah'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Student ID / Index:</span>
                <p className="font-mono font-bold text-sm text-blue-900">{fee.student_id}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-[11px]">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Class Level:</span>
                <p className="font-semibold text-gray-800">{student?.class || 'Form 2'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Programme:</span>
                <p className="font-semibold text-gray-800 truncate">{student?.programme || 'General Agriculture'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">House:</span>
                <p className="font-semibold text-gray-800">{student?.house || 'Nkrumah House (House 1)'}</p>
              </div>
            </div>
          </div>

          {/* Payment Itemization Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden my-4 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-gray-600 font-bold uppercase text-[10px] border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-4">Item Description</th>
                  <th className="py-2.5 px-4 text-center">Payment Channel</th>
                  <th className="py-2.5 px-4 text-right">Amount (GHS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    <div>{fee.description}</div>
                    <span className="text-[10px] text-gray-400 font-normal">
                      Continuous Academic Session &bull; NKAS Free SHS Auxiliary Account
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-gray-700">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {fee.payment_method || 'Cash Receipt (Bursary)'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-base text-gray-900 font-mono">
                    GHS {fee.amount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200 font-bold">
                <tr>
                  <td colSpan={2} className="py-3 px-4 text-right text-gray-700 uppercase text-xs">
                    Total Amount Paid:
                  </td>
                  <td className="py-3 px-4 text-right text-base text-emerald-800 font-mono">
                    GHS {fee.amount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Official Verification Seal & Signatures */}
          <div className="pt-4 grid grid-cols-3 gap-4 items-end text-xs">
            {/* Barcode & Verification */}
            <div>
              <div className="font-mono text-[9px] tracking-widest text-gray-500 mb-1">
                SECURITY VERIFICATION BARCODE:
              </div>
              <div className="bg-white p-2 border border-gray-300 rounded inline-block">
                <div className="font-mono text-xs tracking-widest font-black text-black scale-y-125">
                  ||| | |||| || ||| |||| | ||||| | ||
                </div>
                <div className="text-[9px] font-mono text-center text-gray-500 mt-1">{receiptSerial}</div>
              </div>
            </div>

            {/* Official Stamp */}
            <div className="text-center">
              <div className="inline-block border-2 border-emerald-800/60 rounded-full p-2 text-emerald-900 font-black text-[9px] uppercase tracking-tighter rotate-[-6deg] bg-emerald-50/50">
                <div>NKROFUL ASTS BURSARY</div>
                <div className="text-[11px] font-black text-emerald-700">★ PAID ★</div>
                <div className="text-[8px] font-normal">{new Date().toLocaleDateString('en-GB')}</div>
              </div>
            </div>

            {/* Cashier Signature */}
            <div className="text-right">
              <div className="border-b border-gray-400 w-36 ml-auto mb-1"></div>
              <p className="font-bold text-xs text-gray-900">{fee.recorded_by || 'Bursar (Mrs. E. Kwofie)'}</p>
              <p className="text-[10px] text-gray-500">Authorized Bursary Officer</p>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="mt-6 pt-3 border-t border-gray-200 text-center text-[9px] text-gray-400 uppercase tracking-widest">
            Original Copy &bull; Generated by NKAS Enterprise School Management Portal &bull; Retain for Audit
          </div>
        </div>
      </div>
    </div>
  );
};
