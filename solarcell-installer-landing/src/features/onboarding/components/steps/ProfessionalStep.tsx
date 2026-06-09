import { useRef } from 'react';
import { Building2 } from 'lucide-react';
import { FieldShell, SelectField, TextAreaField, TextField } from '../../ui/FormControls';
import { useStepSubmit } from '../../hooks/useStepSubmit';
import { saveProfessionalStep } from '../../api/onboardingApi';
import { Button } from '../../../../shared/ui/Button';

export function ProfessionalStep({ goNext }: { goNext: () => void }) {
  const { submit, loading, error, saved } = useStepSubmit('professional', saveProfessionalStep);

  const companyTypeRef  = useRef<HTMLSelectElement>(null);
  const companyNameRef  = useRef<HTMLInputElement>(null);
  const siretRef        = useRef<HTMLInputElement>(null);
  const vatRef          = useRef<HTMLInputElement>(null);
  const apeRef          = useRef<HTMLInputElement>(null);
  const proAddressRef   = useRef<HTMLInputElement>(null);
  const proZipRef       = useRef<HTMLInputElement>(null);
  const proCityRef      = useRef<HTMLInputElement>(null);
  const proCountryRef   = useRef<HTMLSelectElement>(null);
  const proPhoneRef     = useRef<HTMLInputElement>(null);
  const proEmailRef     = useRef<HTMLInputElement>(null);
  const creationYearRef = useRef<HTMLSelectElement>(null);
  const employeeRef     = useRef<HTMLSelectElement>(null);
  const activityRef     = useRef<HTMLTextAreaElement>(null);

  async function handleSave() {
    const ok = await submit({
      companyType:   companyTypeRef.current?.value || undefined,
      companyName:   companyNameRef.current?.value || undefined,
      siret:         siretRef.current?.value || undefined,
      vatNumber:     vatRef.current?.value || undefined,
      apeCode:       apeRef.current?.value || undefined,
      proAddress:    proAddressRef.current?.value || undefined,
      proZip:        proZipRef.current?.value || undefined,
      proCity:       proCityRef.current?.value || undefined,
      proCountry:    proCountryRef.current?.value || undefined,
      proPhone:      proPhoneRef.current?.value || undefined,
      proEmail:      proEmailRef.current?.value || undefined,
      creationYear:  creationYearRef.current?.value ? Number(creationYearRef.current.value) : undefined,
      employeeRange: employeeRef.current?.value || undefined,
      mainActivity:  activityRef.current?.value || undefined,
    });
    if (ok) goNext();
  }

  return (
    <div className="space-y-[26px]">
      <section>
        <h2 className="section-title">Statut professionnel</h2>
        <div className="mt-[18px] grid grid-cols-12 gap-x-[20px] gap-y-[18px]">
          <FieldShell label="Type de structure" className="col-span-7">
            <div className="relative">
              <SelectField ref={companyTypeRef} defaultValue="ei" className="pl-14">
                <option value="ei">Entreprise individuelle</option>
                <option value="sas">SAS / SASU</option>
                <option value="sarl">SARL / EURL</option>
              </SelectField>
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-700" size={20} />
            </div>
          </FieldShell>
          <FieldShell label="Nom de l'entreprise / Raison sociale" className="col-span-12">
            <TextField ref={companyNameRef} placeholder="Nom de l'entreprise ou raison sociale" />
          </FieldShell>
          <FieldShell label="Numéro SIRET" className="col-span-4">
            <TextField ref={siretRef} placeholder="14 chiffres" />
          </FieldShell>
          <FieldShell label="Numéro de TVA intracommunautaire (si applicable)" className="col-span-5">
            <TextField ref={vatRef} placeholder="FRXX123456789" />
          </FieldShell>
          <FieldShell label="Code APE / NAF" className="col-span-3">
            <TextField ref={apeRef} placeholder="Ex : 4321A" />
          </FieldShell>
        </div>
      </section>

      <section>
        <h2 className="section-title">Coordonnées professionnelles</h2>
        <div className="mt-[18px] grid grid-cols-12 gap-x-[20px] gap-y-[18px]">
          <FieldShell label="Adresse professionnelle" className="col-span-12">
            <TextField ref={proAddressRef} placeholder="Numéro et nom de rue" />
          </FieldShell>
          <FieldShell label="Code postal" className="col-span-4">
            <TextField ref={proZipRef} placeholder="Code postal" />
          </FieldShell>
          <FieldShell label="Ville" className="col-span-4">
            <TextField ref={proCityRef} placeholder="Votre ville" />
          </FieldShell>
          <FieldShell label="Pays" className="col-span-4">
            <SelectField ref={proCountryRef} defaultValue="">
              <option value="" disabled>Sélectionnez votre pays</option>
              <option>France</option>
              <option>Belgique</option>
              <option>Madagascar</option>
            </SelectField>
          </FieldShell>
          <FieldShell label="Téléphone professionnel" className="col-span-6">
            <TextField ref={proPhoneRef} placeholder="🇫🇷  +33 6 12 34 56 78" />
          </FieldShell>
          <FieldShell label="Adresse e-mail professionnelle" className="col-span-6">
            <TextField ref={proEmailRef} placeholder="exemple@entreprise.com" />
          </FieldShell>
        </div>
      </section>

      <section>
        <h2 className="section-title">Informations complémentaires</h2>
        <div className="mt-[18px] grid grid-cols-2 gap-x-[20px] gap-y-[18px]">
          <FieldShell label="Année de création de l'entreprise">
            <SelectField ref={creationYearRef} defaultValue="">
              <option value="" disabled>Sélectionnez l'année</option>
              <option>2026</option><option>2025</option><option>2024</option>
              <option>2023</option><option>2022</option><option>2021</option>
            </SelectField>
          </FieldShell>
          <FieldShell label="Nombre de salariés">
            <SelectField ref={employeeRef} defaultValue="">
              <option value="" disabled>Sélectionnez une tranche</option>
              <option value="0_1">0 à 1</option>
              <option value="2_5">2 à 5</option>
              <option value="6_20">6 à 20</option>
              <option value="20_plus">Plus de 20</option>
            </SelectField>
          </FieldShell>
          <FieldShell label="Activité principale" className="col-span-2">
            <TextAreaField ref={activityRef} placeholder="Décrivez brièvement votre activité principale" maxLength={300} />
            <div className="mt-[-25px] pr-3 text-right text-[12px] text-ink-700">0/300</div>
          </FieldShell>
        </div>
      </section>

      {error && <p className="text-[13px] text-red-600">{error}</p>}
      {saved && <p className="text-[13px] text-solar-700 font-black">✓ Informations sauvegardées</p>}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} size="md">
          {loading ? 'Sauvegarde…' : 'Sauvegarder et continuer'}
        </Button>
      </div>
    </div>
  );
}
