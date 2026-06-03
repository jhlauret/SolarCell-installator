import { CalendarDays, Flag, ShieldCheck } from 'lucide-react';
import { FieldShell, SelectField, TextField } from '../../ui/FormControls';

export function PersonalStep() {
  return (
    <div className="space-y-[28px]">
      <section>
        <h2 className="section-title">Identité</h2>
        <div className="mt-[22px] grid grid-cols-6 gap-x-[20px] gap-y-[20px]">
          <FieldShell label="Prénom" className="col-span-2">
            <TextField placeholder="Votre prénom" />
          </FieldShell>
          <FieldShell label="Nom" className="col-span-2">
            <TextField placeholder="Votre nom" />
          </FieldShell>
          <FieldShell label="Date de naissance" className="col-span-2">
            <div className="relative">
              <TextField placeholder="JJ / MM / AAAA" className="pr-10" />
              <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500" size={17} />
            </div>
          </FieldShell>
          <FieldShell label="Pays de naissance" className="col-span-3">
            <SelectField defaultValue="">
              <option value="" disabled>Sélectionnez votre pays</option>
              <option>France</option>
              <option>Belgique</option>
              <option>Madagascar</option>
            </SelectField>
          </FieldShell>
          <FieldShell label="Nationalité" className="col-span-3">
            <SelectField defaultValue="">
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
            <TextField type="email" placeholder="exemple@email.com" />
          </FieldShell>
          <FieldShell label="Numéro de téléphone" className="col-span-3">
            <TextField placeholder="🇫🇷   +33 6 12 34 56 78" />
          </FieldShell>
          <FieldShell label="Adresse" className="col-span-6">
            <TextField placeholder="Numéro et nom de rue" />
          </FieldShell>
          <FieldShell label="Code postal" className="col-span-2">
            <TextField placeholder="Code postal" />
          </FieldShell>
          <FieldShell label="Ville" className="col-span-2">
            <TextField placeholder="Votre ville" />
          </FieldShell>
          <FieldShell label="Pays" className="col-span-2">
            <SelectField defaultValue="">
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
              <SelectField defaultValue="fr" className="pl-12">
                <option value="fr">Français</option>
                <option value="en">English</option>
              </SelectField>
              <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-solar-600" size={18} />
            </div>
          </FieldShell>
          <FieldShell label="Fuseau horaire">
            <SelectField defaultValue="paris">
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
    </div>
  );
}
