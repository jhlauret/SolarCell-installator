import { useState } from 'react';
import { Building2, FileBadge2, FileText, Home, ShieldCheck, UploadCloud } from 'lucide-react';
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { IconBadge } from '../../ui/IconBadge';
import { useStepSubmit } from '../../hooks/useStepSubmit';
import { saveDocumentsStep } from '../../api/onboardingApi';
import { Button } from '../../../../shared/ui/Button';

const kycDocs: Array<{ title: string; desc: string; icon: ComponentType<LucideProps> }> = [
  { title: "Pièce d'identité", desc: "Carte nationale d'identité, passeport ou titre de séjour\nFormat accepté : PDF, JPG, PNG (Max. 10 Mo)", icon: FileBadge2 },
  { title: "Justificatif de domicile", desc: "Facture d'électricité, d'eau, de gaz ou quittance de loyer\nFormat accepté : PDF, JPG, PNG (Max. 10 Mo)", icon: Home },
];

const kybDocs: Array<{ title: string; desc: string; icon: ComponentType<LucideProps> }> = [
  { title: "Extrait KBIS", desc: "Document de moins de 3 mois\nFormat accepté : PDF (Max. 10 Mo)", icon: Building2 },
  { title: "Numéro de TVA intracommunautaire", desc: "Document officiel de confirmation\nFormat accepté : PDF (Max. 10 Mo)", icon: FileText },
  { title: "Attestation d'assurance", desc: "Responsabilité civile professionnelle\nFormat accepté : PDF (Max. 10 Mo)", icon: ShieldCheck },
];

export function DocumentsStep({ goNext }: { goNext: () => void }) {
  const [uploads, setUploads] = useState<Record<string, { filename: string; mimetype: string; fileBase64: string }>>({});
  const { submit, loading, error } = useStepSubmit('documents', saveDocumentsStep);

  async function handleFile(docType: string, file: File) {
    const fileBase64 = await toBase64(file);
    setUploads(prev => ({ ...prev, [docType]: { filename: file.name, mimetype: file.type, fileBase64 } }));
  }

  async function handleSave() {
    const documents = Object.entries(uploads).map(([docType, f]) => ({
      docType,
      category: docType.startsWith('kyc') ? 'kyc' : 'kyb',
      ...f,
    }));
    const ok = await submit({ documents });
    if (ok) goNext();
  }

  return (
    <div className="space-y-[26px]">
      <DocumentBlock title="Documents d'identité (KYC)" docs={kycDocs} uploads={uploads} onFile={handleFile} />
      <DocumentBlock title="Documents de l'entreprise (KYB)" docs={kybDocs} uploads={uploads} onFile={handleFile} />
      <div className="flex items-center gap-4 rounded-[9px] bg-greenSoft px-[18px] py-[16px]">
        <ShieldCheck className="shrink-0 text-solar-600" size={30} />
        <div>
          <p className="text-[15px] font-black">Vos documents sont sécurisés</p>
          <p className="mt-1 text-[13px] text-ink-700">Notre plateforme utilise un chiffrement avancé pour protéger vos données.</p>
        </div>
      </div>
      {error && <p className="text-[13px] text-red-600">{error}</p>}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} size="md">
          {loading ? 'Sauvegarde…' : 'Sauvegarder et continuer'}
        </Button>
      </div>
    </div>
  );
}

function DocumentBlock({
  title, docs, uploads, onFile,
}: {
  title: string;
  docs: typeof kycDocs;
  uploads: Record<string, { filename: string }>;
  onFile: (docType: string, file: File) => void;
}) {
  return (
    <section>
      <h2 className="section-title">{title}</h2>
      <div className="mt-[12px] overflow-hidden rounded-[9px] border border-ink-200 bg-white shadow-card">
        {docs.map((doc, index) => {
          const docType = slugify(doc.title);
          const uploaded = uploads[docType];
          return (
            <div key={doc.title} className={`grid grid-cols-[72px_1fr_210px] items-center gap-[4px] px-[16px] py-[16px] ${index !== 0 ? 'border-t border-ink-200' : ''}`}>
              <IconBadge icon={doc.icon} size="md" />
              <div>
                <h3 className="text-[16px] font-black">{doc.title} <span className="text-ink-500">ⓘ</span></h3>
                <p className="mt-[8px] whitespace-pre-line text-[13px] leading-[1.45] text-ink-700">{doc.desc}</p>
                {uploaded && <p className="mt-[4px] text-[12px] text-solar-700 font-bold">✓ {uploaded.filename}</p>}
              </div>
              <label className="flex h-[64px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-ink-300 bg-white text-solar-700 transition hover:border-solar-500 hover:bg-solar-50">
                <UploadCloud size={25} />
                <span className="text-[14px] font-black">Choisir un fichier</span>
                <span className="text-[12px] text-ink-700">ou glisser-déposer</span>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only"
                  onChange={e => { const f = e.target.files?.[0]; if (f) onFile(docType, f); }} />
              </label>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
