import { z } from "zod";
import { Path, PathValue } from "dot-path-value";

export type FormState<Schema extends z.AnyZodObject> = {
  values: z.output<Schema>;
  initialValues: z.output<Schema>;
  touchedFields: string[];
  dirtyFields: string[];
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
