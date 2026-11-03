import React, { useState } from 'react';
import { Student } from '../types';
import { enrichStudentProfile } from '../adminAdvancedService';
import { Printer, X, RefreshCw, Shield, QrCode } from 'lucide-react';

interface StudentIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const StudentIdCardModal: React.FC<StudentIdCardModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');

  if (!isOpen || !student) return null;

  const enriched = enrichStudentProfile(student);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-300 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header bar */}
        <div className="bg-[#14294b] text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#d9b84a]" />
            <span className="font-bold text-sm">Official Student PVC ID Badge</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a66] hover:bg-[#2b4c7e] text-white text-xs font-semibold rounded-lg transition-colors border border-blue-400/30"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Flip ({cardSide === 'front' ? 'Show Back' : 'Show Front'})</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d9b84a] hover:bg-[#c4a53d] text-[#14294b] font-bold text-xs rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Badge</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card Stage */}
        <div className="p-8 bg-slate-100 flex flex-col items-center justify-center print:p-0 print:bg-white">
          {/* CR-80 Standard ID Card (Aspect ratio 85.6mm x 53.98mm ~ 1.586) */}
          <div className="w-[380px] h-[240px] bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200 relative flex flex-col justify-between select-none print:shadow-none print:border print:border-gray-400">
            {cardSide === 'front' ? (
              // FRONT OF ID CARD
              <div className="h-full flex flex-col justify-between">
                {/* Top Banner */}
                <div className="bg-[#14294b] p-3 text-white flex items-center gap-3 border-b-2 border-[#d9b84a]">
                  <img
                    src="/logo.jpg"
                    alt="NKAS Logo"
                    className="w-10 h-10 rounded-full object-cover border border-[#d9b84a] shadow-xs"
                  />
                  <div className="flex-1 leading-tight">
                    <div className="text-[7.5px] font-bold text-[#d9b84a] tracking-widest uppercase">
                      GHANA EDUCATION SERVICE &bull; G.E.S
                    </div>
                    <div className="text-[10px] font-black tracking-tight text-white uppercase">
                      NKROFUL AGRIC. SEC. TECH. SCHOOL
                    </div>
                    <div className="text-[7px] text-gray-300 font-medium">
                      P.O. Box 15, Nkroful &bull; Western Region
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-3.5 flex gap-3.5 items-center flex-1">
                  {/* Photo frame */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-24 rounded-lg bg-slate-200 border-2 border-[#14294b] overflow-hidden flex items-center justify-center text-gray-400 shadow-inner">
                      <div className="text-center">
                        <div className="w-10 h-10 mx-auto rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center text-sm">
                          {enriched.full_name.charAt(0)}
                        </div>
                        <span className="text-[8px] font-semibold text-gray-500 mt-1 block">OFFICIAL</span>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold text-blue-900 font-mono mt-1">
                      {enriched.student_id}
                    </span>
                  </div>

                  {/* Info Column */}
                  <div className="flex-1 space-y-1 text-left">
                    <div>
                      <span className="text-[8px] uppercase font-bold text-gray-400 block leading-none">
                        Student Full Name
                      </span>
                      <h4 className="text-xs font-black text-gray-900 leading-tight">
                        {enriched.full_name}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-1 pt-0.5">
                      <div>
                        <span className="text-[7.5px] uppercase font-bold text-gray-400 block leading-none">
                          Class
                        </span>
                        <p className="text-[10px] font-bold text-gray-800">{enriched.class}</p>
                      </div>
                      <div>
                        <span className="text-[7.5px] uppercase font-bold text-gray-400 block leading-none">
                          Gender
                        </span>
                        <p className="text-[10px] font-bold text-gray-800">{enriched.gender}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-[7.5px] uppercase font-bold text-gray-400 block leading-none">
                        Programme
                      </span>
                      <p className="text-[9.5px] font-semibold text-gray-800 truncate">
                        {enriched.programme}
                      </p>
                    </div>

                    <div>
                      <span className="text-[7.5px] uppercase font-bold text-gray-400 block leading-none">
                        House of Affiliation
                      </span>
                      <p className="text-[9px] font-bold text-[#14294b] truncate">
                        {enriched.house}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Strip with Barcode */}
                <div className="bg-slate-100 px-3 py-1.5 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-1 font-mono text-[8px] text-gray-600">
                    <span className="font-bold">GH-CARD:</span>
                    <span>{enriched.ghana_card_pin}</span>
                  </div>
                  <div className="font-mono text-[9px] tracking-widest text-black font-black scale-y-110">
                    ||| | |||| || ||| ||||
                  </div>
                </div>
              </div>
            ) : (
              // BACK OF ID CARD
              <div className="h-full flex flex-col justify-between p-4 bg-slate-50 text-[9px] text-gray-700">
                <div className="border-b border-gray-200 pb-2 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-gray-900 uppercase text-[10px]">Security Information</h5>
                    <p className="text-[8px] text-gray-500">Property of Nkroful ASTS</p>
                  </div>
                  <div className="w-10 h-10 border border-gray-300 rounded bg-white flex items-center justify-center p-0.5">
                    <QrCode className="w-8 h-8 text-[#14294b]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 my-2">
                  <div>
                    <span className="text-[7.5px] uppercase font-bold text-gray-400 block">Date of Birth</span>
                    <span className="font-semibold text-gray-900">{enriched.date_of_birth || '2008-04-15'}</span>
                  </div>
                  <div>
                    <span className="text-[7.5px] uppercase font-bold text-gray-400 block">Blood Group</span>
                    <span className="font-bold text-red-700">{enriched.blood_group}</span>
                  </div>
                  <div>
                    <span className="text-[7.5px] uppercase font-bold text-gray-400 block">Emergency Contact</span>
                    <span className="font-semibold text-gray-900">{enriched.guardian_phone || '+233 24 456 7890'}</span>
                  </div>
                  <div>
                    <span className="text-[7.5px] uppercase font-bold text-gray-400 block">Expiry Date</span>
                    <span className="font-semibold text-gray-900">31st August 2027</span>
                  </div>
                </div>

                <div className="text-[7.5px] text-gray-500 leading-tight bg-white p-2 rounded border border-gray-200">
                  This card remains the property of NKAS. It must be surrendered on completion of studies or withdrawal. If found, please return to NKAS Administration or the nearest police station.
                </div>

                <div className="flex items-end justify-between pt-1 border-t border-gray-200 text-[8px]">
                  <div>
                    <span className="text-gray-400">Hotline:</span> +233 24 333 4455
                  </div>
                  <div className="text-right">
                    <div className="border-b border-gray-400 w-24 ml-auto mb-0.5"></div>
                    <span className="font-bold text-gray-900">Headmaster's Signature</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center print:hidden">
            Click <strong>Flip</strong> to inspect both sides of the standard PVC card before printing.
          </p>
        </div>
      </div>
    </div>
  );
};
