import { z } from "zod";
import { FormState } from "./types";
import { useAtomValue } from "jotai/react";

interface CreateUseFormStateArgs<Schema extends z.AnyZodObject> {
  formState: FormState<Schema>;
  schema: Schema;
}

export function createUseFormState<Schema extends z.AnyZodObject>({
  formState,
  schema,
}: CreateUseFormStateArgs<Schema>) {
  return () => {
    const values = useAtomValue(formState.values);
    const initialValues = useAtomValue(formState.initialValues);
    const dirtyFields = useAtomValue(formState.dirtyFields);
    const touchedFields = useAtomValue(formState.touchedFields);

    const validatedValues = schema.safeParse(values);

    return {
      values,
      initialValues,
      dirtyFields,
      touchedFields,
      isValid: validatedValues.success,
      isDirty: dirtyFields.length > 0,
      isTouched: touchedFields.length > 0,
      errors: validatedValues.success ? [] : validatedValues.error.errors,
    };
  };
}
