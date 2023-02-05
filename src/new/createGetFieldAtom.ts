import { z } from "zod";
import { atom, PrimitiveAtom } from "jotai";
import { getByPath, Path, PathValue } from "dot-path-value";
import { FormState } from "./toFormState";
import { focusAtom } from "jotai-optics";
import { OpticFor } from "optics-ts";

function addValuesPrefix(dotNotatedString: string): string {
  return dotNotatedString.replace(/\./g, ".values.");
}

interface CreateGetFieldAtomArgs<Schema extends z.AnyZodObject> {
  formStateAtom: PrimitiveAtom<FormState<Schema>>;
}

type FieldCallback<Schema extends z.AnyZodObject> = Parameters<
  typeof focusAtom<FormState<Schema>, FormState<Schema>, void>
>[1];

export function createGetFieldAtom<Schema extends z.AnyZodObject>({
  formStateAtom,
}: CreateGetFieldAtomArgs<Schema>) {
  return (field: FieldCallback<Schema>) => {
    return focusAtom(formStateAtom, field);

    return atom((get) => {
      const field = get(focusedAtom);

      return {
        ...field,
      };
    }, focusedAtom.write);
  };
}
