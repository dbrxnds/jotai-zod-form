import { createGetFieldAtom } from "./createGetFieldAtom";
import { useAtom } from "jotai/react";
import { ChangeEvent, useMemo } from "react";
import { Path } from "dot-path-value";
import { z } from "zod";

interface CreateUseFieldArgs<Schema extends z.AnyZodObject> {
  getFieldAtom: ReturnType<typeof createGetFieldAtom<Schema>>;
}

export function createUseField<Schema extends z.AnyZodObject>({
  getFieldAtom,
}: CreateUseFieldArgs<Schema>) {
  return <F extends Path<z.output<Schema>>>(name: F) => {
    const atom = useMemo(() => getFieldAtom(name), [name]);
    const [field, setField] = useAtom(atom);

    const getInputProps = () => {
      return {
        value: field.value,
        onChange: getInputOnChange(setField),
        onFocus: () => setField((prev) => prev),
      };
    };

    return {
      ...field,
      setValue: setField,
      getInputProps,
    };
  };
}

function getInputOnChange<Value>(
  setValue: (value: Value | ((current: Value) => Value)) => void
) {
  return (val: Value | ChangeEvent<unknown> | ((current: Value) => Value)) => {
    if (!val) {
      setValue(val as Value);
    } else if (typeof val === "function") {
      setValue(val);
    } else if (typeof val === "object" && "nativeEvent" in val) {
      const { currentTarget } = val;
      if (currentTarget instanceof HTMLInputElement) {
        if (currentTarget.type === "checkbox") {
          setValue(currentTarget.checked as any);
        } else if (currentTarget.type === "number") {
          setValue(currentTarget.valueAsNumber as any);
        } else {
          setValue(currentTarget.value as any);
        }
      } else if (
        currentTarget instanceof HTMLTextAreaElement ||
        currentTarget instanceof HTMLSelectElement
      ) {
        setValue(currentTarget.value as any);
      }
    } else {
      setValue(val);
    }
  };
}
