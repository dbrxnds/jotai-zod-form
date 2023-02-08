import { z } from "zod";
import { FormState } from "./types";
import { useAtomValue } from "jotai/react";
import { createStore } from "jotai/vanilla";

interface CreateUseFormStateArgs<Schema extends z.AnyZodObject> {
  formState: FormState<Schema>;
  schema: Schema;
  store: ReturnType<typeof createStore>;
}

export function createUseFormState<Schema extends z.AnyZodObject>({
  formState,
  schema,
  store,
}: CreateUseFormStateArgs<Schema>) {
  return () => {
    const values = useAtomValue(formState.values, { store });
    const initialValues = useAtomValue(formState.initialValues, { store });
    const dirtyFields = useAtomValue(formState.dirtyFields, { store });
    const touchedFields = useAtomValue(formState.touchedFields, { store });

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
