import { atom } from "jotai";
import { z } from "zod";
import { createFormComponent } from "./createFormComponent";
import { createGetFieldAtom } from "./createGetFieldAtom";
import { createUseField } from "./createUseField";
import { createFieldComponent } from "./createFieldComponent";
import { EqualsFn, FormState } from "./types";
import fastDeepEqual from "fast-deep-equal";

interface CreateFormArgs<Schema extends z.AnyZodObject> {
  schema: Schema;
  equals?: EqualsFn;
}

export function createForm<Schema extends z.AnyZodObject>({
  schema,
  equals = fastDeepEqual,
}: CreateFormArgs<Schema>) {
  const formStateAtom = atom({} as FormState<Schema>);

  const getFieldAtom = createGetFieldAtom({ formStateAtom, schema, equals });
  const useField = createUseField({ getFieldAtom });

  return {
    formStateAtom,
    Form: createFormComponent({ formStateAtom, schema }),
    Field: createFieldComponent({ useField }),
    useField,
    getFieldAtom,
  };
}
