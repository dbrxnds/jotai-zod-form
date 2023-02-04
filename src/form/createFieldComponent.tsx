import { z } from "zod";
import { Path, PathValue } from "dot-path-value";
import { createGetFieldAtom, FieldState } from "./createGetFieldAtom";
import { Fragment, useState } from "react";
import { useAtom } from "jotai/react";

interface FieldComponentRenderProps<
  T extends z.AnyZodObject,
  Field extends Path<z.output<T>>,
  Value extends PathValue<z.output<T>, Field> = PathValue<z.output<T>, Field>
> extends FieldState<Value> {
  setValue: (newValue: Value) => void;
}

interface FieldComponentProps<
  T extends z.AnyZodObject,
  Field extends Path<z.output<T>>
> {
  name: Field;
  children: (props: FieldComponentRenderProps<T, Field>) => JSX.Element;
}

interface CreateFieldComponentOptions<T extends z.AnyZodObject> {
  getFieldAtom: ReturnType<typeof createGetFieldAtom<T>>;
}

export function createFieldComponent<T extends z.AnyZodObject>({
  getFieldAtom,
}: CreateFieldComponentOptions<T>) {
  return <Field extends Path<z.output<T>>>({
    name,
    children,
  }: FieldComponentProps<T, Field>) => {
    const [atom] = useState(() => getFieldAtom(name));
    const [field, setValue] = useAtom(atom);

    return <Fragment>{children({ ...field, setValue })}</Fragment>;
  };
}
