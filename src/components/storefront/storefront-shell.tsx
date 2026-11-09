import React from 'react';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { CONTENT_TOKENS } from '@/modules/content';
import { IDENTITY_TOKENS, getSessionToken } from '@/modules/identity-access';
import { StorefrontHeader } from './storefront-header';
import { StorefrontFooter } from './storefront-footer';
import { MobileBottomNav } from './mobile-bottom-nav';

export async function StorefrontShell({ children }: { children: React.ReactNode }) {
  const container = createAppContainer();
  const getMenu = container.resolve(CONTENT_TOKENS.GetMenuUseCase);

  const [headerMenuRes, footerCatRes, footerSupportRes] = await Promise.all([
    getMenu.execute({ code: 'header_main' }),
    getMenu.execute({ code: 'footer_categories' }),
    getMenu.execute({ code: 'footer_support' }),
  ]);

  const token = await getSessionToken();
  let userRole: string | null = null;
  if (token) {
    const getCurrentUser = container.resolve(IDENTITY_TOKENS.GetCurrentUserUseCase);
    const uRes = await getCurrentUser.execute({ sessionToken: token });
    if (uRes.isOk && uRes.value) {
      userRole = uRes.value.role;
    }
  }

  const headerItems = headerMenuRes.isOk && headerMenuRes.value ? headerMenuRes.value.items : [];
  const footerCatItems = footerCatRes.isOk && footerCatRes.value ? footerCatRes.value.items : [];
  const footerSupportItems = footerSupportRes.isOk && footerSupportRes.value ? footerSupportRes.value.items : [];

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100">
      <StorefrontHeader menuItems={headerItems} userRole={userRole} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <StorefrontFooter categoryItems={footerCatItems} supportItems={footerSupportItems} />
      <MobileBottomNav userRole={userRole} />
    </div>
  );
}
