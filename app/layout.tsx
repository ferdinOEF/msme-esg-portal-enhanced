import './globals.css'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MSME ESG Compliance Portal',
  description: 'Single-window ESG compliance & schemes for MSMEs (Goa, India)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b bg-white">
          <div className="container mx-auto px-4 h-12 flex items-center gap-4">
            <Link href="/" className="font-semibold">MSME ESG</Link>
            <div className="ml-auto flex gap-4 text-sm">
              <Link href="/schemes" className="hover:underline">Schemes</Link>
              <Link href="/tools" className="hover:underline">Tools</Link>
              <Link href="/legal" className="hover:underline">Legal Docs</Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  )
}
