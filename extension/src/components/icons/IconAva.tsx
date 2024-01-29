export default function IconAva({ className, borderColour, strokeWidth }: { className?: string; borderColour?: string; strokeWidth?: number }) {
  return (
    <svg className={className} width="1000" height="1000" viewBox="0 0 1000 1000" fill="currentFill" xmlns="http://www.w3.org/2000/svg">
      <path d="M272.838 146.803L499.759 18.2017L726.68 146.803V403.989L499.759 532.591L272.838 403.989V146.803Z" fill="currentColor" stroke={borderColour} strokeWidth={strokeWidth ? strokeWidth : 5} />
      <path d="M530.186 586.572L757.107 457.971L984.028 586.572V843.759L757.107 972.36L530.186 843.759V586.572Z" fill="currentColor" stroke={borderColour} strokeWidth={strokeWidth ? strokeWidth : 5} />
      <path d="M15.9751 586.572L242.896 457.971L469.817 586.572V843.759L242.896 972.36L15.9751 843.759V586.572Z" fill="currentColor" stroke={borderColour} strokeWidth={strokeWidth ? strokeWidth : 5} />
    </svg>
  )
}
