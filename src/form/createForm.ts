import { z } from "zod";
import { createFormComponent } from "./createFormComponent";
import { atom } from "jotai/vanilla";
import { createGetFieldAtom } from "./createGetFieldAtom";
import { createFieldComponent } from "./createFieldComponent";

interface FormOptions<T extends z.AnyZodObject> {
  schema: T;
}

export function createForm<T extends z.AnyZodObject>({
  schema,
}: FormOptions<T>) {
  const stateAtom = atom({});
  const initialValuesAtom = atom({});

  const getFieldAtom = createGetFieldAtom({
    stateAtom,
    initialValuesAtom,
    schema,
  });

  return {
    Form: createFormComponent({ schema, stateAtom, initialValuesAtom }),
    getFieldAtom,
    Field: createFieldComponent<T>({ getFieldAtom }),
  };
}
