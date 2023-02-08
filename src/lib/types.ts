import { z } from "zod";
import { Path, PathValue } from "dot-path-value";
import { Atom, PrimitiveAtom } from "jotai/vanilla";

export type FormState<Schema extends z.AnyZodObject> = {
  values: PrimitiveAtom<z.output<Schema>>;
  initialValues: PrimitiveAtom<z.output<Schema>>;
  touchedFields: PrimitiveAtom<Path<z.output<Schema>>[]>;
  dirtyFields: Atom<Path<z.output<Schema>>[]>;
};

export type FieldState<
  Schema extends z.AnyZodObject,
  Field extends Path<z.output<Schema>>
> = {
  isTouched: boolean;
  isDirty: boolean;
  isValid: boolean;
  value: PathValue<z.output<Schema>, Field>;
  errors: z.ZodIssue[];
};

export type EqualsFn = (a: unknown, b: unknown) => boolean;
