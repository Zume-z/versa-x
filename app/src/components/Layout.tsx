import React from 'react'
import Head from 'next/head'

interface LayoutProps {
  title?: string
  metaDescription?: string
  children: React.ReactNode
  className?: string
}

export default function Layout({ children, className }: LayoutProps) {
  return (
    <div>
      <Head>
        <title>Versa X</title>
        <meta name="Versa X is a contextually aware AI assistant seamlessly integrated into your web browser." content="Versa X" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <main className={`mx-auto max-w-7xl px-4 md:px-16 ${className}`}>{children}</main>
      </div>
    </div>
  )
}
