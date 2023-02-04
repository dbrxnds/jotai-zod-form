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

function validatePart<Schema extends z.AnyZodObject>(
  schema: Schema,
  path: string
) {
  const partialSchema: z.ZodTypeAny = getByPath(
    schema.shape,
    addShapePrefix(path)
  );

  return (input: unknown) => partialSchema.safeParse(input);
}

interface CreateGetFieldAtomArgs<Schema extends z.AnyZodObject> {
  formStateAtom: PrimitiveAtom<z.output<Schema>>;
  initialValuesAtom: PrimitiveAtom<z.output<Schema>>;
  schema: Schema;
  equals: (a: z.output<Schema>, b: z.output<Schema>) => boolean;
}

export function createGetFieldAtom<Schema extends z.AnyZodObject>({
  formStateAtom,
  initialValuesAtom,
  schema,
  equals,
}: CreateGetFieldAtomArgs<Schema>) {
  return <Field extends Path<z.output<Schema>>>(field: Field) => {
    const valueAtom = atom(
      (get) => {
        const fields = get(formStateAtom);

        return getByPath(fields, field);
      },
      (get, set, newValue: PathValue<z.output<Schema>, Field>) => {
        const fields = get(formStateAtom);
        const clone = structuredClone(fields);
        const finalNewValue = loSet(clone, field, newValue);
        set(formStateAtom, finalNewValue);
      }
    );

    return atom(
      (get): FieldState<PathValue<z.output<Schema>, Field>> => {
        const value = get(valueAtom);
        const initialValue = getByPath(get(initialValuesAtom), field);

        const validateResult = validatePart(schema, field)(value);

        return {
          value,
          initialValue,
          isDirty: !equals(value, initialValue),
          isValid: validateResult.success,
          errors: validateResult.success ? [] : validateResult.error.errors,
        };
      },
      (_, set, newValue: PathValue<z.output<Schema>, Field>) => {
        set(valueAtom, newValue);
      }
    );
  };
}
