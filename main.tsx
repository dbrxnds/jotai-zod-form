import React from "react";
import ReactDOM from "react-dom/client";
import { createForm } from "./src/new/createForm";
import { z } from "zod";
import { useAtom, useSetAtom } from "jotai";
import { Overview } from "./src/example/Overview";
import { focusAtom } from "jotai-optics";

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

const cityAtom = focusAtom(ExampleForm.formStateAtom, (optic) =>
  optic.prop("address").prop("values").prop("city").prop("value")
);
function Demo() {
  const [city, setCity] = useAtom(cityAtom);

  return (
    <div>
      <input onChange={(e) => setCity(e.target.value)} />
    </div>
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
