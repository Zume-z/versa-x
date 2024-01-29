import Link from 'next/link'

interface ButtonLinkProps {
  href: string
  className?: string
  text: string
}

export default function ButtonLink({ href, className, text }: ButtonLinkProps) {
  return (
    <Link href={href} className={className}>
      {text}
    </Link>
  )
}
