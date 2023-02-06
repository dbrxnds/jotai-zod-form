import { createUseField } from "./createUseField";
import { Path } from "dot-path-value";
import { z } from "zod";
import { Fragment } from "react";

interface CreateFormComponentArgs<Schema extends z.AnyZodObject> {
  useField: ReturnType<typeof createUseField<Schema>>;
}

interface FieldProps<Schema extends z.AnyZodObject> {
  name: Path<z.output<Schema>>;
  children: <T>(props: T) => JSX.Element;
}

export function createFieldComponent<Schema extends z.AnyZodObject>({
  useField,
}: CreateFormComponentArgs<Schema>) {
  return ({ name, children }: FieldProps<Schema>) => {
    const field = useField(name);

    return <Fragment>{children(field)}</Fragment>;
  };
}
