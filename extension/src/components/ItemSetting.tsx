import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

interface ItemSettingProps {
  label: string
  onSelect?: any
  className?: string
  icon?: React.ReactNode
}

export default function ItemSetting({ label, icon, className, onSelect }: ItemSettingProps) {
  return (
    <DropdownMenu.Item className={`group flex cursor-pointer rounded-lg p-2 text-sm  text-gray-300  focus:text-white focus:outline-none ${className}`} onSelect={(e) => onSelect && onSelect(e)}>
      <div className="flex-1 ">
        <div className="flex items-center">
          {icon && <div className="h-4 w-4 ">{icon}</div>}
          <div className="ml-2">
            <span className="focus-group-hover:text-white text-sm">{label}</span>
          </div>
        </div>
      </div>
    </DropdownMenu.Item>
  )
}
