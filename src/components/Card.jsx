export default function Card({
  title,
  subtitle,
  children,
  footer,
  icon,
  actions,
  onClick,
  hoverable = true,
  className = "",
}) {
  const clickable = typeof onClick === "function";
  const cls = `card ${hoverable ? "card--hover" : ""} ${clickable ? "card--click" : ""} ${className}`.trim();

  return (
    <div
      className={cls}
      onClick={onClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={(e) => clickable && e.key === "Enter" && onClick?.()}
    >
      {(title || subtitle || icon || actions) && (
        <div className="card__head">
          <div className="card__headLeft">
            {icon && <div className="card__icon">{icon}</div>}
            <div>
              {title && <div className="card__title">{title}</div>}
              {subtitle && <div className="card__sub">{subtitle}</div>}
            </div>
          </div>
          {actions && <div className="card__actions">{actions}</div>}
        </div>
      )}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}
