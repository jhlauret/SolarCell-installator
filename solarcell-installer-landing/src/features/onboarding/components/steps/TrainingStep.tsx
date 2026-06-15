import { BatteryCharging, Check, Download, FileText, Play, PlayCircle, ShieldCheck, SunMedium, SquareCheckBig, Video } from 'lucide-react';
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { IconBadge } from '../../ui/IconBadge';
import { clsx } from '../../../../shared/ui/clsx';
import { Button } from '../../../../shared/ui/Button';
import { useOnboardingStore } from '../../store/onboardingStore';

const courses: Array<{ title: string; desc: string; icon: ComponentType<LucideProps>; progress: number; done?: boolean }> = [
  { title: "Sécurité sur les chantiers photovoltaïques", desc: "Règles de sécurité essentielles pour travailler sur les installations solaires en toute sécurité.", icon: ShieldCheck, progress: 100, done: true },
  { title: "Installation de panneaux solaires", desc: "Bonnes pratiques d'installation, fixation, raccordement et tests des panneaux photovoltaïques.", icon: SunMedium, progress: 100, done: true },
  { title: "Installation et configuration des onduleurs", desc: "Apprenez à installer, configurer et maintenir les onduleurs solaires en toute sécurité.", icon: SquareCheckBig, progress: 25 },
  { title: "Systèmes de batteries solaires", desc: "Installation, raccordement et maintenance des systèmes de stockage d'énergie (batteries).", icon: BatteryCharging, progress: 0 },
  { title: "Câblage et protections électriques", desc: "Câblage DC/AC, protections, mise à la terre et conformité aux normes électriques.", icon: PlayCircle, progress: 0 },
];

const resources = [
  { title: "Guide d'installation", subtitle: "PDF · 2.4 Mo", icon: FileText },
  { title: "Normes et conformité", subtitle: "PDF · 1.8 Mo", icon: ShieldCheck },
  { title: "Vidéos tutoriels", subtitle: "5 vidéos", icon: Video },
];

export function TrainingStep({ goNext }: { goNext: () => void }) {
  const markCompleted = useOnboardingStore((s) => s.markCompleted);

  function handleContinue() {
    markCompleted('training');
    goNext();
  }

  return (
    <div className="space-y-[24px]">
      <section>
        <h2 className="section-title">Formations obligatoires</h2>
        <div className="mt-[16px] overflow-hidden rounded-[9px] border border-ink-200 bg-white shadow-card">
          {courses.map((course, index) => (
            <div key={course.title} className={`grid grid-cols-1 gap-3 px-[14px] py-[14px] sm:grid-cols-[56px_1fr_auto] sm:items-center sm:gap-4 lg:grid-cols-[78px_1fr_245px] ${index !== 0 ? 'border-t border-ink-200' : ''}`}>
              <IconBadge icon={course.icon} size="md" />
              <div>
                <h3 className="text-[15px] font-black">{course.title}</h3>
                <p className="mt-[7px] max-w-[440px] text-[13px] leading-[1.5] text-ink-700">{course.desc}</p>
              </div>
              <CourseStatus progress={course.progress} done={course.done} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Ressources complémentaires</h2>
        <p className="mt-2 text-[13px] text-ink-700">Accédez à des guides et documents utiles.</p>
        <div className="mt-[12px] grid grid-cols-1 gap-[12px] sm:grid-cols-3 sm:gap-[16px]">
          {resources.map((resource) => (
            <button key={resource.title} className="flex items-center justify-between rounded-[7px] border border-ink-200 bg-white px-[14px] py-[11px] text-left shadow-card transition hover:border-solar-500 hover:bg-solar-50">
              <span className="flex items-center gap-3">
                <IconBadge icon={resource.icon} size="sm" />
                <span>
                  <span className="block text-[13px] font-black">{resource.title}</span>
                  <span className="mt-1 block text-[12px] text-ink-700">{resource.subtitle}</span>
                </span>
              </span>
              <Download className="text-solar-600" size={18} />
            </button>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-4 rounded-[9px] bg-greenSoft px-[18px] py-[14px]">
        <IconBadge icon={ShieldCheck} size="sm" className="bg-transparent" />
        <div>
          <p className="text-[14px] font-black">Validation des formations</p>
          <p className="mt-1 text-[13px] text-ink-700">Une fois toutes les formations obligatoires complétées avec succès, vous pourrez passer au prochain étape : la signature du contrat.</p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleContinue} size="md">Continuer</Button>
      </div>
    </div>
  );
}

function CourseStatus({ progress, done }: { progress: number; done?: boolean }) {
  return (
    <div className="sm:border-l sm:border-ink-200 sm:pl-[24px] lg:pl-[48px]">
      {done ? (
        <div className="flex items-center gap-4">
          <span className="grid h-[29px] w-[29px] place-items-center rounded-full bg-solar-500 text-white"><Check size={18} /></span>
          <div>
            <p className="text-[13px] font-black text-solar-700">Complétée</p>
            <p className="mt-2 text-[13px] text-ink-700">100%</p>
          </div>
        </div>
      ) : (
        <div>
          <button className="flex items-center gap-4 text-[14px] font-black text-solar-700"><Play size={16} />Commencer</button>
          <div className="mt-[10px] flex items-center gap-2">
            <span className="text-[11px] text-ink-700">{progress}%</span>
            <span className="h-[6px] w-[125px] overflow-hidden rounded-full bg-ink-200">
              <span className={clsx('block h-full rounded-full bg-solar-500')} style={{ width: `${progress}%` }} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
