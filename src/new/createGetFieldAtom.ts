import { z } from "zod";
import { atom, PrimitiveAtom } from "jotai";
import { focusAtom } from "jotai-optics";
import { optic, OpticFor_ } from "optics-ts";
import { FormState } from "./createForm";
import { Path, PathValue } from "dot-path-value";
import { WritableAtom } from "jotai/vanilla/atom";
import { equals } from "remeda";

interface CreateGetFieldAtomArgs<Schema extends z.AnyZodObject> {
  formStateAtom: PrimitiveAtom<FormState<Schema>>;
  initialValuesAtom: PrimitiveAtom<z.output<Schema>>;
}

export function createGetFieldAtom<Schema extends z.AnyZodObject>({
  formStateAtom,
  initialValuesAtom,
}: CreateGetFieldAtomArgs<Schema>) {
  return <F extends Path<z.output<Schema>>>(field: F) => {
    const fieldParts = field.split(".");
    const pathOptic = createPathOptic(fieldParts);

    const focusedAtom = focusAtom<
      FormState<Schema>,
      PathValue<z.output<Schema>, F>,
      void
    >(formStateAtom, pathOptic);

    const initialValuesFocusedAtom = focusAtom<
      FormState<Schema>,
      PathValue<z.output<Schema>, F>,
      void
    >(initialValuesAtom, pathOptic);

    return atom((get) => {
      const field = get(focusedAtom);
      const initialValues = get(initialValuesFocusedAtom);

      return {
        value: field,
        isDirty: () => !equals(field, initialValues),
      };
    }, focusedAtom.write);
  };
}

function createPathOptic(path: string[]) {
  const first = path[0];
  if (!first) throw new Error("Path cannot be empty");

  return (optic: OpticFor_<any>) => {
    let o = optic.prop(first);
    path.slice(1).forEach((p) => {
      o = o.prop(p);
    });
    return o;
  };
}
