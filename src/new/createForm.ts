import { atom, PrimitiveAtom } from "jotai";
import { Primitive, z } from "zod";
import { createFormComponent } from "./createFormComponent";
import { createGetFieldAtom } from "./createGetFieldAtom";
import { FormState } from "./toFormState";

interface CreateFormArgs<Schema extends z.AnyZodObject> {
  schema: Schema;
  equals?: (a: z.output<Schema>, b: z.output<Schema>) => boolean;
}

export function createForm<Schema extends z.AnyZodObject>({
  schema,
}: CreateFormArgs<Schema>) {
  const formStateAtom = atom({} as FormState<Schema>);

  const getFieldAtom = createGetFieldAtom({ formStateAtom });

  return {
    formStateAtom,
    Form: createFormComponent({ schema, formStateAtom }),
    getFieldAtom,
  };
}
