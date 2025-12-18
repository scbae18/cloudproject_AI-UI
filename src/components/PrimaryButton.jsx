export default function PrimaryButton({
  children,
  variant = "primary", // primary | outline | ghost | danger
  size = "md", // sm | md | lg
  loading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}) {
  const v =
    variant === "primary"
      ? "btn btn--primary"
      : variant === "outline"
      ? "btn btn--outline"
      : variant === "danger"
      ? "btn btn--danger"
      : "btn btn--ghost";

  const s = size === "lg" ? "btn--lg" : size === "sm" ? "btn--sm" : "";
  const cls = `${v} ${s} ${className}`.trim();

  return (
    <button className={cls} disabled={disabled || loading} {...props}>
      <span className="btn__inner">
        {loading && <span className="btnSpinner" aria-hidden="true" />}
        {!loading && leftIcon && <span className="btnIcon">{leftIcon}</span>}
        <span className="btnText">{children}</span>
        {!loading && rightIcon && <span className="btnIcon">{rightIcon}</span>}
      </span>
    </button>
  );
}
