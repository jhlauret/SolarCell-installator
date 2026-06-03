import { Building2, FileBadge2, FileText, Home, ShieldCheck, UploadCloud } from 'lucide-react';
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { IconBadge } from '../../ui/IconBadge';

const kycDocs: Array<{ title: string; desc: string; icon: ComponentType<LucideProps> }> = [
  { title: 'Pièce d’identité', desc: 'Carte nationale d’identité, passeport ou titre de séjour\nFormat accepté : PDF, JPG, PNG (Max. 10 Mo)', icon: FileBadge2 },
  { title: 'Justificatif de domicile', desc: 'Facture d’électricité, d’eau, de gaz ou quittance de loyer\nFormat accepté : PDF, JPG, PNG (Max. 10 Mo)', icon: Home }
];

const kybDocs: Array<{ title: string; desc: string; icon: ComponentType<LucideProps> }> = [
  { title: 'Extrait KBIS', desc: 'Document de moins de 3 mois\nFormat accepté : PDF (Max. 10 Mo)', icon: Building2 },
  { title: 'Numéro de TVA intracommunautaire', desc: 'Document officiel de confirmation\nFormat accepté : PDF (Max. 10 Mo)', icon: FileText },
  { title: 'Attestation d’assurance', desc: 'Responsabilité civile professionnelle\nFormat accepté : PDF (Max. 10 Mo)', icon: ShieldCheck }
];

export function DocumentsStep() {
  return (
    <div className="space-y-[26px]">
      <DocumentBlock title="Documents d’identité (KYC)" docs={kycDocs} />
      <DocumentBlock title="Documents de l’entreprise (KYB)" docs={kybDocs} />
      <div className="flex items-center gap-4 rounded-[9px] bg-greenSoft px-[18px] py-[16px]">
        <ShieldCheck className="shrink-0 text-solar-600" size={30} />
        <div>
          <p className="text-[15px] font-black">Vos documents sont sécurisés</p>
          <p className="mt-1 text-[13px] text-ink-700">Notre plateforme utilise un chiffrement avancé pour protéger vos données.</p>
        </div>
      </div>
    </div>
  );
}

function DocumentBlock({ title, docs }: { title: string; docs: typeof kycDocs }) {
  return (
    <section>
      <h2 className="section-title">{title}</h2>
      <div className="mt-[12px] overflow-hidden rounded-[9px] border border-ink-200 bg-white shadow-card">
        {docs.map((doc, index) => (
          <div key={doc.title} className={`grid grid-cols-[72px_1fr_210px] items-center gap-[4px] px-[16px] py-[16px] ${index !== 0 ? 'border-t border-ink-200' : ''}`}>
            <IconBadge icon={doc.icon} size="md" />
            <div>
              <h3 className="text-[16px] font-black">{doc.title} <span className="text-ink-500">ⓘ</span></h3>
              <p className="mt-[8px] whitespace-pre-line text-[13px] leading-[1.45] text-ink-700">{doc.desc}</p>
            </div>
            <button className="flex h-[64px] flex-col items-center justify-center rounded-[8px] border border-dashed border-ink-300 bg-white text-solar-700 transition hover:border-solar-500 hover:bg-solar-50">
              <UploadCloud size={25} />
              <span className="text-[14px] font-black">Choisir un fichier</span>
              <span className="text-[12px] text-ink-700">ou glisser-déposer</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
