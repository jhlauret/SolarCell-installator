import { useState } from 'react';
import { ArrowDownToLine, Check, ChevronDown, FileText, Maximize2, Minus, Search, ShieldCheck, Plus } from 'lucide-react';
import { Button } from '../../../../shared/ui/Button';
import { useOnboardingStore } from '../../store/onboardingStore';

const contractLines = [
  "Le présent contrat définit les conditions dans lesquelles le Prestataire réalisera des prestations",
  "d'installation de systèmes solaires pour le compte de SolarCell et les modalités de rémunération",
  "en SolarCells.",
  "",
  "1. OBJET DU CONTRAT",
  "Le présent contrat a pour objet de définir les modalités de collaboration entre SolarCell et le Prestataire",
  "dans le cadre de l'installation de systèmes solaires photovoltaïques (panneaux, onduleurs, batteries,",
  "câblage et accessoires).",
  "",
  "2. OBLIGATIONS DU PRESTATAIRE",
  "Le Prestataire s'engage à :",
  "• Réaliser les installations conformément aux normes techniques et de sécurité en vigueur.",
  "• Utiliser du matériel conforme et adapté aux installations.",
  "• Respecter les délais convenus et informer SolarCell en cas d'imprévu.",
  "• Fournir des rapports d'installation complets et exacts via la plateforme.",
];

export function ContractStep({ goNext }: { goNext: () => void }) {
  const [accepted, setAccepted] = useState(false);
  const markCompleted = useOnboardingStore((s) => s.markCompleted);

  function handleContinue() {
    if (!accepted) return;
    markCompleted('contract');
    goNext();
  }

  return (
    <div className="space-y-[16px]">
      <div className="flex items-center gap-4 rounded-[9px] bg-greenSoft px-[18px] py-[16px]">
        <ShieldCheck className="shrink-0 text-solar-600" size={31} />
        <div>
          <p className="text-[15px] font-black">Votre contrat est prêt</p>
          <p className="mt-1 text-[13px] leading-[1.5] text-ink-700">Prenez le temps de le consulter en détail. Si vous avez des questions, notre équipe reste à votre disposition.</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-[9px] border border-ink-200 bg-white shadow-card">
        <h2 className="px-[22px] pt-[16px] text-[18px] font-black">Aperçu du contrat</h2>
        <div className="m-[22px] mt-[12px] overflow-hidden rounded-[5px] border border-ink-200">
          <div className="scrollbar-thin flex h-[43px] items-center justify-between gap-3 overflow-x-auto border-b border-ink-200 bg-white px-[14px] text-ink-700">
            <div className="flex shrink-0 items-center gap-[14px] sm:gap-[22px]">
              <FileText size={18} />
              <Search size={19} />
              <ChevronDown className="rotate-180" size={18} />
              <ChevronDown size={18} />
              <span className="rounded-[5px] border border-ink-200 px-[14px] py-[5px] text-[13px] text-ink-900">1</span>
              <span className="text-[13px] text-ink-900">/ 12</span>
            </div>
            <div className="flex shrink-0 items-center gap-[12px] sm:gap-[18px]">
              <Minus size={18} />
              <Plus size={18} />
              <button className="rounded-[5px] border border-ink-200 px-[10px] py-[6px] text-[12px]">Zoom automatique</button>
              <ArrowDownToLine size={18} />
              <Maximize2 size={18} />
            </div>
          </div>
          <div className="scrollbar-thin h-[405px] overflow-y-auto bg-white px-4 py-6 sm:px-[46px] sm:py-[38px]">
            <div className="mb-[30px] flex items-start justify-between">
              <div className="text-[25px] font-black tracking-[-0.05em] text-[#073b36]">☀︎ SolarCell</div>
              <div className="text-right text-[13px] font-bold leading-[1.4]">
                Contrat d'installateur partenaire<br />
                <span className="font-medium">Version 1.0 – Mai 2025</span>
              </div>
            </div>
            <h3 className="mb-[18px] text-[14px] font-black text-solar-700">PRÉAMBULE</h3>
            <div className="space-y-[8px] text-[12px] leading-[1.35] text-ink-900">
              {contractLines.map((line, index) => line ? <p key={index}>{line}</p> : <div key={index} className="h-2" />)}
            </div>
          </div>
        </div>
        <label className="mb-[18px] ml-[22px] flex cursor-pointer items-center gap-3 text-[13px] text-ink-900">
          <span className={`grid h-[15px] w-[15px] place-items-center rounded-[3px] border ${accepted ? 'bg-solar-600 border-solar-600 text-white' : 'border-ink-300'}`}>
            {accepted && <Check size={12} />}
          </span>
          <input type="checkbox" className="sr-only" checked={accepted} onChange={e => setAccepted(e.target.checked)} />
          J'ai lu et compris l'intégralité du contrat et j'accepte toutes les conditions.
        </label>
      </section>
      <div className="flex justify-end">
        <Button onClick={handleContinue} disabled={!accepted} size="md">Signer et continuer</Button>
      </div>
    </div>
  );
}
