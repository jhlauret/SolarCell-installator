import { useRef } from 'react';
import { CalendarDays, Flag, ShieldCheck } from 'lucide-react';
import { FieldShell, SelectField, TextField } from '../../ui/FormControls';
import { useStepSubmit } from '../../hooks/useStepSubmit';
import { savePersonalStep } from '../../api/onboardingApi';
import { Button } from '../../../../shared/ui/Button';
import { useSessionStore } from '../../../auth/store/useSessionStore';

export function PersonalStep({ goNext }: { goNext: () => void }) {
  const user = useSessionStore((s) => s.user);
  const { submit, loading, error, saved } = useStepSubmit('personal', savePersonalStep);

  const [defaultFirst, defaultLast] = splitName(user?.name);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef  = useRef<HTMLInputElement>(null);
  const birthDateRef = useRef<HTMLInputElement>(null);
  const birthCountryRef = useRef<HTMLSelectElement>(null);
  const nationalityRef  = useRef<HTMLSelectElement>(null);
  const emailRef   = useRef<HTMLInputElement>(null);
  const phoneRef   = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const zipRef     = useRef<HTMLInputElement>(null);
  const cityRef    = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);
  const langRef    = useRef<HTMLSelectElement>(null);
  const tzRef      = useRef<HTMLSelectElement>(null);

  async function handleSave() {
    const ok = await submit({
      firstName:    firstNameRef.current?.value ?? '',
      lastName:     lastNameRef.current?.value ?? '',
      birthDate:    birthDateRef.current?.value || undefined,
      birthCountry: birthCountryRef.current?.value || undefined,
      nationality:  nationalityRef.current?.value || undefined,
      email:        emailRef.current?.value ?? '',
      phone:        phoneRef.current?.value || undefined,
      address:      addressRef.current?.value || undefined,
      zip:          zipRef.current?.value || undefined,
      city:         cityRef.current?.value || undefined,
      country:      countryRef.current?.value || undefined,
      preferredLang: langRef.current?.value || 'fr',
      timezone:     tzRef.current?.value || undefined,
    });
    if (ok) goNext();
  }

  return (
    <div className="space-y-[28px]">
      <section>
        <h2 className="section-title">Identité</h2>
        <div className="mt-[22px] grid grid-cols-6 gap-x-[20px] gap-y-[20px]">
          <FieldShell label="Prénom" className="col-span-2">
            <TextField ref={firstNameRef} placeholder="Votre prénom" defaultValue={defaultFirst} />
          </FieldShell>
          <FieldShell label="Nom" className="col-span-2">
            <TextField ref={lastNameRef} placeholder="Votre nom" defaultValue={defaultLast} />
          </FieldShell>
          <FieldShell label="Date de naissance" className="col-span-2">
            <div className="relative">
              <TextField ref={birthDateRef} placeholder="JJ / MM / AAAA" className="pr-10" />
              <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500" size={17} />
            </div>
          </FieldShell>
          <FieldShell label="Pays de naissance" className="col-span-3">
            <SelectField ref={birthCountryRef} defaultValue="">
              <option value="" disabled>Sélectionnez votre pays</option>
              <option>France</option>
              <option>Belgique</option>
              <option>Madagascar</option>
            </SelectField>
          </FieldShell>
          <FieldShell label="Nationalité" className="col-span-3">
            <SelectField ref={nationalityRef} defaultValue="">
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
            <TextField ref={emailRef} type="email" placeholder="exemple@email.com" defaultValue={user?.email ?? ''} />
          </FieldShell>
          <FieldShell label="Numéro de téléphone" className="col-span-3">
            <TextField ref={phoneRef} placeholder="🇫🇷   +33 6 12 34 56 78" />
          </FieldShell>
          <FieldShell label="Adresse" className="col-span-6">
            <TextField ref={addressRef} placeholder="Numéro et nom de rue" />
          </FieldShell>
          <FieldShell label="Code postal" className="col-span-2">
            <TextField ref={zipRef} placeholder="Code postal" />
          </FieldShell>
          <FieldShell label="Ville" className="col-span-2">
            <TextField ref={cityRef} placeholder="Votre ville" />
          </FieldShell>
          <FieldShell label="Pays" className="col-span-2">
            <SelectField ref={countryRef} defaultValue="">
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
              <SelectField ref={langRef} defaultValue="fr" className="pl-12">
                <option value="fr">Français</option>
                <option value="en">English</option>
              </SelectField>
              <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-solar-600" size={18} />
            </div>
          </FieldShell>
          <FieldShell label="Fuseau horaire">
            <SelectField ref={tzRef} defaultValue="paris">
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
