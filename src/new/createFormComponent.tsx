import { z } from "zod";
import { Fragment, PropsWithChildren, useState } from "react";
import { Provider } from "jotai/react";
import { atom, createStore, PrimitiveAtom } from "jotai/vanilla";
import { useHydrateAtoms } from "jotai/react/utils";
import { FormState, toFormState } from "./toFormState";

interface CreateFormComponentArgs<Schema extends z.AnyZodObject> {
  schema: Schema;
  formStateAtom: PrimitiveAtom<FormState<Schema>>;
}

type FormComponentRenderProps<Schema extends z.AnyZodObject> =
  FormState<Schema> & {
    initialValues: z.output<Schema>;
  };

export interface FormProps<Schema extends z.AnyZodObject> {
  initialValues: z.output<Schema>;
  onSubmit: (values: z.output<Schema>) => Promise<void> | void;
}

function toAtoms<Schema extends z.AnyZodObject>(
  formState: FormState<Schema>
): Record<string, PrimitiveAtom<FormState<Schema>>> {
  return Object.entries(formState).reduce((acc, [key, value]) => {
    if (typeof value === "object") {
      return {
        ...acc,
        [key]: atom(toAtoms(value)),
      };
    }

    return {
      ...acc,
      [key]: atom(value),
    };
  }, {});
}

export function createFormComponent<Schema extends z.AnyZodObject>({
  schema,
  formStateAtom,
}: CreateFormComponentArgs<Schema>) {
  return ({
    initialValues,
    onSubmit,
    children,
  }: PropsWithChildren<FormProps<Schema>>) => {
    const [store] = useState(() => createStore());

    const initialFormState = toFormState(initialValues);

    return (
      <Provider store={store}>
        <HydrateAtoms initialValues={[[formStateAtom, initialFormState]]}>
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
