import ReactDOM from "react-dom/client";
import { createForm } from "../lib/createForm";
import { z } from "zod";
import { Overview } from "./Overview";
import { Box } from "./Box";
import { RenderCounter } from "./RenderCounter";

export const ExampleForm = createForm({
  schema: z.object({
    personal: z.object({
      firstName: z.string(),
      lastName: z.string(),
      pets: z.array(z.object({ name: z.string() })),
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
    pets: [{ name: "Dog" }],
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
  const formState = ExampleForm.useFormState();

  return (
    <Box color="tomato">
      <pre>{JSON.stringify(formState, null, 2)}</pre>
      <RenderCounter />
      <ExampleForm.Field name="address.city">
        {({ getInputProps }) => <input {...getInputProps()} />}
      </ExampleForm.Field>
      <input {...streetField.getInputProps()} />
      <input type="number" {...numberField.getInputProps()} />
      <ExampleForm.Field name="personal.pets.0.name">
        {(field) => <pre>{JSON.stringify(field, null, 2)}</pre>}
      </ExampleForm.Field>
      <pre>{JSON.stringify(numberField, null, 2)}</pre>
    </Box>
  );
}

function App() {
  return (
    <ExampleForm.Form
      initialValues={initialValues}
      onSubmit={(values) => console.log({ values })}
    >
      <Demo />
      <Overview />
      <button type="submit">Submit</button>
    </ExampleForm.Form>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
