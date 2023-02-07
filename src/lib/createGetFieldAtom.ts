import { z } from "zod";
import { atom, PrimitiveAtom } from "jotai";
import { focusAtom } from "jotai-optics";
import { OpticFor_ } from "optics-ts";
import { Path, PathValue } from "dot-path-value";
import { selectAtom } from "jotai/utils";
import { EqualsFn, FormState } from "./types";
import { SetStateAction } from "jotai/vanilla";
import { getPartialZodSchema } from "./utils/getPartialZodSchema";

interface CreateGetFieldAtomArgs<Schema extends z.AnyZodObject> {
  formStateAtom: PrimitiveAtom<FormState<Schema>>;
  schema: Schema;
  equals: EqualsFn;
}

export function createGetFieldAtom<Schema extends z.AnyZodObject>({
  formStateAtom,
  schema,
  equals,
}: CreateGetFieldAtomArgs<Schema>) {
  return <Field extends Path<z.output<Schema>>>(field: Field) => {
    type Value = PathValue<z.output<Schema>, Field>;
    const fieldParts = field.split(".");

    const focusedAtom = focusAtom<FormState<Schema>, Value, void>(
      formStateAtom,
      createPathOptic(["values", ...fieldParts])
    );

    const initialValueAtom = focusAtom<FormState<Schema>, Value, void>(
      formStateAtom,
      createPathOptic(["initialValues", ...fieldParts])
    );

    const isTouchedAtom = selectAtom(formStateAtom, (formState) =>
      formState.touchedFields.includes(field)
    );
    const isDirtyAtom = selectAtom(formStateAtom, (formState) =>
      formState.dirtyFields.includes(field)
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
        set(formStateAtom, (prev) => {
          const initialValue = get(initialValueAtom);
          const currentValue = get(focusedAtom);

          const finalNewValue =
            // @ts-expect-error
            typeof newValue === "function" ? newValue(currentValue) : newValue;

          const isDirty = !equals(initialValue, finalNewValue);
          const newDirtyFields = isDirty
            ? [...prev.dirtyFields, field]
            : prev.dirtyFields.filter((f) => f !== field);

          return {
            ...prev,
            touchedFields: unique([...prev.touchedFields, field]),
            dirtyFields: unique(newDirtyFields),
          };
        });

        focusedAtom.write(get, set, newValue);
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
      const finalPart = !isNaN(Number(part)) ? Number(part) : part;
      o = o.prop(finalPart);
    });
    return o;
  };
}

function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}
