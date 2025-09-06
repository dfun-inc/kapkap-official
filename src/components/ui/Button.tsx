'use client';
import Link from 'next/link';

export default function Button({
  className,
  onClick,
  type,
  ...props
}: React.ComponentProps<"button"> & {
    href?: string,
    target?: string,
  }) {
  return (
    <>
    {props.href ? (
      <Link href={props.href} target={props.target} className="btn-common cursor-pointer relative rounded-lg overflow-hidden pb-1 inline-block">
          <div className={"btn-common-box relative bg-[#6E4DFF] rounded-lg z-1 transition-all duration-200 " + className}>
            {props.children}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-[#3e26aa] z-0"></div>
      </Link>
    ) : (
      <button
        data-slot="button"
        className="btn-common cursor-pointer relative rounded-lg overflow-hidden pb-1 inline-block"
        onClick={onClick}
        type={type?type:"button"}
      >
        <div className={"btn-common-box relative bg-[#6E4DFF] rounded-lg z-1 transition-all duration-200 " + className}>
          {props.children}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-[#3e26aa] z-0"></div>
      </button>
    )}
    </>
  )
}