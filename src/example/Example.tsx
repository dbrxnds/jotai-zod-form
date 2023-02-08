import ReactDOM from "react-dom/client";
import { createForm } from "../lib/createForm";
import { z } from "zod";
import { Box } from "./Box";
import { RenderCounter } from "./RenderCounter";

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

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

function PetItem({ index }: { index: number }) {
  const petNameField = ExampleForm.useField(`personal.pets.${index}.name`);

  return (
    <Box color={getRandomColor()}>
      <label>
        Name
        <input {...petNameField.getInputProps()} />
      </label>
      <pre>{JSON.stringify(petNameField, null, 2)}</pre>
    </Box>
  );
}

function Demo() {
  const pets = ExampleForm.useField("personal.pets");

  return (
    <Box color="tomato">
      <RenderCounter />
      <ExampleForm.Field name="address.city">
        {({ getInputProps }) => <input {...getInputProps()} />}
      </ExampleForm.Field>
      {pets.value.map((_, index) => (
        <PetItem key={index} index={index} />
      ))}

      <button
        type="button"
        onClick={() => {
          pets.setValue((prev) => [...prev, { name: "" }]);
        }}
      >
        Add pet
      </button>
    </Box>
  );
}

function DebugDemo() {
  const formState = ExampleForm.useFormState();

  return <pre>{JSON.stringify(formState, null, 2)}</pre>;
}

function App() {
  return (
    <ExampleForm.Form
      initialValues={initialValues}
      onSubmit={(values) => console.log({ values })}
    >
      <Demo />
      <DebugDemo />
    </ExampleForm.Form>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
