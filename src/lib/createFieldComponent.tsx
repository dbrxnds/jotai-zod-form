import { createUseField, UseFieldReturn } from "./createUseField";
import { Path } from "dot-path-value";
import { z } from "zod";
import { Fragment } from "react";

interface CreateFormComponentArgs<Schema extends z.AnyZodObject> {
  useField: ReturnType<typeof createUseField<Schema>>;
}

interface FieldProps<
  Schema extends z.AnyZodObject,
  Field extends Path<z.output<Schema>>
> {
  name: Field;
  children: (props: UseFieldReturn<Schema, Field>) => JSX.Element;
}

export function createFieldComponent<Schema extends z.AnyZodObject>({
  useField,
}: CreateFormComponentArgs<Schema>) {
  return <Field extends Path<z.output<Schema>>>({
    name,
    children,
  }: FieldProps<Schema, Field>) => {
    const field = useField(name);

    return <Fragment>{children(field)}</Fragment>;
  };
}
