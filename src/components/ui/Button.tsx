'use client';


export default function Button({
  className,
  href = '',
  target = '',
  ...props
}: React.ComponentProps<"button"> & {
    href?: string,
    target?: string,
  }) {
  const Comp:any = href ? 'a' : 'button';
  return (
    <Comp
      data-slot="button"
      className="btn-common cursor-pointer relative rounded-lg overflow-hidden pb-1 inline-block"
      href={href}
      target={target}
    >
      <div className={"btn-common-box relative bg-[#6E4DFF] rounded-lg z-1 transition-all duration-200 " + className}>
        {props.children}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-[#3e26aa] z-0"></div>
    </Comp>
  )
}