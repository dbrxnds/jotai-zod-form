import { z } from "zod";
import { createFormComponent } from "./createFormComponent";
import { atom } from "jotai/vanilla";
import { createGetFieldAtom } from "./createGetFieldAtom";
import { createFieldComponent } from "./createFieldComponent";

interface FormOptions<Schema extends z.AnyZodObject> {
  schema: Schema;
  equals?: (a: z.output<Schema>, b: z.output<Schema>) => boolean;
}

export function createForm<Schema extends z.AnyZodObject>({
  schema,
  equals = (a, b) => a === b,
}: FormOptions<Schema>) {
  const stateAtom = atom({});
  const initialValuesAtom = atom({});

  const getFieldAtom = createGetFieldAtom({
    stateAtom,
    initialValuesAtom,
    schema,
    equals,
  });

  return {
    Form: createFormComponent({ schema, stateAtom, initialValuesAtom, equals }),
    getFieldAtom,
    Field: createFieldComponent<Schema>({ getFieldAtom }),
  };
}
