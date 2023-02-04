import { z } from "zod";
import { createFormComponent } from "./createFormComponent";
import { atom, PrimitiveAtom } from "jotai/vanilla";
import { getByPath, Path, PathValue } from "dot-path-value";
import loSet from "lodash.set";
import { Fragment, useState } from "react";
import { useAtom } from "jotai/react";

interface FormOptions<T extends z.AnyZodObject> {
  schema: T;
}

export function createForm<T extends z.AnyZodObject>({
  schema,
}: FormOptions<T>) {
  const stateAtom = atom({});

  const getFieldAtom = createGetFieldAtom<T>({ stateAtom });

  return {
    Form: createFormComponent({ schema, stateAtom }),
    getFieldAtom,
    Field: createFieldComponent<T>({ getFieldAtom }),
  };
}

interface CreateUseFieldOptions<T extends z.AnyZodObject> {
  stateAtom: PrimitiveAtom<z.output<T>>;
}

export function createGetFieldAtom<T extends z.AnyZodObject>({
  stateAtom,
}: CreateUseFieldOptions<T>) {
  return <Field extends Path<z.output<T>>>(field: Field) => {
    return atom(
      (get) => {
        const fields = get(stateAtom);
        return getByPath(fields, field);
      },
      (get, set, newValue: PathValue<z.output<T>, Field>) => {
        const fields = get(stateAtom);
        const clone = structuredClone(fields);
        const finalNewValue = loSet(clone, field, newValue);
        set(stateAtom, finalNewValue);
      }
    );
  };
}

interface FieldComponentRenderProps<
  T extends z.AnyZodObject,
  Field extends Path<z.output<T>>
> {
  value: PathValue<z.output<T>, Field>;
  setValue: (newValue: PathValue<z.output<T>, Field>) => void;
}

interface FieldComponentProps<
  T extends z.AnyZodObject,
  Field extends Path<z.output<T>>
> {
  name: Field;
  children: (props: FieldComponentRenderProps<T, Field>) => JSX.Element;
}

interface CreateFieldComponentOptions<T extends z.AnyZodObject> {
  getFieldAtom: ReturnType<typeof createGetFieldAtom>;
}

function createFieldComponent<T extends z.AnyZodObject>({
  getFieldAtom,
}: CreateFieldComponentOptions<T>) {
  return <Field extends Path<z.output<T>>>({
    name,
    children,
  }: FieldComponentProps<T, Field>) => {
    const [atom] = useState(() => getFieldAtom(name));
    const [value, setValue] = useAtom(atom);

    return <Fragment>{children({ value, setValue })}</Fragment>;
  };
}
