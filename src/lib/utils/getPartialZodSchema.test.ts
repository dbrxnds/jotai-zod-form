import { describe, expect, test } from "vitest";
import { getPartialZodSchema } from "./getPartialZodSchema";
import { z } from "zod";

const schema = z.object({
  a: z.string(),
  b: z.number(),
  c: z.object({
    f: z.object({
      i: z.array(z.string()),
      j: z.array(z.object({ k: z.string() })),
    }),
  }),
});

describe("getPartialZodSchema", () => {
  test("root level properties", () => {
    const partialASchema = getPartialZodSchema(schema, "a");
    const partialBSchema = getPartialZodSchema(schema, "b");

    const result = partialASchema.safeParse("foo");
    const result2 = partialBSchema.safeParse(1);

    expect(result.success).toBe(true);
    expect(result2.success).toBe(true);
  });

  test("nested object properties", () => {
    const partialSchema = getPartialZodSchema(schema, "c.f");

    const badResult = partialSchema.safeParse({
      g: "foo",
      h: 1,
      i: ["bar"],
    });

    const goodResult = partialSchema.safeParse({
      i: ["bar"],
      j: [{ k: "foo" }],
    });

    expect(badResult.success).toBe(false);
    expect(goodResult.success).toBe(true);
  });

  test("nested array properties", () => {
    const partialSchema = getPartialZodSchema(schema, "c.f.i");

    const result = partialSchema.safeParse(["foo", "bar"]);

    expect(result.success).toBe(true);
  });

  test("nested array index", () => {
    const partialSchema = getPartialZodSchema(schema, "c.f.i.0");

    const result = partialSchema.safeParse("foo");

    expect(result.success).toBe(true);
  });

  test("nested object in array index", () => {
    const partialSchema = getPartialZodSchema(schema, "c.f.j.0.k");

    const result = partialSchema.safeParse("foo");

    expect(result.success).toBe(true);
  });
});
