import React from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@radix-ui/react-icons'

const AccordionItem = React.forwardRef(({ children, value }: { children: React.ReactNode; value: string; className?: string }, forwardedRef: React.Ref<HTMLDivElement> | undefined) => (
  <Accordion.Item className={' transition-200 mt-px overflow-hidden rounded border border-gray-500 bg-gray-800/30 py-2 focus-within:relative focus-within:z-10 hover:border-white '} value={value} ref={forwardedRef}>
    {children}
  </Accordion.Item>
))

const AccordionTrigger = React.forwardRef(({ children }: { children: React.ReactNode; className?: string }, forwardedRef: React.Ref<HTMLButtonElement> | undefined) => (
  <Accordion.Header className="flex">
    <Accordion.Trigger className={' group flex h-[45px] flex-1 cursor-pointer  items-center justify-between px-5 text-lg leading-none focus:outline-none'} ref={forwardedRef}>
      {children}
      <ChevronDownIcon className=" h-6 w-6 flex-shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180" aria-hidden />
    </Accordion.Trigger>
  </Accordion.Header>
))

const AccordionContent = React.forwardRef(({ children }: { children: React.ReactNode; className?: string }, forwardedRef: React.Ref<HTMLDivElement> | undefined) => (
  <Accordion.Content className={'text-lg'} ref={forwardedRef}>
    <div className="px-5 py-[15px] text-base">{children}</div>
  </Accordion.Content>
))

export default function Accordian({ data }: { data: { title: string; content: string }[] }) {
  return (
    <Accordion.Root className="w-full flex-col space-y-4 rounded-md  text-white  " type="single" defaultValue="item-1" collapsible>
      {data.map((item, index) => (
        <AccordionItem key={index} value={`${index}`}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent className="text-gray-500">{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion.Root>
  )
}
