import { z } from "zod";
import { createFormComponent } from "./createFormComponent";
import { atom, PrimitiveAtom } from "jotai/vanilla";
import { getByPath, Path, PathValue } from "dot-path-value";
import loSet from "lodash.set";

interface FormOptions<T extends z.AnyZodObject> {
  schema: T;
}

export function createForm<T extends z.AnyZodObject>({
  schema,
}: FormOptions<T>) {
  const stateAtom = atom({});

  return {
    Form: createFormComponent({ schema, stateAtom }),
    getFieldAtom: createGetFieldAtom({ stateAtom }),
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
