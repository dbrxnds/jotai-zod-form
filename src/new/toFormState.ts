import { z } from "zod";

function isZodType(input: unknown): input is z.ZodType {
  return input instanceof z.ZodType;
}

function isOfZodType(t: z.ZodTypeAny, type: z.ZodFirstPartyTypeKind): boolean {
  if (t._def?.typeName === type) {
    return true;
  }
  if (
    t._def?.typeName === z.ZodFirstPartyTypeKind.ZodEffects &&
    (t as z.ZodEffects<any>)._def.effect.type === "refinement"
  ) {
    return isOfZodType((t as z.ZodEffects<any>).innerType(), type);
  }
  if (t._def?.innerType) {
    return isOfZodType(t._def?.innerType, type);
  }
  return false;
}

function isZodObject(t: z.ZodTypeAny): t is z.AnyZodObject {
  return isOfZodType(t, z.ZodFirstPartyTypeKind.ZodObject);
}

type BaseFormState = {
  isDirty: boolean;
  isTouched: boolean;
  isValid: boolean;
  errors: string[];
};

export type FormState<Schema extends z.AnyZodObject> = {
  [K in keyof Schema["shape"]]: Schema["shape"][K] extends z.SomeZodObject
    ? BaseFormState & { values: FormState<Schema["shape"][K]> }
    : BaseFormState & {
        value: z.output<Schema["shape"][K]>;
      };
};

export function toFormState<Schema extends z.AnyZodObject>(
  initialValues: z.output<Schema>
): FormState<Schema> {
  return Object.entries(initialValues).reduce((acc, [key, value]) => {
    if (typeof value === "object") {
      return {
        ...acc,
        [key]: {
          isDirty: false,
          isTouched: false,
          isValid: true,
          errors: [],
          values: toFormState(value),
        },
      };
    }

    return {
      ...acc,
      [key]: {
        value,
        isDirty: false,
        isTouched: false,
        isValid: true,
        errors: [],
      },
    };
  }, {} as FormState<Schema>);
}
