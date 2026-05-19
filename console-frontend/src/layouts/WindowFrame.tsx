import type { ReactNode } from "react";

export default function WindowFrame({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="window-frame">
      <div className="window-titlebar">
        <div className="window-controls">
          <span />
          <span />
          <span />
        </div>
        <strong>{title}</strong>
      </div>
      <div className="window-content">{children}</div>
    </section>
  );
}
