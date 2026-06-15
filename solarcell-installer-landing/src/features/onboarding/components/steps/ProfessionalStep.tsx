import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import { FieldShell, SelectField, TextAreaField, TextField } from '../../ui/FormControls';
import { useStepSubmit } from '../../hooks/useStepSubmit';
import { saveProfessionalStep } from '../../api/onboardingApi';
import type { OnboardingPrefillData } from '../../api/onboardingApi';
import { Button } from '../../../../shared/ui/Button';

type Props = {
  goNext: () => void;
  initialData?: OnboardingPrefillData['professional'];
};

export function ProfessionalStep({ goNext, initialData }: Props) {
  const { submit, loading, error, saved } = useStepSubmit('professional', saveProfessionalStep);

  const [companyType, setCompanyType]     = useState(initialData?.companyType ?? 'ei');
  const [companyName, setCompanyName]     = useState(initialData?.companyName ?? '');
  const [siret, setSiret]                 = useState(initialData?.siret ?? '');
  const [vatNumber, setVatNumber]         = useState(initialData?.vatNumber ?? '');
  const [apeCode, setApeCode]             = useState(initialData?.apeCode ?? '');
  const [proAddress, setProAddress]       = useState(initialData?.proAddress ?? '');
  const [proZip, setProZip]               = useState(initialData?.proZip ?? '');
  const [proCity, setProCity]             = useState(initialData?.proCity ?? '');
  const [proCountry, setProCountry]       = useState(initialData?.proCountry ?? '');
  const [proPhone, setProPhone]           = useState(initialData?.proPhone ?? '');
  const [proEmail, setProEmail]           = useState(initialData?.proEmail ?? '');
  const [creationYear, setCreationYear]   = useState(initialData?.creationYear ?? '');
  const [employeeRange, setEmployeeRange] = useState(initialData?.employeeRange ?? '');
  const [mainActivity, setMainActivity]   = useState(initialData?.mainActivity ?? '');

  useEffect(() => {
    if (!initialData) return;
    if (initialData.companyType)   setCompanyType(initialData.companyType);
    if (initialData.companyName)   setCompanyName(initialData.companyName);
    if (initialData.siret)         setSiret(initialData.siret);
    if (initialData.vatNumber)     setVatNumber(initialData.vatNumber);
    if (initialData.apeCode)       setApeCode(initialData.apeCode);
    if (initialData.proAddress)    setProAddress(initialData.proAddress);
    if (initialData.proZip)        setProZip(initialData.proZip);
    if (initialData.proCity)       setProCity(initialData.proCity);
    if (initialData.proCountry)    setProCountry(initialData.proCountry);
    if (initialData.proPhone)      setProPhone(initialData.proPhone);
    if (initialData.proEmail)      setProEmail(initialData.proEmail);
    if (initialData.creationYear)  setCreationYear(initialData.creationYear);
    if (initialData.employeeRange) setEmployeeRange(initialData.employeeRange);
    if (initialData.mainActivity)  setMainActivity(initialData.mainActivity);
  }, [initialData]);

  async function handleSave() {
    const ok = await submit({
      companyType: companyType || undefined,
      companyName: companyName || undefined,
      siret: siret || undefined,
      vatNumber: vatNumber || undefined,
      apeCode: apeCode || undefined,
      proAddress: proAddress || undefined,
      proZip: proZip || undefined,
      proCity: proCity || undefined,
      proCountry: proCountry || undefined,
      proPhone: proPhone || undefined,
      proEmail: proEmail || undefined,
      creationYear: creationYear ? Number(creationYear) : undefined,
      employeeRange: employeeRange || undefined,
      mainActivity: mainActivity || undefined,
    });
    if (ok) goNext();
  }

  return (
    <div className="space-y-[26px]">
      <section>
        <h2 className="section-title">Statut professionnel</h2>
        <div className="mt-[18px] grid grid-cols-1 gap-x-[20px] gap-y-[18px] sm:grid-cols-2 lg:grid-cols-12">
          <FieldShell label="Type de structure" className="col-span-1 sm:col-span-2 lg:col-span-7">
            <div className="relative">
              <SelectField value={companyType} onChange={e => setCompanyType(e.target.value)} className="pl-14">
                <option value="ei">Entreprise individuelle</option>
                <option value="sas">SAS / SASU</option>
                <option value="sarl">SARL / EURL</option>
              </SelectField>
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-700" size={20} />
            </div>
          </FieldShell>
          <FieldShell label="Nom de l'entreprise / Raison sociale" className="col-span-1 sm:col-span-2 lg:col-span-12">
            <TextField value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Nom de l'entreprise ou raison sociale" />
          </FieldShell>
          <FieldShell label="Numéro SIRET" className="col-span-1 lg:col-span-4">
            <TextField value={siret} onChange={e => setSiret(e.target.value)} placeholder="14 chiffres" />
          </FieldShell>
          <FieldShell label="Numéro de TVA intracommunautaire (si applicable)" className="col-span-1 lg:col-span-5">
            <TextField value={vatNumber} onChange={e => setVatNumber(e.target.value)} placeholder="FRXX123456789" />
          </FieldShell>
          <FieldShell label="Code APE / NAF" className="col-span-1 sm:col-span-2 lg:col-span-3">
            <TextField value={apeCode} onChange={e => setApeCode(e.target.value)} placeholder="Ex : 4321A" />
          </FieldShell>
        </div>
      </section>

      <section>
        <h2 className="section-title">Coordonnées professionnelles</h2>
        <div className="mt-[18px] grid grid-cols-1 gap-x-[20px] gap-y-[18px] sm:grid-cols-2 lg:grid-cols-12">
          <FieldShell label="Adresse professionnelle" className="col-span-1 sm:col-span-2 lg:col-span-12">
            <TextField value={proAddress} onChange={e => setProAddress(e.target.value)} placeholder="Numéro et nom de rue" />
          </FieldShell>
          <FieldShell label="Code postal" className="col-span-1 lg:col-span-4">
            <TextField value={proZip} onChange={e => setProZip(e.target.value)} placeholder="Code postal" />
          </FieldShell>
          <FieldShell label="Ville" className="col-span-1 lg:col-span-4">
            <TextField value={proCity} onChange={e => setProCity(e.target.value)} placeholder="Votre ville" />
          </FieldShell>
          <FieldShell label="Pays" className="col-span-1 sm:col-span-2 lg:col-span-4">
            <SelectField value={proCountry} onChange={e => setProCountry(e.target.value)}>
              <option value="" disabled>Sélectionnez votre pays</option>
              <option>France</option>
              <option>Belgique</option>
              <option>Madagascar</option>
            </SelectField>
          </FieldShell>
          <FieldShell label="Téléphone professionnel" className="col-span-1 lg:col-span-6">
            <TextField value={proPhone} onChange={e => setProPhone(e.target.value)} placeholder="🇫🇷  +33 6 12 34 56 78" />
          </FieldShell>
          <FieldShell label="Adresse e-mail professionnelle" className="col-span-1 lg:col-span-6">
            <TextField value={proEmail} onChange={e => setProEmail(e.target.value)} placeholder="exemple@entreprise.com" />
          </FieldShell>
        </div>
      </section>

      <section>
        <h2 className="section-title">Informations complémentaires</h2>
        <div className="mt-[18px] grid grid-cols-1 gap-x-[20px] gap-y-[18px] sm:grid-cols-2">
          <FieldShell label="Année de création de l'entreprise">
            <SelectField value={creationYear} onChange={e => setCreationYear(e.target.value)}>
              <option value="" disabled>Sélectionnez l'année</option>
              <option>2026</option><option>2025</option><option>2024</option>
              <option>2023</option><option>2022</option><option>2021</option>
            </SelectField>
          </FieldShell>
          <FieldShell label="Nombre de salariés">
            <SelectField value={employeeRange} onChange={e => setEmployeeRange(e.target.value)}>
              <option value="" disabled>Sélectionnez une tranche</option>
              <option value="0_1">0 à 1</option>
              <option value="2_5">2 à 5</option>
              <option value="6_20">6 à 20</option>
              <option value="20_plus">Plus de 20</option>
            </SelectField>
          </FieldShell>
          <FieldShell label="Activité principale" className="col-span-1 sm:col-span-2">
            <TextAreaField value={mainActivity} onChange={e => setMainActivity(e.target.value)} placeholder="Décrivez brièvement votre activité principale" maxLength={300} />
            <div className="mt-[-25px] pr-3 text-right text-[12px] text-ink-700">{mainActivity.length}/300</div>
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
