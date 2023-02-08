import { z } from "zod";
import { FormState } from "./types";
import { createStore } from "jotai/vanilla";
import { FormEvent, useEffect } from "react";
import { useHydrateAtoms } from "jotai/utils";

interface CreateUseFormArgs<Schema extends z.AnyZodObject> {
  formState: FormState<Schema>;
  store: ReturnType<typeof createStore>;
}

interface UseFormArgs<Schema extends z.AnyZodObject> {
  defaultValues: z.output<Schema>;
}

export function createUseForm<Schema extends z.AnyZodObject>({
  formState,
  store,
}: CreateUseFormArgs<Schema>) {
  return ({ defaultValues }: UseFormArgs<Schema>) => {
    useHydrateAtoms(
      new Map([
        [formState.values, defaultValues],
        [formState.initialValues, defaultValues],
      ])
    );

    useEffect(() => {
      store.set(formState.values, defaultValues);
      store.set(formState.initialValues, defaultValues);
    }, []);

    return {
      values: store.get(formState.values),
      dirtyFields: store.get(formState.dirtyFields),
      touchedFields: store.get(formState.touchedFields),
      handleSubmit: (cb: (values: z.output<Schema>) => void) => {
        return (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          cb(store.get(formState.values));
        };
      },
    };
  };
}
