'use client';
import Link from 'next/link';

export default function Button({
  className,
  onClick,
  type,
  disabled = false,
  ...props
}: React.ComponentProps<"button"> & {
    href?: string,
    target?: string,
    disabled?: boolean
  }) {
  return (
    <>
    {props.href ? (
      <Link href={props.href} target={props.target} className="btn-common cursor-pointer relative rounded-lg overflow-hidden pb-1 inline-block">
        <div className={"btn-common-box relative rounded-lg z-1 transition-all duration-200 " + className + (disabled ? " cursor-not-allowed bg-[#767676]" : " bg-[#6E4DFF] ")}>
          {props.children}
        </div>
        <div className={"absolute bottom-0 left-0 w-full h-2 z-0 " + (disabled ? " bg-[#565656]" : " bg-[#3e26aa] ")}></div>
      </Link>
    ) : (
      <button
        data-slot="button"
        className="btn-common cursor-pointer relative rounded-lg overflow-hidden pb-1 inline-block"
        onClick={onClick}
        type={type?type:"button"}
      >
        <div className={"btn-common-box relative rounded-lg z-1 transition-all duration-200 " + className + (disabled ? " cursor-not-allowed bg-[#767676]" : " bg-[#6E4DFF] ")}>
          {props.children}
        </div>
        <div className={"absolute bottom-0 left-0 w-full h-2 z-0 " + (disabled ? " bg-[#565656]" : " bg-[#3e26aa] ")}></div>
      </button>
    )}
    </>
  )
}