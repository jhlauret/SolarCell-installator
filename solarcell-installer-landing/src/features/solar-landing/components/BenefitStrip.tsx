import { benefits } from '../../../data/landingContent';
import { Icon } from '../../../shared/ui/Icon';

export function BenefitStrip() {
  return (
    <div
      id="benefits"
      data-testid="benefit-strip"
      className="glass-card grid min-h-[151px] grid-cols-1 overflow-hidden rounded-[15px] border border-white/70 shadow-soft md:grid-cols-2 xl:grid-cols-4"
    >
      {benefits.map((item, index) => (
        <article
          key={item.title}
          className={`flex gap-[22px] px-[24px] py-[27px] sm:px-[25px] ${index > 0 ? 'xl:border-l xl:border-[#E5ECE8]' : ''}`}
        >
          <div className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-full bg-[#E3F2E1] text-[#43A047] sm:h-[62px] sm:w-[62px]">
            <Icon name={item.icon} className="h-[41px] w-[41px]" strokeWidth={2.5} />
          </div>
          <div className="pt-[3px]">
            <h2 className="text-[16px] font-extrabold tracking-[-0.025em] text-[#10262D]">{item.title}</h2>
            <p className="mt-[8px] max-w-full text-[14px] font-medium leading-[1.55] tracking-[-0.015em] text-[#405058] sm:max-w-[205px]">
              {item.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
