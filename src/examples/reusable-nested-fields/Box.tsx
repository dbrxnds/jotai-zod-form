import { PropsWithChildren } from "react";

export function Box({ children, color }: PropsWithChildren<{ color: string }>) {
  return <div style={{ padding: 16, backgroundColor: color }}>{children}</div>;
}
