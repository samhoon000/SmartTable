import { Outlet, useLocation } from 'react-router-dom'
import { TopNav } from './top-nav.jsx'
import { SiteFooter } from './site-footer.jsx'

export function AppLayout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-svh flex-col bg-stone-50">
      <TopNav />
      <main className="flex-1">
        <div key={pathname} className="page-transition-main">
          <Outlet />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
