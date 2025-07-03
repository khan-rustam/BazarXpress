import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/components/app-provider'
import SiteFrame from '@/components/SiteFrame'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'BazarXpress | All your desired here..',
  description: 'Design and Developed by Rustam Khan',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <SiteFrame>
            {children}
          </SiteFrame>
          <Toaster position="top-right" reverseOrder={false} />
        </AppProvider>
      </body>
    </html>
  )
}