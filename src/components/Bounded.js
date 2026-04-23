import clsx from "clsx";

/**
 * Constrains content to a max width with horizontal padding; optional vertical padding.
 */
export function Bounded({
  as: Comp = "div",
  yPadding = "none",
  className,
  children,
}) {
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
