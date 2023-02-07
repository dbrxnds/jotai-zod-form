import { getByPath, Path } from "dot-path-value";
import { z } from "zod";

export function addShapeInfix(dotNotatedString: string): string {
  const parts = dotNotatedString.split(".");
  return parts
    .map((part, i) => {
      if (i === 0) return part;

      if (!isNaN(Number(part))) {
        return `.element`;
      }

      return `.shape.${part}`;
    })
    .join("");
}

export function getPartialZodSchema<Schema extends z.AnyZodObject>(
  schema: Schema,
  path: Path<z.output<Schema>>
) {
  return getByPath(schema.shape, addShapeInfix(path)) as z.ZodTypeAny;
}
