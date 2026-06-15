import { useEffect, useState } from 'react';
import { Check, Circle, CircleDot, ListChecks, LockKeyhole, ShieldCheck, TriangleAlert, WalletCards } from 'lucide-react';
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { IconBadge } from '../../ui/IconBadge';
import { useStepSubmit } from '../../hooks/useStepSubmit';
import { saveWalletStep } from '../../api/onboardingApi';
import type { OnboardingPrefillData } from '../../api/onboardingApi';
import { Button } from '../../../../shared/ui/Button';

type Props = { goNext: () => void; initialData?: OnboardingPrefillData['wallet'] };

export function WalletStep({ goNext, initialData }: Props) {
  const [walletType, setWalletType] = useState<'integrated' | 'external'>(initialData?.walletType ?? 'integrated');
  const [recoveryConfirmed, setRecoveryConfirmed] = useState(initialData?.recoveryConfirmed ?? false);
  const { submit, loading, error, saved } = useStepSubmit('wallet', saveWalletStep);

  useEffect(() => {
    if (!initialData) return;
    if (initialData.walletType)        setWalletType(initialData.walletType);
    if (initialData.recoveryConfirmed) setRecoveryConfirmed(initialData.recoveryConfirmed);
  }, [initialData]);

  async function handleSave() {
    const ok = await submit({ walletType, recoveryConfirmed });
    if (ok) goNext();
  }

  return (
    <div className="space-y-[26px]">
      <section>
        <h2 className="section-title">1. Choisissez votre méthode</h2>
        <div className="mt-[18px] grid grid-cols-1 gap-[14px] sm:grid-cols-2">
          <button
            onClick={() => setWalletType('integrated')}
            className={`flex min-h-[143px] items-center gap-[24px] rounded-[9px] border px-[24px] text-left shadow-card ${walletType === 'integrated' ? 'border-solar-500 bg-greenSoft' : 'border-ink-200 bg-white'}`}
          >
            <IconBadge icon={WalletCards} size="lg" />
            <span className="flex-1">
              <span className="block text-[15px] font-black">Wallet SolarCell intégré</span>
              <span className="mt-[8px] block text-[13px] leading-[1.48] text-ink-700">Créez un wallet sécurisé hébergé par SolarCell. Simple, rapide et recommandé pour commencer.</span>
              <span className="mt-[10px] inline-flex rounded-full bg-solar-100 px-[10px] py-[4px] text-[11px] font-extrabold text-solar-700">Recommandé</span>
            </span>
            {walletType === 'integrated'
              ? <CircleDot className="self-start text-solar-600" size={21} />
              : <Circle className="self-start text-ink-300" size={21} />}
          </button>
          <button
            onClick={() => setWalletType('external')}
            className={`flex min-h-[143px] items-center gap-[24px] rounded-[9px] border px-[24px] text-left shadow-card ${walletType === 'external' ? 'border-solar-500 bg-greenSoft' : 'border-ink-200 bg-white'}`}
          >
            <IconBadge icon={ShieldCheck} size="lg" />
            <span className="flex-1">
              <span className="block text-[15px] font-black">Wallet externe</span>
              <span className="mt-[10px] block text-[13px] leading-[1.52] text-ink-700">Connectez votre propre wallet compatible (Ethereum, Polygon, etc.) pour recevoir vos SolarCells.</span>
            </span>
            {walletType === 'external'
              ? <CircleDot className="self-start text-solar-600" size={21} />
              : <Circle className="self-start text-ink-300" size={21} />}
          </button>
        </div>
      </section>

      <section>
        <h2 className="section-title">2. Création de votre wallet intégré</h2>
        <div className="mt-[18px] overflow-hidden rounded-[9px] border border-ink-200 bg-white shadow-card">
          <div className="flex items-center gap-[18px] border-b border-ink-200 px-[22px] py-[15px]">
            <ShieldCheck className="text-solar-600" size={32} />
            <div>
              <p className="text-[14px] font-black">Votre sécurité est notre priorité</p>
              <p className="mt-1 text-[12px] leading-[1.45] text-ink-700">Votre wallet sera protégé par un chiffrement avancé. Conservez précieusement votre phrase de récupération.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 px-[14px] py-[20px] text-center sm:grid-cols-3 sm:gap-0">
            <WalletCreationStage number="1" icon={LockKeyhole} title="Création du wallet" body="Nous générons votre wallet SolarCell de manière sécurisée." />
            <WalletCreationStage number="2" icon={ListChecks} title="Phrase de récupération" body="Notez votre phrase de récupération de 12 mots et conservez-la dans un lieu sûr." withBorder />
            <WalletCreationStage number="3" icon={Check} title="Confirmation" body="Confirmez votre phrase pour activer votre wallet et commencer à recevoir vos SolarCells." withBorder />
          </div>
          <div className="mx-[14px] mb-[17px] rounded-[8px] bg-orangeSoft px-[16px] py-[14px] text-left">
            <div className="flex gap-4">
              <TriangleAlert className="mt-1 shrink-0 text-warning-500" size={26} />
              <div>
                <p className="text-[13px] font-black text-warning-700">Important</p>
                <p className="mt-2 text-[12px] leading-[1.5] text-ink-900">Ne partagez jamais votre phrase de récupération. SolarCell ne vous la demandera jamais.</p>
              </div>
            </div>
          </div>
          <label className="mb-[18px] ml-[22px] flex cursor-pointer items-center gap-3 text-[13px] text-ink-900">
            <span className={`grid h-[15px] w-[15px] place-items-center rounded-[3px] border ${recoveryConfirmed ? 'bg-solar-600 border-solar-600 text-white' : 'border-ink-300'}`}>
              {recoveryConfirmed && <Check size={12} />}
            </span>
            <input type="checkbox" className="sr-only" checked={recoveryConfirmed} onChange={e => setRecoveryConfirmed(e.target.checked)} />
            J'ai noté ma phrase de récupération et je confirme l'activation de mon wallet.
          </label>
        </div>
      </section>

      {error && <p className="text-[13px] text-red-600">{error}</p>}
      {saved && <p className="text-[13px] text-solar-700 font-black">✓ Wallet configuré</p>}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} size="md">
          {loading ? 'Sauvegarde…' : 'Activer mon wallet'}
        </Button>
      </div>
    </div>
  );
}

function WalletCreationStage({ number, icon, title, body, withBorder = false }: { number: string; icon: ComponentType<LucideProps>; title: string; body: string; withBorder?: boolean }) {
  const Icon = icon;
  return (
    <div className={`relative px-[28px] py-[8px] ${withBorder ? 'sm:border-l sm:border-ink-200' : ''}`}>
      <span className="absolute left-1/2 top-[-2px] grid h-[24px] w-[24px] -translate-x-1/2 place-items-center rounded-full bg-solar-500 text-[12px] font-black text-white">{number}</span>
      <IconBadge icon={Icon} size="md" className="mx-auto mt-[20px]" />
      <h3 className="mt-[18px] text-[14px] font-black">{title}</h3>
      <p className="mt-[10px] text-[12px] leading-[1.55] text-ink-700">{body}</p>
    </div>
  );
}
