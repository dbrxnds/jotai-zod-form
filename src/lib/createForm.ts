import { atom } from "jotai";
import { z } from "zod";
import { createGetFieldAtom } from "./createGetFieldAtom";
import { createUseField } from "./createUseField";
import { createFieldComponent } from "./createFieldComponent";
import { EqualsFn, FormState } from "./types";
import fastDeepEqual from "fast-deep-equal";
import { createUseFormState } from "./createUseFormState";
import { getByPath, Path } from "dot-path-value";
import { createUseForm } from "./createUseForm";
import { createStore } from "jotai/vanilla";

interface CreateFormArgs<Schema extends z.AnyZodObject> {
  schema: Schema;
  equals?: EqualsFn;
}

export function createForm<Schema extends z.AnyZodObject>({
  schema,
  equals = fastDeepEqual,
}: CreateFormArgs<Schema>) {
  const store = createStore();

  const initialValuesAtom = atom({} as z.output<Schema>);
  const formValuesAtom = atom({} as z.output<Schema>);
  const touchedFieldsAtom = atom([] as Path<z.output<Schema>>[]);

  const dirtyFieldsAtom = atom((get) => {
    const values = get(formValuesAtom);
    const initialValues = get(initialValuesAtom);
    const paths = getPaths(values);
    return paths.filter((path) => {
      const value = getByPath(values, path);
      const initialValue = getByPath(initialValues, path);
      return !equals(value, initialValue);
    });
  });

  const formState: FormState<Schema> = {
    values: formValuesAtom,
    initialValues: initialValuesAtom,
    touchedFields: touchedFieldsAtom,
    dirtyFields: dirtyFieldsAtom,
  };

  const getFieldAtom = createGetFieldAtom({
    formState,
    schema,
  });

  const useField = createUseField({ getFieldAtom });

  return {
    formState,
    Field: createFieldComponent({ useField }),
    useFormState: createUseFormState({ formState, schema }),
    useForm: createUseForm({ formState, store }),
    useField,
    getFieldAtom,
  };
}

function getPaths<T extends Record<string, any>>(
  obj: T,
  path = "",
  paths: string[] = []
): Path<T>[] {
  for (const key of Object.keys(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      getPaths(obj[key], currentPath, paths);
    } else {
      paths.push(currentPath);
    }
  }

  return paths as Path<T>[];
}
