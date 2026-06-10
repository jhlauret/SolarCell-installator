import { useState, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../ui/BrandLogo';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { useLandingNavigation } from '../../hooks/useLandingNavigation';
import { useLandingStore } from '../../store/useLandingStore';
import { useAuthModalStore } from '../../features/auth/store/useAuthModalStore';
import { useSessionStore } from '../../features/auth/store/useSessionStore';
import { logout, odooSsoUrl } from '../../features/auth/api/authApi';
import type { AuthUser } from '../../features/auth/types';

/** Deux premières initiales (nom sinon email) pour l'avatar de repli. */
function initialsOf(user: AuthUser): string {
  const source = (user.name ?? user.email ?? '?').trim();
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  const letters = parts.length >= 2 ? parts[0][0] + parts[1][0] : source.slice(0, 2);
  return letters.toUpperCase();
}

/**
 * Unified site chrome shared by the marketing landing page, the training
 * program page and the onboarding wizard. Section links are absolute hash
 * anchors (`/#section`) so they route back to the landing sections even when
 * rendered on a `/formation` or `/onboarding/*` route; route links (href
 * starting with `/`) navigate via the SPA router.
 */
export function SiteHeader() {
  const { items, setActiveSection } = useLandingNavigation();
  const language = useLandingStore((state) => state.language);
  const openLoginModal = useAuthModalStore((state) => state.open);
  const user = useSessionStore((state) => state.user);
  const clearSession = useSessionStore((state) => state.clear);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      clearSession();
      setLoggingOut(false);
    }
  };

  return (
    <header className="relative z-30 mx-auto flex h-[99px] w-full max-w-[1415px] items-center justify-between px-4 pt-[2px] sm:px-6 lg:px-0">
      <BrandLogo />

      <nav className="hidden items-center gap-[30px] lg:flex" aria-label="Navigation principale">
        {items.map((item) => {
          const isRoute = item.href.startsWith('/');
          const active = isRoute ? pathname === item.href : item.active;
          const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
            setActiveSection(item.label);
            if (isRoute) {
              event.preventDefault();
              navigate(item.href);
            }
          };
          return (
            <a
              key={item.label}
              href={isRoute ? item.href : `/${item.href}`}
              onClick={handleClick}
              className={`relative py-4 text-[14px] font-semibold tracking-[-0.01em] transition ${
                active ? 'text-[#278B39]' : 'text-[#0F2530] hover:text-[#278B39]'
              }`}
            >
              {item.label}
              {active && <span className="absolute bottom-[2px] left-0 h-[2px] w-full rounded-full bg-[#43A047]" />}
            </a>
          );
        })}
      </nav>

      <div className="flex items-center gap-[18px]">
        <button className="hidden items-center gap-[7px] text-[14px] font-semibold text-[#10262D] sm:flex" type="button" aria-label="Changer de langue">
          <Icon name="language" className="h-[21px] w-[21px]" />
          {language}
          <Icon name="chevron" className="h-[15px] w-[15px]" strokeWidth={2.7} />
        </button>
        {user ? (
          <div className="flex items-center gap-3">
            {user.picture ? (
              <img
                src={user.picture}
                alt=""
                referrerPolicy="no-referrer"
                className="h-9 w-9 rounded-full object-cover ring-1 ring-[#E2E6E9]"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F6EC] text-[13px] font-bold text-[#1E8E4C]">
                {initialsOf(user)}
              </span>
            )}
            <span className="hidden max-w-[150px] truncate text-[14px] font-semibold text-[#10262D] sm:block">
              {user.email}
            </span>
            <a
              href={odooSsoUrl(user.applicationId)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-[44px] items-center rounded-[7px] border border-[#1E8E4C] px-4 text-[14px] font-semibold text-[#1E8E4C] sm:inline-flex"
            >
              Accéder à mon espace Odoo
            </a>
            <Button
              variant="outline"
              className="hidden h-[44px] rounded-[7px] px-4 text-[14px] sm:inline-flex"
              onClick={() => navigate('/onboarding/personal')}
            >
              Modifier mes informations
            </Button>
            <Button
              variant="outline"
              className="h-[44px] rounded-[7px] px-4 text-[14px] disabled:opacity-70"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? 'Déconnexion…' : 'Déconnecter'}
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="outline"
              className="hidden h-[44px] w-[139px] rounded-[7px] px-0 text-[14px] sm:inline-flex"
              onClick={openLoginModal}
            >
              Se connecter
            </Button>
            <Button
              className="h-[44px] w-[132px] rounded-[7px] px-0 text-[14px]"
              onClick={() => navigate('/onboarding/personal')}
            >
              S’inscrire
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
