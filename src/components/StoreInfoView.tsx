import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Video, 
  Volume2, 
  ShieldCheck, 
  CheckCircle2, 
  ListOrdered, 
  List, 
  BookMarked,
  Play,
  Square,
  Sparkles
} from 'lucide-react';

export const StoreInfoView: React.FC = () => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  // Web Speech API Pharmacist Audio Advisory (100% reliable in-browser audio playback)
  const handlePlayVoiceAdvisory = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingVoice) {
        window.speechSynthesis.cancel();
        setIsPlayingVoice(false);
        return;
      }

      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const message = new SpeechSynthesisUtterance(
        "Welcome to PharmaCare Chemists and Druggists. This is an official clinical advisory from our chief registered pharmacist. Please ensure you always complete your prescribed antibiotic course, even if your symptoms improve early. Take prescribed tablets with clean water after meals, and keep biological medicines like insulin refrigerated between 2 to 8 degrees Celsius. Our 24 by 7 emergency pharmacy helpline is always available."
      );
      message.rate = 0.95;
      message.pitch = 1.0;
      message.onend = () => setIsPlayingVoice(false);
      message.onerror = () => setIsPlayingVoice(false);

      setIsPlayingVoice(true);
      window.speechSynthesis.speak(message);
    } else {
      alert("Browser speech synthesizer is initializing.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Store Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600" />
            PharmaCare Dispensary &amp; Patient Advisory Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered chemist, clinical storage protocols, cold-chain guidelines, and community health resources.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono shrink-0">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold">
            CDSCO Lic: DL-20B/44910
          </span>
        </div>
      </div>

      {/* Multimedia Center: Video & Audio Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video: Storage Guidelines with semantic figure */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-heading">
                Pharmaceutical Cold Chain &amp; Storage Advisory
              </h3>
              <p className="text-[11px] text-slate-500">
                Patient training on handling temperature-sensitive medicines (2°C - 8°C)
              </p>
            </div>
          </div>

          <figure className="m-0 space-y-2">
            <div className="rounded-xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center relative">
              <video
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
              >
                <source
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  type="video/mp4"
                />
                <source
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <figcaption className="text-xs text-slate-500 text-center font-serif italic">
              Figure 1: Safe storage instructions for biological insulin, vaccines, and reconstituted antibiotics.
            </figcaption>
          </figure>
        </div>

        {/* Audio: Chief Pharmacist Consultation Advisory */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-heading">
                  Chief Pharmacist Consultation Broadcast
                </h3>
                <p className="text-[11px] text-slate-500">
                  Critical advisory on completing antibiotic courses and dosage schedules
                </p>
              </div>
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/80 space-y-3">
              <p className="text-xs text-slate-700 leading-relaxed">
                Listen to the registered pharmacist advisory on taking prescribed medication after meals and reporting adverse reactions immediately.
              </p>

              {/* Live Interactive Voice Audio Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePlayVoiceAdvisory}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                    isPlayingVoice
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isPlayingVoice ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop Pharmacist Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Pharmacist Voice Advisory (Audio)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Standard HTML5 Audio Tag */}
              <audio controls className="w-full h-9 pt-1">
                <source
                  src="https://www.w3schools.com/html/horse.mp3"
                  type="audio/mpeg"
                />
                Your browser does not support the audio element.
              </audio>
            </div>

            {/* Chemical Formula Text Formatting */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="font-bold text-slate-800">Pharmaceutical Reference Standards:</div>
              <ul className="text-slate-600 space-y-1 list-disc list-inside text-[11px]">
                <li>
                  Glucose Molecule: <strong>C<sub>6</sub>H<sub>12</sub>O<sub>6</sub></strong> (Oral Rehydration Salts)
                </li>
                <li>
                  Antiseptic Solution: <strong>H<sub>2</sub>O<sub>2</sub></strong> (Hydrogen Peroxide 3% v/v)
                </li>
                <li>
                  Complies with <abbr title="World Health Organization" className="font-bold underline decoration-dotted">WHO</abbr> and <abbr title="Food and Drug Administration" className="font-bold underline decoration-dotted">FDA</abbr> standards.
                </li>
              </ul>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
            <mark className="bg-transparent font-bold text-amber-900">Safety Notice:</mark> Never stop prescribed antibiotics prematurely without consulting your doctor.
          </div>
        </div>
      </div>

      {/* Structured Guidelines: Ordered, Unordered & Description Lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Ordered List */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-sm text-slate-900 font-heading">
            <ListOrdered className="w-4 h-4 text-emerald-600" />
            <h3>Prescription Dispensing Protocol</h3>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 leading-relaxed">
            <li>Verify Doctor's MCI registration number.</li>
            <li>Inspect medicine brand and dosage strength.</li>
            <li>Confirm batch number and expiry date.</li>
            <li>Affix instructions &amp; dosage labels.</li>
            <li>Issue official printed Tax Invoice.</li>
          </ol>
        </div>

        {/* Unordered List */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-sm text-slate-900 font-heading">
            <List className="w-4 h-4 text-teal-600" />
            <h3>Daily Safety Checklist</h3>
          </div>
          <ul className="list-disc list-inside space-y-2 text-xs text-slate-700 leading-relaxed">
            <li>Cold-chain refrigerator logged at 2°C - 8°C.</li>
            <li>Schedule H &amp; X safe locked and logged.</li>
            <li>First-aid trauma kit restocked.</li>
            <li>Fire extinguisher seal verified.</li>
            <li>POS invoice printer paper reloaded.</li>
          </ul>
        </div>

        {/* Description List */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-sm text-slate-900 font-heading">
            <BookMarked className="w-4 h-4 text-blue-600" />
            <h3>Medical Terms Glossary</h3>
          </div>
          <dl className="space-y-2 text-xs">
            <dt className="font-bold text-slate-900 font-mono">Generic Name:</dt>
            <dd className="text-slate-600 pl-2 border-l-2 border-emerald-400">
              The chemical active ingredient molecule name.
            </dd>

            <dt className="font-bold text-slate-900 font-mono mt-2">Contraindication:</dt>
            <dd className="text-slate-600 pl-2 border-l-2 border-teal-400">
              Specific condition where a drug must not be used.
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
};
