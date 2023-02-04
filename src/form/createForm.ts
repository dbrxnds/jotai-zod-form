import { z } from "zod";
import { createFormComponent } from "./createFormComponent";
import { atom } from "jotai/vanilla";
import { createGetFieldAtom } from "./createGetFieldAtom";
import { createFieldComponent } from "./createFieldComponent";
import { createUseField } from "./createUseField";

interface FormOptions<Schema extends z.AnyZodObject> {
  schema: Schema;
  equals?: (a: z.output<Schema>, b: z.output<Schema>) => boolean;
}

export function createForm<Schema extends z.AnyZodObject>({
  schema,
  equals = (a, b) => a === b,
}: FormOptions<Schema>) {
  const formStateAtom = atom({});
  const initialValuesAtom = atom({});

  const getFieldAtom = createGetFieldAtom({
    formStateAtom,
    initialValuesAtom,
    schema,
    equals,
  });

  const useField = createUseField({ getFieldAtom });

  return {
    Form: createFormComponent({
      schema,
      stateAtom: formStateAtom,
      initialValuesAtom,
      equals,
    }),
    Field: createFieldComponent({ useField }),
    getFieldAtom,
    getFormStateAtom: () => formStateAtom,
    useField,
  };
}
