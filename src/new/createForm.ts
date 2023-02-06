import { atom } from "jotai";
import { z } from "zod";
import { createFormComponent } from "./createFormComponent";
import { createGetFieldAtom } from "./createGetFieldAtom";

export type FormState<Schema extends z.AnyZodObject> = z.output<Schema>;

interface CreateFormArgs<Schema extends z.AnyZodObject> {
  schema: Schema;
  equals?: (a: z.output<Schema>, b: z.output<Schema>) => boolean;
}

export function createForm<Schema extends z.AnyZodObject>({
  schema,
}: CreateFormArgs<Schema>) {
  const formStateAtom = atom({} as FormState<Schema>);
  const initialValuesAtom = atom({} as z.output<Schema>);

  return {
    formStateAtom,
    Form: createFormComponent({ schema, formStateAtom, initialValuesAtom }),
    getFieldAtom: createGetFieldAtom({ formStateAtom, initialValuesAtom }),
  };
}
