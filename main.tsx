import { useMemo } from "react";
import ReactDOM from "react-dom/client";
import { createForm } from "./src/new/createForm";
import { z } from "zod";
import { useAtom } from "jotai";

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
  const cityAtom = useMemo(() => ExampleForm.getFieldAtom("address.city"), []);
  const [city, setCity] = useAtom(cityAtom);
  city.address.console.log({ city });

  return <div></div>;
}

function App() {
  return (
    <ExampleForm.Form initialValues={initialValues} onSubmit={() => {}}>
      <Demo />
      {/*<Overview />*/}
    </ExampleForm.Form>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
