import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

const Icon = ({ children, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
)

export const QuillIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20.5 3.5c-5.7-.4-10.3 1.4-13.1 5.3-2 2.8-2.5 6-2.6 8.2 2.1.1 5.4-.3 8.2-2.3 4-2.8 5.8-7.4 5.4-11.2" />
    <path d="m4 20 7.5-8.5M8 16h-3" />
  </Icon>
)
export const PlusIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)
export const ArrowIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m9 18 6-6-6-6" />
  </Icon>
)
export const BackIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m15 18-6-6 6-6" />
  </Icon>
)
export const LockIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </Icon>
)
export const CalendarIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
  </Icon>
)
export const MoreIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
  </Icon>
)
export const SparkIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m12 3 1.4 4.3a4.7 4.7 0 0 0 3 3L21 12l-4.4 1.5a4.7 4.7 0 0 0-3 3L12 21l-1.5-4.5a4.7 4.7 0 0 0-3-3L3 12l4.4-1.6a4.7 4.7 0 0 0 3-3Z" />
  </Icon>
)
export const TrashIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
  </Icon>
)
export const CheckIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m5 12 4 4L19 6" />
  </Icon>
)
export const AlertIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16.5v.5" />
  </Icon>
)
