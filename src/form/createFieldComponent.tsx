import { z } from "zod";
import { Path, PathValue } from "dot-path-value";
import { createGetFieldAtom, FieldState } from "./createGetFieldAtom";
import { Fragment, useState } from "react";
import { useAtom } from "jotai/react";

interface FieldComponentRenderProps<
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
  getFieldAtom: ReturnType<typeof createGetFieldAtom<Schema>>;
}

export function createFieldComponent<Schema extends z.AnyZodObject>({
  getFieldAtom,
}: CreateFieldComponentOptions<Schema>) {
  return <Field extends Path<z.output<Schema>>>({
    name,
    children,
  }: FieldComponentProps<Schema, Field>) => {
    const [atom] = useState(() => getFieldAtom(name));
    const [field, setValue] = useAtom(atom);

    return <Fragment>{children({ ...field, setValue })}</Fragment>;
  };
}
