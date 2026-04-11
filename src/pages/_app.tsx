import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import '@/styles/globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Layout from '@/components/Layout'

function isMembersAtmosphere(path: string): boolean {
  return path.startsWith('/members') || path.startsWith('/admin')
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const membersWorld = isMembersAtmosphere(router.pathname)

  return (
    <AuthProvider>
      <Layout membersAtmosphere={membersWorld}>
        {membersWorld ? (
          <div className="members-world">
            <Component {...pageProps} />
          </div>
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </AuthProvider>
  )
}
