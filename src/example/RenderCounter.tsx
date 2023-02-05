import { useEffect, useRef } from "react";

export function RenderCounter() {
  const count = useRef(0);
  useEffect(() => {
    count.current++;
  });

  return <h4>Render count: {count.current}</h4>;
}
