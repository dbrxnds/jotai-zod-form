import { z } from "zod";
import { Fragment, PropsWithChildren, useMemo } from "react";
import { Provider } from "jotai/react";
import { createStore, PrimitiveAtom } from "jotai/vanilla";
import { useHydrateAtoms } from "jotai/react/utils";
import { FormState } from "./createForm";

interface CreateFormComponentArgs<Schema extends z.AnyZodObject> {
  schema: Schema;
  formStateAtom: PrimitiveAtom<FormState<Schema>>;
  initialValuesAtom: PrimitiveAtom<z.output<Schema>>;
}

export interface FormProps<Schema extends z.AnyZodObject> {
  initialValues: FormState<Schema>;
  onSubmit: (values: z.output<Schema>) => Promise<void> | void;
}

export function createFormComponent<Schema extends z.AnyZodObject>({
  schema,
  formStateAtom,
  initialValuesAtom,
}: CreateFormComponentArgs<Schema>) {
  return ({
    initialValues,
    onSubmit,
    children,
  }: PropsWithChildren<FormProps<Schema>>) => {
    const store = useMemo(() => createStore(), []);

    store.set(initialValuesAtom, initialValues);

    return (
      <Provider store={store}>
        <HydrateAtoms initialValues={[[formStateAtom, initialValues]]}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // onSubmit(schema.parse(store.get(stateAtom)));
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
