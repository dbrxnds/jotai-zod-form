import ReactDOM from "react-dom/client";
import { createForm } from "../lib/createForm";
import { z } from "zod";
import { Overview } from "./Overview";
import { Box } from "./Box";
import { RenderCounter } from "./RenderCounter";
import { useAtomValue } from "jotai/react";

export const ExampleForm = createForm({
  schema: z.object({
    personal: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
    address: z.object({
      street: z.string(),
      city: z.string(),
      number: z.number(),
    }),
  }),
});

const initialValues = {
  personal: {
    firstName: "John",
    lastName: "Doe",
  },
  address: {
    street: "Main Street",
    city: "New York",
    number: 1,
  },
};

function Demo() {
  const streetField = ExampleForm.useField("address.street");
  const numberField = ExampleForm.useField("address.number");
  const formState = useAtomValue(ExampleForm.formStateAtom);

  return (
    <Box color="tomato">
      <pre>{JSON.stringify(formState, null, 2)}</pre>
      <RenderCounter />
      <ExampleForm.Field name="address.city">
        {({ getInputProps }) => <input {...getInputProps()} />}
      </ExampleForm.Field>
      <input {...streetField.getInputProps()} />
      <input type="number" {...numberField.getInputProps()} />
      <pre>{JSON.stringify(numberField, null, 2)}</pre>
    </Box>
  );
}

function App() {
  return (
    <ExampleForm.Form initialValues={initialValues} onSubmit={() => {}}>
      <Demo />
      <Overview />
    </ExampleForm.Form>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
