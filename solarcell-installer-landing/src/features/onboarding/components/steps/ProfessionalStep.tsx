import { Building2 } from 'lucide-react';
import { FieldShell, SelectField, TextAreaField, TextField } from '../../ui/FormControls';

export function ProfessionalStep() {
  return (
    <div className="space-y-[26px]">
      <section>
        <h2 className="section-title">Statut professionnel</h2>
        <div className="mt-[18px] grid grid-cols-12 gap-x-[20px] gap-y-[18px]">
          <FieldShell label="Type de structure" className="col-span-7">
            <div className="relative">
              <SelectField defaultValue="ei" className="pl-14">
                <option value="ei">Entreprise individuelle</option>
                <option>SAS / SASU</option>
                <option>SARL / EURL</option>
              </SelectField>
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-700" size={20} />
            </div>
          </FieldShell>
          <FieldShell label="Nom de l’entreprise / Raison sociale" className="col-span-12">
            <TextField placeholder="Nom de l’entreprise ou raison sociale" />
          </FieldShell>
          <FieldShell label="Numéro SIRET" className="col-span-4">
            <TextField placeholder="14 chiffres" />
          </FieldShell>
          <FieldShell label="Numéro de TVA intracommunautaire (si applicable)" className="col-span-5">
            <TextField placeholder="FRXX123456789" />
          </FieldShell>
          <FieldShell label="Code APE / NAF" className="col-span-3">
            <TextField placeholder="Ex : 4321A" />
          </FieldShell>
        </div>
      </section>

      <section>
        <h2 className="section-title">Coordonnées professionnelles</h2>
        <div className="mt-[18px] grid grid-cols-12 gap-x-[20px] gap-y-[18px]">
          <FieldShell label="Adresse professionnelle" className="col-span-12">
            <TextField placeholder="Numéro et nom de rue" />
          </FieldShell>
          <FieldShell label="Code postal" className="col-span-4">
            <TextField placeholder="Code postal" />
          </FieldShell>
          <FieldShell label="Ville" className="col-span-4">
            <TextField placeholder="Votre ville" />
          </FieldShell>
          <FieldShell label="Pays" className="col-span-4">
            <SelectField defaultValue="">
              <option value="" disabled>Sélectionnez votre pays</option>
              <option>France</option>
              <option>Belgique</option>
              <option>Madagascar</option>
            </SelectField>
          </FieldShell>
          <FieldShell label="Téléphone professionnel" className="col-span-6">
            <TextField placeholder="🇫🇷  +33 6 12 34 56 78" />
          </FieldShell>
          <FieldShell label="Adresse e-mail professionnelle" className="col-span-6">
            <TextField placeholder="exemple@entreprise.com" />
          </FieldShell>
        </div>
      </section>

      <section>
        <h2 className="section-title">Informations complémentaires</h2>
        <div className="mt-[18px] grid grid-cols-2 gap-x-[20px] gap-y-[18px]">
          <FieldShell label="Année de création de l’entreprise">
            <SelectField defaultValue="">
              <option value="" disabled>Sélectionnez l’année</option>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </SelectField>
          </FieldShell>
          <FieldShell label="Nombre de salariés">
            <SelectField defaultValue="">
              <option value="" disabled>Sélectionnez une tranche</option>
              <option>0 à 1</option>
              <option>2 à 5</option>
              <option>6 à 20</option>
            </SelectField>
          </FieldShell>
          <FieldShell label="Activité principale" className="col-span-2">
            <TextAreaField placeholder="Décrivez brièvement votre activité principale" maxLength={300} />
            <div className="mt-[-25px] pr-3 text-right text-[12px] text-ink-700">0/300</div>
          </FieldShell>
        </div>
      </section>
    </div>
  );
}
