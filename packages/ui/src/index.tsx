import React from "react";

/** Minimal card with inline styles to avoid extra dependencies */
export type CardProps = React.PropsWithChildren<{
  title?: string;
  subtitle?: string;
  style?: React.CSSProperties;
}>;

export const Card: React.FC<CardProps> = ({ title, subtitle, style, children }) => {
  return (
    <div
      style={{
        borderRadius: 12,
        padding: 16,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        color: "#e6f7ff",
        ...style
      }}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: 8 }}>
          {title && <div style={{ fontSize: 18, fontWeight: 600 }}>{title}</div>}
          {subtitle && <div style={{ fontSize: 12, opacity: 0.7 }}>{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export type StackProps = React.PropsWithChildren<{ gap?: number; style?: React.CSSProperties }>;
export const Stack: React.FC<StackProps> = ({ gap = 12, style, children }) => {
  return (
    <div style={{ display: "grid", gap, ...style }}>
      {children}
    </div>
  );
};

/** Simple text primitives */
export const H1: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "0.02em" }}>{children}</div>
);
export const H2: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "0.02em", opacity: 0.9 }}>{children}</div>
);
export const Text: React.FC<React.PropsWithChildren<{ dim?: boolean }>> = ({ dim, children }) => (
  <div style={{ fontSize: 14, opacity: dim ? 0.7 : 0.9 }}>{children}</div>
);

export default { Card, Stack, H1, H2, Text };
