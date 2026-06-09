import { useEffect, useState } from 'react';
import { CalendarDays, Flag, ShieldCheck } from 'lucide-react';
import { FieldShell, SelectField, TextField } from '../../ui/FormControls';
import { useStepSubmit } from '../../hooks/useStepSubmit';
import { savePersonalStep } from '../../api/onboardingApi';
import type { OnboardingPrefillData } from '../../api/onboardingApi';
import { Button } from '../../../../shared/ui/Button';
import { useSessionStore } from '../../../auth/store/useSessionStore';

type Props = {
  goNext: () => void;
  initialData?: OnboardingPrefillData['personal'];
};

export function PersonalStep({ goNext, initialData }: Props) {
  const user = useSessionStore((s) => s.user);
  const { submit, loading, error, saved } = useStepSubmit('personal', savePersonalStep);

  const [defaultFirst, defaultLast] = splitName(user?.name);

  const [firstName, setFirstName]       = useState(initialData?.firstName ?? defaultFirst);
  const [lastName, setLastName]         = useState(initialData?.lastName ?? defaultLast);
  const [birthDate, setBirthDate]       = useState(initialData?.birthDate ?? '');
  const [birthCountry, setBirthCountry] = useState(initialData?.birthCountry ?? '');
  const [nationality, setNationality]   = useState(initialData?.nationality ?? '');
  const [email, setEmail]               = useState(initialData?.email ?? user?.email ?? '');
  const [phone, setPhone]               = useState(initialData?.phone ?? '');
  const [address, setAddress]           = useState(initialData?.address ?? '');
  const [zip, setZip]                   = useState(initialData?.zip ?? '');
  const [city, setCity]                 = useState(initialData?.city ?? '');
  const [country, setCountry]           = useState(initialData?.country ?? '');
  const [preferredLang, setPreferredLang] = useState(initialData?.preferredLang ?? 'fr');
  const [timezone, setTimezone]         = useState(initialData?.timezone ?? 'paris');

  // Quand les données Odoo arrivent après le premier rendu, on les applique
  useEffect(() => {
    if (!initialData) return;
    if (initialData.firstName)    setFirstName(initialData.firstName);
    if (initialData.lastName)     setLastName(initialData.lastName);
    if (initialData.birthDate)    setBirthDate(initialData.birthDate);
    if (initialData.birthCountry) setBirthCountry(initialData.birthCountry);
    if (initialData.nationality)  setNationality(initialData.nationality);
    if (initialData.email)        setEmail(initialData.email);
    if (initialData.phone)        setPhone(initialData.phone);
    if (initialData.address)      setAddress(initialData.address);
    if (initialData.zip)          setZip(initialData.zip);
    if (initialData.city)         setCity(initialData.city);
    if (initialData.country)      setCountry(initialData.country);
    if (initialData.preferredLang) setPreferredLang(initialData.preferredLang);
    if (initialData.timezone)     setTimezone(initialData.timezone);
  }, [initialData]);

  async function handleSave() {
    const ok = await submit({
      firstName, lastName, birthDate: birthDate || undefined,
      birthCountry: birthCountry || undefined, nationality: nationality || undefined,
      email, phone: phone || undefined, address: address || undefined,
      zip: zip || undefined, city: city || undefined, country: country || undefined,
      preferredLang, timezone: timezone || undefined,
    });
    if (ok) goNext();
  }

  return (
    <div className="space-y-[28px]">
      <section>
        <h2 className="section-title">Identité</h2>
        <div className="mt-[22px] grid grid-cols-6 gap-x-[20px] gap-y-[20px]">
          <FieldShell label="Prénom" className="col-span-2">
            <TextField value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Votre prénom" />
          </FieldShell>
          <FieldShell label="Nom" className="col-span-2">
            <TextField value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Votre nom" />
          </FieldShell>
          <FieldShell label="Date de naissance" className="col-span-2">
            <div className="relative">
              <TextField value={birthDate} onChange={e => setBirthDate(e.target.value)} placeholder="JJ / MM / AAAA" className="pr-10" />
              <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500" size={17} />
            </div>
          </FieldShell>
          <FieldShell label="Pays de naissance" className="col-span-3">
            <SelectField value={birthCountry} onChange={e => setBirthCountry(e.target.value)}>
              <option value="" disabled>Sélectionnez votre pays</option>
              <option>France</option>
              <option>Belgique</option>
              <option>Madagascar</option>
            </SelectField>
          </FieldShell>
          <FieldShell label="Nationalité" className="col-span-3">
            <SelectField value={nationality} onChange={e => setNationality(e.target.value)}>
              <option value="" disabled>Sélectionnez votre nationalité</option>
              <option>Française</option>
              <option>Belge</option>
              <option>Malgache</option>
            </SelectField>
          </FieldShell>
        </div>
      </section>

      <section>
        <h2 className="section-title">Coordonnées</h2>
        <div className="mt-[18px] grid grid-cols-6 gap-x-[20px] gap-y-[18px]">
          <FieldShell label="Adresse e-mail" className="col-span-3">
            <TextField value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="exemple@email.com" />
          </FieldShell>
          <FieldShell label="Numéro de téléphone" className="col-span-3">
            <TextField value={phone} onChange={e => setPhone(e.target.value)} placeholder="🇫🇷   +33 6 12 34 56 78" />
          </FieldShell>
          <FieldShell label="Adresse" className="col-span-6">
            <TextField value={address} onChange={e => setAddress(e.target.value)} placeholder="Numéro et nom de rue" />
          </FieldShell>
          <FieldShell label="Code postal" className="col-span-2">
            <TextField value={zip} onChange={e => setZip(e.target.value)} placeholder="Code postal" />
          </FieldShell>
          <FieldShell label="Ville" className="col-span-2">
            <TextField value={city} onChange={e => setCity(e.target.value)} placeholder="Votre ville" />
          </FieldShell>
          <FieldShell label="Pays" className="col-span-2">
            <SelectField value={country} onChange={e => setCountry(e.target.value)}>
              <option value="" disabled>Sélectionnez votre pays</option>
              <option>France</option>
              <option>Belgique</option>
              <option>Madagascar</option>
            </SelectField>
          </FieldShell>
        </div>
      </section>

      <section>
        <h2 className="section-title">Préférences</h2>
        <div className="mt-[18px] grid grid-cols-2 gap-x-[20px]">
          <FieldShell label="Langue préférée">
            <div className="relative">
              <SelectField value={preferredLang} onChange={e => setPreferredLang(e.target.value)} className="pl-12">
                <option value="fr">Français</option>
                <option value="en">English</option>
              </SelectField>
              <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-solar-600" size={18} />
            </div>
          </FieldShell>
          <FieldShell label="Fuseau horaire">
            <SelectField value={timezone} onChange={e => setTimezone(e.target.value)}>
              <option value="paris">(UTC+01:00) Paris, Bruxelles</option>
            </SelectField>
          </FieldShell>
        </div>
      </section>

      <div className="flex items-center gap-4 rounded-[9px] bg-greenSoft px-[18px] py-[16px]">
        <ShieldCheck className="shrink-0 text-solar-600" size={28} />
        <div>
          <p className="text-[15px] font-black">Vos données sont protégées</p>
          <p className="mt-1 text-[13px] text-ink-700">Vos informations personnelles sont sécurisées et ne seront jamais partagées.</p>
        </div>
      </div>

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

function splitName(fullName?: string): [string, string] {
  if (!fullName) return ['', ''];
  const parts = fullName.trim().split(' ');
  const first = parts[0] ?? '';
  const last = parts.slice(1).join(' ');
  return [first, last];
}
