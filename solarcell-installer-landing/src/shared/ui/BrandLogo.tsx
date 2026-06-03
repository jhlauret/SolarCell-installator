export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="/" className="flex items-center gap-[11px]" aria-label="SolarCell accueil">
      <span className="relative grid h-[39px] w-[39px] place-items-center">
        <svg viewBox="0 0 48 48" className="h-[39px] w-[39px]" aria-hidden="true">
          <circle cx="24" cy="24" r="9.2" fill="none" stroke="#6EBE45" strokeWidth="3" />
          <path d="M24 2.5v8.2M24 37.3v8.2M2.5 24h8.2M37.3 24h8.2M8.8 8.8l5.8 5.8M33.4 33.4l5.8 5.8M39.2 8.8l-5.8 5.8M14.6 33.4l-5.8 5.8" stroke="#84C13B" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M19.4 27.9 24 19.7l4.6 8.2" fill="none" stroke="#17434A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 19.7v24" stroke="#17434A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="m16.7 35.9 7.3-6.4 7.3 6.4" fill="none" stroke="#43A047" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {!compact && <span className="text-[26px] font-extrabold tracking-[-0.045em] text-[#14333A]">SolarCell</span>}
    </a>
  );
}
