import { BatteryCharging, Cable, Check, Plus, SunMedium, SquareCheckBig } from 'lucide-react';
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { Button } from '../../ui/Button';
import { FieldShell, SelectField } from '../../ui/FormControls';
import { IconBadge } from '../../ui/IconBadge';
import { clsxLite } from '../../ui/clsxLite';

const skills: Array<{ label: string; desc: string; icon: ComponentType<LucideProps>; level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert' }> = [
  { label: 'Panneaux solaires', desc: 'Installation, fixation et raccordement de panneaux photovoltaïques.', icon: SunMedium, level: 'Avancé' },
  { label: 'Onduleurs', desc: 'Installation, configuration et maintenance des onduleurs solaires.', icon: SquareCheckBig, level: 'Intermédiaire' },
  { label: 'Batteries', desc: 'Installation et raccordement des systèmes de stockage (batteries).', icon: BatteryCharging, level: 'Intermédiaire' },
  { label: 'Câbles & câblage', desc: 'Câblage DC/AC, chemins de câbles, connexions et protections.', icon: Cable, level: 'Avancé' }
];

const levels = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];

export function SkillsStep() {
  return (
    <div className="space-y-[25px]">
      <section>
        <h2 className="section-title">Domaines de compétences</h2>
        <p className="mt-2 text-[13px] text-ink-700">Sélectionnez les domaines dans lesquels vous avez de l’expérience.</p>
        <div className="mt-[16px] grid grid-cols-4 gap-[18px]">
          {skills.map((skill) => (
            <div key={skill.label} className="relative rounded-[8px] border border-ink-200 bg-white p-[14px] text-center shadow-card">
              <span className="absolute right-[14px] top-[14px] grid h-[17px] w-[17px] place-items-center rounded-[3px] bg-solar-600 text-white">
                <Check size={13} strokeWidth={3} />
              </span>
              <IconBadge icon={skill.icon} size="md" className="mx-auto" />
              <h3 className="mt-[16px] text-[14px] font-black">{skill.label}</h3>
              <p className="mt-[10px] text-[12px] leading-[1.55] text-ink-700">{skill.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Niveau d’expertise</h2>
        <p className="mt-2 text-[13px] text-ink-700">Indiquez votre niveau pour chaque domaine sélectionné.</p>
        <div className="mt-[16px] overflow-hidden rounded-[7px] border border-ink-200 bg-white">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="h-[38px] text-ink-900">
                <th className="w-[46px]" />
                <th className="text-left font-black" />
                {levels.map((level) => (
                  <th key={level} className="font-black">{level}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.label} className="h-[40px] border-t border-ink-200">
                  <td className="text-center text-solar-600"><skill.icon className="mx-auto" size={18} /></td>
                  <td className="font-black">{skill.label}</td>
                  {levels.map((level) => {
                    const checked = level === skill.level;
                    return (
                      <td key={level} className="text-center">
                        <span className={clsxLite('mx-auto block h-[14px] w-[14px] rounded-full border', checked ? 'border-solar-600 bg-solar-100 ring-2 ring-solar-600 ring-offset-1' : 'border-ink-300 bg-white')} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="section-title">Expérience professionnelle</h2>
        <p className="mt-2 text-[13px] text-ink-700">Décrivez votre expérience dans le domaine de l’énergie solaire.</p>
        <div className="mt-[16px] grid grid-cols-2 gap-[20px]">
          <FieldShell label="Années d’expérience">
            <SelectField defaultValue=""><option value="" disabled>Sélectionnez votre expérience</option><option>1 à 3 ans</option><option>3 à 5 ans</option><option>Plus de 5 ans</option></SelectField>
          </FieldShell>
          <FieldShell label="Nombre d’installations réalisées (estimatif)">
            <SelectField defaultValue=""><option value="" disabled>Sélectionnez une tranche</option><option>1 à 10</option><option>10 à 50</option><option>50+</option></SelectField>
          </FieldShell>
        </div>
      </section>

      <section>
        <h2 className="section-title">Certifications (optionnel)</h2>
        <p className="mt-2 text-[13px] text-ink-700">Ajoutez vos certifications ou habilitations en lien avec vos compétences.</p>
        <Button variant="outline" className="mt-[14px] h-[34px] min-w-[170px] px-4 text-[12px] text-solar-700" leftIcon={<Plus size={16} />}>
          Ajouter une certification
        </Button>
      </section>
    </div>
  );
}
