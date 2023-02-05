import { z } from "zod";
import { atom, PrimitiveAtom } from "jotai";
import { focusAtom } from "jotai-optics";
import { optic } from "optics-ts";
import { FormState } from "./createForm";
import { Path, PathValue } from "dot-path-value";

interface CreateGetFieldAtomArgs<Schema extends z.AnyZodObject> {
  formStateAtom: PrimitiveAtom<FormState<Schema>>;
  initialValuesAtom: PrimitiveAtom<z.output<Schema>>;
}

type FieldCallback<Schema extends z.AnyZodObject> = typeof optic<
  FormState<Schema>
>;

type FieldState<
  Schema extends z.AnyZodObject,
  Field extends Path<z.output<Schema>>
> = {
  value: PathValue<Schema, Field>;
  isDirty: boolean;
};

export function createGetFieldAtom<Schema extends z.AnyZodObject>({
  formStateAtom,
  initialValuesAtom,
}: CreateGetFieldAtomArgs<Schema>) {
  return <F extends Path<z.output<Schema>>>(
    field: F
  ): PrimitiveAtom<FieldState> => {
    const fieldParts = field.split(".");

    const focusedAtom = focusAtom(formStateAtom, (optic) => {
      let o = optic;
      fieldParts.forEach((part) => {
        o = o.prop(part);
      });
      return o;
    });
    const initialValuesFocusedAtom = focusAtom(initialValuesAtom, (optic) => {
      let o = optic;
      fieldParts.forEach((part) => {
        o = o.prop(part);
      });
      return o;
    });

    return atom((get) => {
      const field = get(focusedAtom);
      console.log("field", field);
      const initialValues = get(initialValuesFocusedAtom);

      return {
        value: field,
        isDirty: !Object.is(field, initialValues),
      };
    }, focusedAtom.write);
  };
}
