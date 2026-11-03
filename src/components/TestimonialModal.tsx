import React from 'react';
import { Student } from '../types';
import { enrichStudentProfile } from '../adminAdvancedService';
import { Printer, X, Award, ShieldCheck } from 'lucide-react';

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const TestimonialModal: React.FC<TestimonialModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!isOpen || !student) return null;

  const enriched = enrichStudentProfile(student);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-gray-300 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Action Bar */}
        <div className="bg-[#14294b] text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#d9b84a]" />
            <span className="font-bold text-sm">Official School Testimonial & Certified Transcript</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d9b84a] hover:bg-[#c4a53d] text-[#14294b] font-bold text-xs rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Testimonial</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonial Document (Embossed style) */}
        <div className="p-10 bg-[#fdfcf9] text-gray-900 font-serif border-[12px] border-double border-[#14294b]/20 m-4 rounded-xl print:m-0 print:border-none print:p-0">
          {/* Header */}
          <div className="text-center border-b-2 border-[#14294b] pb-6">
            <div className="flex justify-center items-center gap-4 mb-2">
              <img
                src="/logo.jpg"
                alt="NKAS Logo"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#d9b84a] shadow-xs"
              />
              <div>
                <div className="text-[10px] font-sans font-bold tracking-widest text-gray-500 uppercase">
                  Republic of Ghana &bull; Ghana Education Service
                </div>
                <h1 className="text-xl font-bold tracking-tight text-[#14294b] uppercase font-sans">
                  NKROFUL AGRICULTURAL SECONDARY TECHNICAL SCHOOL
                </h1>
                <p className="text-xs text-gray-600 font-sans italic">
                  Motto: Knowledge &bull; Discipline &bull; Service
                </p>
                <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                  P.O. Box 15, Nkroful, Ellemabelle District, Western Region, Ghana
                </p>
              </div>
            </div>

            <div className="inline-block mt-2 px-6 py-1 bg-[#14294b] text-white font-sans text-xs font-black uppercase tracking-widest rounded-full">
              STUDENT TESTIMONIAL & CONDUCT CERTIFICATE
            </div>
          </div>

          {/* Testimonial Content */}
          <div className="py-6 space-y-4 text-sm leading-relaxed text-gray-800">
            <div className="flex justify-between items-center text-xs font-sans border-b border-gray-200 pb-2">
              <div>
                <strong>Date Issued:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div>
                <strong>Ref. No:</strong> NKAS/TEST/2026/{enriched.student_id.replace(/\D/g, '').slice(-4)}
              </div>
            </div>

            <p>
              This is to certify that{' '}
              <strong className="underline uppercase tracking-wide font-sans">{enriched.full_name}</strong>{' '}
              (Student ID No:{' '}
              <span className="font-mono font-bold text-blue-900">{enriched.student_id}</span>, Ghana Card PIN:{' '}
              <span className="font-mono">{enriched.ghana_card_pin}</span>) was a duly registered and enrolled student of Nkroful Agricultural Secondary Technical School.
            </p>

            <div className="bg-white p-4 rounded-lg border border-gray-200 font-sans text-xs grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Programme of Study</span>
                <span className="font-semibold text-gray-900">{enriched.programme}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Current Class Level</span>
                <span className="font-semibold text-gray-900">{enriched.class}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">House of Affiliation</span>
                <span className="font-semibold text-gray-900">{enriched.house}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Date of Birth</span>
                <span className="font-semibold text-gray-900">{enriched.date_of_birth || '15th April, 2008'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Gender</span>
                <span className="font-semibold text-gray-900">{enriched.gender}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Enrollment Status</span>
                <span className="font-bold text-emerald-700">In Good Standing</span>
              </div>
            </div>

            <p>
              During their period in this institution, <strong>{enriched.full_name}</strong> showed exemplary dedication to academic coursework, practical field training, and workshop assignments. Their conduct was{' '}
              <strong className="italic">very good and obedient</strong>, adhering strictly to the disciplinary code and ethos of the Ghana Education Service.
            </p>

            <div className="space-y-1 text-xs font-sans bg-slate-50 p-3.5 rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900 mb-1">Official Remarks:</div>
              <div>&bull; <strong>Academic Aptitude:</strong> Consistently maintains solid performance across core and elective subjects.</div>
              <div>&bull; <strong>Character & Demeanor:</strong> Honest, respectful to school authorities and peers, and participates constructively in communal tasks.</div>
              <div>&bull; <strong>Co-Curricular:</strong> Active member of the School STEM & Robotics Technical Society and Agricultural Demonstration Unit.</div>
            </div>

            <p>
              We recommend <strong>{enriched.full_name}</strong> without reservation for any educational advancement, tertiary entrance, scholarship consideration, or position of trust they may seek.
            </p>
          </div>

          {/* Endorsement Seals */}
          <div className="pt-8 border-t-2 border-[#14294b] grid grid-cols-2 gap-8 items-end font-sans text-xs">
            <div>
              <div className="w-24 h-24 rounded-full border-2 border-[#14294b] flex items-center justify-center text-center p-2 text-[9px] font-bold text-[#14294b] uppercase rotate-[-6deg] bg-blue-50/30">
                <span>NKROFUL ASTS<br />OFFICIAL SEAL<br />★ 1974 ★</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Institutional Stamp</p>
            </div>

            <div className="text-right">
              <div className="border-b border-gray-400 w-48 ml-auto mb-1"></div>
              <p className="font-bold text-sm text-gray-900">Dr. Kwabena Nkansah</p>
              <p className="text-xs text-gray-600">Headmaster</p>
              <p className="text-[10px] text-gray-400">Nkroful Agricultural Sec. Tech. School</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
