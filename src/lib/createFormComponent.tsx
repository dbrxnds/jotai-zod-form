import { z } from "zod";
import { Fragment, PropsWithChildren, useMemo } from "react";
import { Provider } from "jotai/react";
import { createStore } from "jotai/vanilla";
import { useHydrateAtoms } from "jotai/react/utils";
import { FormState } from "./types";

interface CreateFormComponentArgs<Schema extends z.AnyZodObject> {
  formState: FormState<Schema>;
  schema: Schema;
}

export interface FormProps<Schema extends z.AnyZodObject> {
  initialValues: z.output<Schema>;
  onSubmit: (values: z.output<Schema>) => Promise<void> | void;
}

export function createFormComponent<Schema extends z.AnyZodObject>({
  formState,
  schema,
}: CreateFormComponentArgs<Schema>) {
  return ({
    initialValues,
    onSubmit,
    children,
  }: PropsWithChildren<FormProps<Schema>>) => {
    const store = useMemo(() => createStore(), []);

    return (
      <Provider store={store}>
        <HydrateAtoms
          initialValues={[
            [formState.initialValues, initialValues],
            [formState.values, initialValues],
          ]}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const validatedValues = schema.safeParse(
                store.get(formState.values)
              );

              validatedValues.success ? onSubmit(validatedValues.data) : null;
            }}
          >
            {children}
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
