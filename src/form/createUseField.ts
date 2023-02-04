import { z } from "zod";
import { createGetFieldAtom } from "./createGetFieldAtom";
import { Path } from "dot-path-value";
import { useMemo } from "react";
import { useAtom } from "jotai/react";

interface CreateUseFieldArgs<Schema extends z.AnyZodObject> {
  getFieldAtom: ReturnType<typeof createGetFieldAtom<Schema>>;
}

export function createUseField<Schema extends z.AnyZodObject>({
  getFieldAtom,
}: CreateUseFieldArgs<Schema>) {
  return <Field extends Path<z.output<Schema>>>(field: Field) => {
    const atom = useMemo(() => getFieldAtom(field), [field]);
    return useAtom(atom);
  };
}
