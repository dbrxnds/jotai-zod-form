import { z } from "zod";
import { atom, PrimitiveAtom } from "jotai/vanilla";
import { getByPath, Path, PathValue } from "dot-path-value";
import loSet from "lodash.set";

export interface FieldState<T> {
  value: T;
  initialValue: T;
  isDirty: boolean;
  isValid: boolean;
  errors: z.ZodIssue[];
}

function addShapePrefix(dotNotatedString: string): string {
  return dotNotatedString.replace(/\./g, ".shape.");
}

function validatePart<T extends z.AnyZodObject>(schema: T, path: string) {
  const partialSchema: z.ZodTypeAny = getByPath(
    schema.shape,
    addShapePrefix(path)
  );

  return (input: unknown) => partialSchema.safeParse(input);
}

interface CreateGetFieldAtomArgs<T extends z.AnyZodObject> {
  stateAtom: PrimitiveAtom<z.output<T>>;
  initialValuesAtom: PrimitiveAtom<z.output<T>>;
  schema: T;
}

export function createGetFieldAtom<T extends z.AnyZodObject>({
  stateAtom,
  initialValuesAtom,
  schema,
}: CreateGetFieldAtomArgs<T>) {
  return <Field extends Path<z.output<T>>>(field: Field) => {
    const valueAtom = atom(
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

    return atom(
      (get): FieldState<PathValue<z.output<T>, Field>> => {
        const value = get(valueAtom);
        const initialValue = getByPath(get(initialValuesAtom), field);

        const validateResult = validatePart(schema, field)(value);

        return {
          value,
          initialValue,
          isDirty: value !== initialValue,
          isValid: validateResult.success,
          errors: validateResult.success ? [] : validateResult.error.errors,
        };
      },
      (_, set, newValue: PathValue<z.output<T>, Field>) => {
        set(valueAtom, newValue);
      }
    );
  };
}
