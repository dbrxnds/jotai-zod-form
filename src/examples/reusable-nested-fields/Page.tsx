import ReactDOM from "react-dom/client";
import { createForm } from "../../lib/createForm";
import { z } from "zod";
import { Box } from "./Box";
import { RenderCounter } from "./RenderCounter";
import { createContext, PropsWithChildren, useContext, useState } from "react";

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export const createFormWrapper = () =>
  createForm({
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

export const ExampleForm = createFormWrapper();
export const ExampleForm2 = createFormWrapper();

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
  const form = useFormContext();
  const petNameField = form.useField(`personal.pets.${index}.name`);

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

function SharedComponent() {
  const form = useFormContext();
  const pets = form.useField("personal.pets");

  return (
    <Box color={getRandomColor()}>
      <RenderCounter />
      <form.Field name="address.city">
        {({ getInputProps }) => <input {...getInputProps()} />}
      </form.Field>
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

type ExampleForm = ReturnType<typeof createFormWrapper>;

const FormContext = createContext<ExampleForm | null>(null);

function FormProvider({
  form,
  children,
}: PropsWithChildren<{ form: ExampleForm }>) {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
}

function useFormContext() {
  const form = useContext(FormContext);

  if (!form) {
    throw new Error("useFormContext must be used within a FormProvider");
  }

  return form;
}

function Foo() {
  const form = ExampleForm.useForm({
    defaultValues: initialValues,
  });

  const submitHandler = form.handleSubmit(async (values) => {
    console.log("Inside Foo", values);
  });

  return (
    <FormProvider form={ExampleForm}>
      <form onSubmit={submitHandler}>
        <SharedComponent />
      </form>
    </FormProvider>
  );
}

function Bar() {
  const form = ExampleForm2.useForm({
    defaultValues: {
      ...initialValues,
      address: {
        ...initialValues.address,
        city: "Amsterdam",
      },
    },
  });

  const submitHandler = form.handleSubmit(async (values) => {
    console.log("Inside Bar", values);
  });

  return (
    <FormProvider form={ExampleForm2}>
      <form onSubmit={submitHandler}>
        <SharedComponent />
      </form>
    </FormProvider>
  );
}

function Wrapper() {
  const [show, setShow] = useState(true);

  return (
    <>
      <button onClick={() => setShow(!show)}>Toggle</button>
      {show && (
        <>
          <Foo />
          <Bar />
        </>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Wrapper />
);
