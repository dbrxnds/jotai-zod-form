import { z } from "zod";
import { Fragment, PropsWithChildren, useState } from "react";
import { Provider } from "jotai/react";
import { createStore, PrimitiveAtom } from "jotai/vanilla";
import { useHydrateAtoms } from "jotai/react/utils";
import { FieldState } from "./createGetFieldAtom";

interface CreateFormComponentOptions<Schema extends z.AnyZodObject> {
  schema: Schema;
  stateAtom: PrimitiveAtom<z.output<Schema>>;
  initialValuesAtom: PrimitiveAtom<z.output<Schema>>;
  equals: (a: z.output<Schema>, b: z.output<Schema>) => boolean;
}

interface FormComponentRenderProps<Schema extends z.AnyZodObject>
  extends FieldState<z.output<Schema>> {
  initialValues: z.output<Schema>;
}

interface FormProps<Schema extends z.AnyZodObject> {
  initialValues: z.output<Schema>;
  onSubmit: (values: z.output<Schema>) => Promise<void> | void;
  children:
    | ((props: FormComponentRenderProps<Schema>) => JSX.Element)
    | JSX.Element
    | JSX.Element[];
}

export function createFormComponent<Schema extends z.AnyZodObject>({
  schema,
  stateAtom,
  initialValuesAtom,
  equals,
}: CreateFormComponentOptions<Schema>) {
  return ({ initialValues, onSubmit, children }: FormProps<Schema>) => {
    const [store] = useState(() => createStore());
    const currentValue = store.get(stateAtom);

    if (!equals(store.get(initialValuesAtom), initialValues)) {
      store.set(initialValuesAtom, initialValues);
    }

    const validatedForm = schema.safeParse(currentValue);

    const finalChildren =
      typeof children === "function"
        ? children({
            initialValues,
            value: currentValue,
            initialValue: initialValues,
            isDirty: !equals(currentValue, initialValues),
            isValid: validatedForm.success,
            errors: validatedForm.success ? [] : validatedForm.error.errors,
          })
        : children;

    return (
      <Provider store={store}>
        <HydrateAtoms initialValues={[[stateAtom, initialValues]]}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(schema.parse(store.get(stateAtom)));
            }}
          >
            {finalChildren}
          </form>
        </HydrateAtoms>
      </Provider>
    );
  };
}

interface HydrateAtomsProps {
  initialValues: Parameters<typeof useHydrateAtoms>[0];
}

function HydrateAtoms({
  initialValues,
  children,
}: PropsWithChildren<HydrateAtomsProps>) {
  useHydrateAtoms(initialValues);
  return <Fragment>{children}</Fragment>;
}
