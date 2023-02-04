import { z } from "zod";
import { Path, PathValue } from "dot-path-value";
import { FieldState } from "./createGetFieldAtom";
import { Fragment } from "react";
import { createUseField } from "./createUseField";

export interface FieldComponentRenderProps<
  Schema extends z.AnyZodObject,
  Field extends Path<z.output<Schema>>,
  Value extends PathValue<z.output<Schema>, Field> = PathValue<
    z.output<Schema>,
    Field
  >
> extends FieldState<Value> {
  setValue: (newValue: Value) => void;
}

interface FieldComponentProps<
  Schema extends z.AnyZodObject,
  Field extends Path<z.output<Schema>>
> {
  name: Field;
  children: (props: FieldComponentRenderProps<Schema, Field>) => JSX.Element;
}

interface CreateFieldComponentOptions<Schema extends z.AnyZodObject> {
  useField: ReturnType<typeof createUseField<Schema>>;
}

export function createFieldComponent<Schema extends z.AnyZodObject>({
  useField,
}: CreateFieldComponentOptions<Schema>) {
  return <Field extends Path<z.output<Schema>>>({
    name,
    children,
  }: FieldComponentProps<Schema, Field>) => {
    const [field, setValue] = useField(name);

    return <Fragment>{children({ ...field, setValue })}</Fragment>;
  };
}
