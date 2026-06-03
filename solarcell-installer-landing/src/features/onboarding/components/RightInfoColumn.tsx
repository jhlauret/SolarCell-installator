import { ChevronRight, CircleAlert, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { IconBadge } from '../ui/IconBadge';
import type { InfoPanel, OnboardingStep } from '../types';
import { rightPanels } from '../data/rightPanels';

export function RightInfoColumn({ currentStep }: { currentStep: OnboardingStep }) {
  const panels = rightPanels[currentStep.id];

  return (
    <aside className="px-[28px] py-[28px]">
      <div className="space-y-[26px]">
        <MainInfoCard panel={panels.main} />
        {panels.secure && <SecurityCard title={panels.secure.title} body={panels.secure.body} cta={panels.secure.cta} />}
        {panels.tips && <TipsCard title={panels.tips.title} items={panels.tips.items} />}
        {panels.warning && <WarningCard title={panels.warning.title} body={panels.warning.body} />}
        {panels.summary && <SummaryCard />}
      </div>
    </aside>
  );
}

function MainInfoCard({ panel }: { panel: InfoPanel }) {
  return (
    <Card className="px-[24px] py-[26px] text-center">
      <IconBadge icon={panel.icon} size="lg" className="mx-auto rounded-full" />
      <h3 className="mt-[22px] text-[16px] font-black text-ink-900">{panel.title}</h3>
      <p className="mx-auto mt-[18px] max-w-[245px] text-[14px] leading-[1.65] text-ink-700">{panel.body}</p>
      {panel.cta && <RightCta className="justify-center">{panel.cta}</RightCta>}
    </Card>
  );
}

function SecurityCard({ title, body, cta }: { title: string; body: string; cta: string }) {
  return (
    <Card className="px-[24px] py-[26px]">
      <div className="flex items-start gap-4">
        <ShieldCheck className="mt-1 shrink-0 text-solar-600" size={28} />
        <div>
          <h3 className="text-[16px] font-black text-ink-900">{title}</h3>
          <p className="mt-[18px] text-[14px] leading-[1.65] text-ink-700">{body}</p>
          <RightCta>{cta}</RightCta>
        </div>
      </div>
    </Card>
  );
}

function TipsCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="px-[24px] py-[26px]">
      <h3 className="text-[16px] font-black text-ink-900">{title}</h3>
      <ul className="mt-[18px] space-y-[19px] text-[14px] leading-[1.45] text-ink-700">
        {items.map((item) => (
          <li className="flex gap-3" key={item}>
            <ShieldCheck className="mt-[1px] shrink-0 fill-solar-500 text-white" size={18} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function WarningCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[9px] bg-orangeSoft px-[24px] py-[24px]">
      <div className="flex items-start gap-4">
        <CircleAlert className="mt-1 shrink-0 text-warning-500" size={24} />
        <div>
          <h3 className="text-[15px] font-black text-warning-700">{title}</h3>
          <p className="mt-[18px] text-[14px] leading-[1.65] text-ink-700">{body}</p>
        </div>
      </div>
    </div>
  );
}

function SummaryCard() {
  return (
    <Card className="px-[22px] py-[23px]">
      <div className="flex items-center gap-3">
        <LockKeyhole className="text-ink-700" size={17} />
        <h3 className="text-[16px] font-black text-ink-900">Récapitulatif</h3>
      </div>
      <dl className="mt-[22px] space-y-[18px] text-[13px]">
        <div>
          <dt className="font-extrabold text-ink-900">Méthode choisie</dt>
          <dd className="mt-2 text-ink-700">Wallet SolarCell intégré</dd>
        </div>
        <div>
          <dt className="font-extrabold text-ink-900">Statut du wallet</dt>
          <dd className="mt-2 text-ink-700">À créer</dd>
        </div>
        <div>
          <dt className="font-extrabold text-ink-900">Réseau</dt>
          <dd className="mt-2 text-ink-700">SolarCell Network</dd>
        </div>
        <div>
          <dt className="font-extrabold text-ink-900">Devise</dt>
          <dd className="mt-2 text-ink-700">SolarCell (SLC)</dd>
        </div>
      </dl>
    </Card>
  );
}

function RightCta({ children, className = '' }: { children: string; className?: string }) {
  return (
    <a href="#" className={`mt-[22px] flex items-center gap-2 text-[13px] font-extrabold text-solar-700 ${className}`}>
      <span>{children}</span>
      <ChevronRight size={16} />
    </a>
  );
}
