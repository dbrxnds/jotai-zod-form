import { z } from "zod";
import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { optic_, OpticFor_ } from "optics-ts";
import { Path, PathValue } from "dot-path-value";
import { selectAtom } from "jotai/utils";
import { FormState } from "./types";
import { SetStateAction } from "jotai/vanilla";
import { getPartialZodSchema } from "./utils/getPartialZodSchema";

optic_().path();

interface CreateGetFieldAtomArgs<Schema extends z.AnyZodObject> {
  formState: FormState<Schema>;
  schema: Schema;
}

export function createGetFieldAtom<Schema extends z.AnyZodObject>({
  formState,
  schema,
}: CreateGetFieldAtomArgs<Schema>) {
  return <Field extends Path<z.output<Schema>>>(field: Field) => {
    type Value = PathValue<z.output<Schema>, Field>;
    const fieldParts = field.split(".");

    const focusedAtom = focusAtom<z.output<Schema>, Value, void>(
      formState.values,
      createPathOptic(fieldParts)
    );

    const isTouchedAtom = selectAtom(formState.touchedFields, (touchedFields) =>
      touchedFields.includes(field)
    );
    const isDirtyAtom = selectAtom(formState.dirtyFields, (dirtyFields) =>
      dirtyFields.includes(field)
    );

    const validateField = getPartialZodSchema(schema, field);

    return atom(
      (get) => {
        const value = get(focusedAtom);
        const isTouched = get(isTouchedAtom);
        const isDirty = get(isDirtyAtom);

        const validateResult = validateField.safeParse(value);

        return {
          value,
          isDirty,
          isValid: validateResult.success,
          errors: validateResult.success ? [] : validateResult.error?.errors,
          isTouched,
        };
      },
      (get, set, newValue: SetStateAction<Value>) => {
        focusedAtom.write(get, set, newValue);

        const value = get(focusedAtom);

        if (!Array.isArray(value)) {
          set(formState.touchedFields, (prev) => unique([...prev, field]));
        }
      }
    );
  };
}

function createPathOptic(path: string[]) {
  const first = path[0];
  if (!first) throw new Error("Path cannot be empty");

  return (optic: OpticFor_<any>) => {
    let o = optic.prop(first);
    path.slice(1).forEach((part) => {
      const isPartNumber = !isNaN(Number(part));
      // @ts-expect-error This works and im not smart enough to figure out how to type it
      o = isPartNumber ? o.at(Number(part)) : o.prop(part);
    });
    return o;
  };
}

function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}
