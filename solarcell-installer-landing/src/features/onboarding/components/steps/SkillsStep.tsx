import { useEffect, useState } from 'react';
import { BatteryCharging, Cable, Check, Plus, SunMedium, SquareCheckBig } from 'lucide-react';
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { Button } from '../../../../shared/ui/Button';
import { FieldShell, SelectField } from '../../ui/FormControls';
import { IconBadge } from '../../ui/IconBadge';
import { clsx } from '../../../../shared/ui/clsx';
import { useStepSubmit } from '../../hooks/useStepSubmit';
import { saveSkillsStep } from '../../api/onboardingApi';
import type { OnboardingPrefillData } from '../../api/onboardingApi';

const SKILL_DEFS: Array<{ domain: string; label: string; desc: string; icon: ComponentType<LucideProps> }> = [
  { domain: 'solar_panels', label: 'Panneaux solaires', desc: 'Installation, fixation et raccordement de panneaux photovoltaïques.', icon: SunMedium },
  { domain: 'inverters',    label: 'Onduleurs',         desc: 'Installation, configuration et maintenance des onduleurs solaires.', icon: SquareCheckBig },
  { domain: 'batteries',    label: 'Batteries',         desc: 'Installation et raccordement des systèmes de stockage (batteries).', icon: BatteryCharging },
  { domain: 'cabling',      label: 'Câbles & câblage',  desc: 'Câblage DC/AC, chemins de câbles, connexions et protections.', icon: Cable },
];

const LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
const LEVEL_LABELS: Record<string, string> = { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé', expert: 'Expert' };

type Props = { goNext: () => void; initialData?: OnboardingPrefillData['skills'] };

export function SkillsStep({ goNext, initialData }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialData?.selected ?? []));
  const [levels, setLevels] = useState<Record<string, string>>(initialData?.levels ?? {});
  const [yearsExp, setYearsExp] = useState(initialData?.yearsExperience ?? '');
  const [installations, setInstallations] = useState(initialData?.installations ?? '');

  useEffect(() => {
    if (!initialData) return;
    if (initialData.selected?.length)  setSelected(new Set(initialData.selected));
    if (initialData.levels)            setLevels(initialData.levels);
    if (initialData.yearsExperience)   setYearsExp(initialData.yearsExperience);
    if (initialData.installations)     setInstallations(initialData.installations);
  }, [initialData]);
  const { submit, loading, error, saved } = useStepSubmit('skills', saveSkillsStep);

  function toggleSkill(domain: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(domain) ? next.delete(domain) : next.add(domain);
      return next;
    });
  }

  async function handleSave() {
    const skills = Array.from(selected).map(domain => ({
      domain,
      level: levels[domain] ?? 'intermediate',
    }));
    const ok = await submit({ skills, yearsExperience: yearsExp || undefined, installations: installations || undefined });
    if (ok) goNext();
  }

  return (
    <div className="space-y-[25px]">
      <section>
        <h2 className="section-title">Domaines de compétences</h2>
        <p className="mt-2 text-[13px] text-ink-700">Sélectionnez les domaines dans lesquels vous avez de l'expérience.</p>
        <div className="mt-[16px] grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-4">
          {SKILL_DEFS.map((skill) => {
            const isSelected = selected.has(skill.domain);
            return (
              <button key={skill.domain} onClick={() => toggleSkill(skill.domain)}
                className={clsx('relative rounded-[8px] border bg-white p-[14px] text-center shadow-card transition', isSelected ? 'border-solar-500' : 'border-ink-200')}
              >
                {isSelected && (
                  <span className="absolute right-[14px] top-[14px] grid h-[17px] w-[17px] place-items-center rounded-[3px] bg-solar-600 text-white">
                    <Check size={13} strokeWidth={3} />
                  </span>
                )}
                <IconBadge icon={skill.icon} size="md" className="mx-auto" />
                <h3 className="mt-[16px] text-[14px] font-black">{skill.label}</h3>
                <p className="mt-[10px] text-[12px] leading-[1.55] text-ink-700">{skill.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {selected.size > 0 && (
        <section>
          <h2 className="section-title">Niveau d'expertise</h2>
          <p className="mt-2 text-[13px] text-ink-700">Indiquez votre niveau pour chaque domaine sélectionné.</p>
          <div className="mt-[16px] overflow-x-auto rounded-[7px] border border-ink-200 bg-white">
            <table className="w-full min-w-[480px] border-collapse text-[12px]">
              <thead>
                <tr className="h-[38px] text-ink-900">
                  <th className="w-[46px]" />
                  <th className="text-left font-black" />
                  {LEVELS.map(l => <th key={l} className="font-black">{LEVEL_LABELS[l]}</th>)}
                </tr>
              </thead>
              <tbody>
                {SKILL_DEFS.filter(s => selected.has(s.domain)).map((skill) => (
                  <tr key={skill.domain} className="h-[40px] border-t border-ink-200">
                    <td className="text-center text-solar-600"><skill.icon className="mx-auto" size={18} /></td>
                    <td className="font-black">{skill.label}</td>
                    {LEVELS.map(level => {
                      const checked = (levels[skill.domain] ?? 'intermediate') === level;
                      return (
                        <td key={level} className="text-center cursor-pointer" onClick={() => setLevels(prev => ({ ...prev, [skill.domain]: level }))}>
                          <span className={clsx('mx-auto block h-[14px] w-[14px] rounded-full border', checked ? 'border-solar-600 bg-solar-100 ring-2 ring-solar-600 ring-offset-1' : 'border-ink-300 bg-white')} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section>
        <h2 className="section-title">Expérience professionnelle</h2>
        <div className="mt-[16px] grid grid-cols-1 gap-[14px] sm:grid-cols-2">
          <FieldShell label="Années d'expérience">
            <SelectField value={yearsExp} onChange={e => setYearsExp(e.target.value)} defaultValue="">
              <option value="" disabled>Sélectionnez votre expérience</option>
              <option value="1_3">1 à 3 ans</option>
              <option value="3_5">3 à 5 ans</option>
              <option value="5_plus">Plus de 5 ans</option>
            </SelectField>
          </FieldShell>
          <FieldShell label="Nombre d'installations réalisées (estimatif)">
            <SelectField value={installations} onChange={e => setInstallations(e.target.value)} defaultValue="">
              <option value="" disabled>Sélectionnez une tranche</option>
              <option value="1_10">1 à 10</option>
              <option value="10_50">10 à 50</option>
              <option value="50_plus">50+</option>
            </SelectField>
          </FieldShell>
        </div>
      </section>

      <section>
        <h2 className="section-title">Certifications (optionnel)</h2>
        <Button size="sm" variant="outline" className="mt-[14px] h-[34px] min-w-[170px] px-4 text-[12px] text-solar-700" leftIcon={<Plus size={16} />}>
          Ajouter une certification
        </Button>
      </section>

      {error && <p className="text-[13px] text-red-600">{error}</p>}
      {saved && <p className="text-[13px] text-solar-700 font-black">✓ Compétences sauvegardées</p>}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading || selected.size === 0} size="md">
          {loading ? 'Sauvegarde…' : 'Sauvegarder et continuer'}
        </Button>
      </div>
    </div>
  );
}
