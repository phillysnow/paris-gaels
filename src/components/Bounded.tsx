import clsx from "clsx";

interface BoundedProps {
  as?: React.ElementType;
  yPadding?: "none" | "sm" | "base" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

export function Bounded({
  as: Comp = "div",
  yPadding = "none",
  className,
  children,
}: BoundedProps) {
  return (
    <Comp
      className={clsx(
        "mx-auto w-full max-w-7xl px-4",
        yPadding === "base" && "py-8",
        yPadding === "sm" && "py-4",
        yPadding === "md" && "py-12",
        yPadding === "lg" && "py-20",
        yPadding === "none" && "py-0",
        className,
      )}
    >
      {children}
    </Comp>
  );
}
