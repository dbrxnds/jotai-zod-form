import { z } from "zod";
import { PrimitiveAtom } from "jotai/vanilla";
import { FormState } from "./types";
import { useAtomValue } from "jotai/react";

interface CreateUseFormStateArgs<Schema extends z.AnyZodObject> {
  formStateAtom: PrimitiveAtom<FormState<Schema>>;
  schema: Schema;
}

export function createUseFormState<Schema extends z.AnyZodObject>({
  formStateAtom,
  schema,
}: CreateUseFormStateArgs<Schema>) {
  return () => {
    const formState = useAtomValue(formStateAtom);

    const validatedValues = schema.safeParse(formState.values);

    return {
      ...formState,
      isValid: validatedValues.success,
      isDirty: formState.dirtyFields.length > 0,
      isTouched: formState.touchedFields.length > 0,
      isPristine: formState.dirtyFields.length === 0,
      errors: validatedValues.success ? [] : validatedValues.error.errors,
    };
  };
}
