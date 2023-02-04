import { z } from "zod";
import { Fragment, PropsWithChildren, useState } from "react";
import { Provider } from "jotai/react";
import { createStore, PrimitiveAtom } from "jotai/vanilla";
import { useHydrateAtoms } from "jotai/react/utils";

interface CreateFormComponentOptions<Schema extends z.AnyZodObject> {
  schema: Schema;
  stateAtom: PrimitiveAtom<z.output<Schema>>;
  initialValuesAtom: PrimitiveAtom<z.output<Schema>>;
  equals: (a: z.output<Schema>, b: z.output<Schema>) => boolean;
}

interface FormProps<Schema extends z.AnyZodObject> {
  initialValues: z.output<Schema>;
  onSubmit: (values: z.output<Schema>) => Promise<void> | void;
}

export function createFormComponent<Schema extends z.AnyZodObject>({
  schema,
  stateAtom,
  initialValuesAtom,
  equals,
}: CreateFormComponentOptions<Schema>) {
  return ({
    initialValues,
    onSubmit,
    children,
  }: PropsWithChildren<FormProps<Schema>>) => {
    const [store] = useState(() => createStore());

    if (!equals(store.get(initialValuesAtom), initialValues)) {
      store.set(initialValuesAtom, initialValues);
    }

    return (
      <Provider store={store}>
        <HydrateAtoms initialValues={[[stateAtom, initialValues]]}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(schema.parse(store.get(stateAtom)));
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
