export default function Layout({ children, handleModal }: { children: React.ReactNode; handleModal: () => Promise<void> }) {
  return (
    <>
      <div id={'versaX_overlay'} className="fixed left-0 top-0 z-[999999999991] h-screen w-screen bg-black/50 " />
      <div onClick={() => handleModal()} id={'versaX_wrapper'} className="fixed left-0 top-0 z-[999999999992] flex h-screen w-screen">
        <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} id={'versaX_layout'} className="relative z-[999999999993] m-auto flex h-[475px] w-[775px] overflow-clip rounded-lg border border-gray-500 bg-dark-void text-base text-white shadow-lg ">
          {children}
        </div>
      </div>
    </>
  )
}
