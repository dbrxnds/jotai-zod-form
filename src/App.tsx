import { createForm } from "./form/createForm";
import { z } from "zod";
import { useAtomValue } from "jotai/react";
import { useRef } from "react";

const DemoForm = createForm({
  schema: z.object({
    firstName: z.string().max(3),
    lastName: z.string(),
    address: z.object({
      street: z.string(),
      city: z.string(),
    }),
  }),
});

function RenderCounter() {
  const renderCounter = useRef(0);
  renderCounter.current = renderCounter.current + 1;
  return <h1>Renders: {renderCounter.current}</h1>;
}

const firstNameAtom = DemoForm.getFieldAtom("firstName");
const lastNameAtom = DemoForm.getFieldAtom("lastName");
const addressAtom = DemoForm.getFieldAtom("address");

function Form() {
  return (
    <div style={{ padding: 8, backgroundColor: "orange" }}>
      <RenderCounter />
      <h3>General Info</h3>
      <DemoForm.Field name="firstName">
        {({ value, setValue }) => (
          <label>
            First name:
            <input value={value} onChange={(e) => setValue(e.target.value)} />
          </label>
        )}
      </DemoForm.Field>
      <br />
      <DemoForm.Field name="lastName">
        {({ value, setValue }) => (
          <label>
            Last name:
            <input value={value} onChange={(e) => setValue(e.target.value)} />
          </label>
        )}
      </DemoForm.Field>
      <h3>Address</h3>
      <DemoForm.Field name="address.street">
        {({ value, setValue }) => (
          <label>
            Street:
            <input value={value} onChange={(e) => setValue(e.target.value)} />
          </label>
        )}
      </DemoForm.Field>
      <br />
      <DemoForm.Field name="address.city">
        {({ value, setValue }) => (
          <label>
            City:
            <input value={value} onChange={(e) => setValue(e.target.value)} />
          </label>
        )}
      </DemoForm.Field>
    </div>
  );
}

function Overview() {
  const lastName = useAtomValue(lastNameAtom);
  const firstName = useAtomValue(firstNameAtom);

  return (
    <div style={{ padding: 8, backgroundColor: "red" }}>
      <RenderCounter />
      First name: {firstName.value} - Dirty:{""}
      {firstName.isDirty ? "Yurp" : "nope"} - isValid:{" "}
      {firstName.isValid ? "yurp" : "nope"} <br />
      Last name: {lastName.value} <br />
      <AddressOverview />
    </div>
  );
}

function AddressOverview() {
  const address = useAtomValue(addressAtom);

  return (
    <div style={{ padding: 8, backgroundColor: "green" }}>
      <RenderCounter />
      City: {address.value.city} <br />
      street: {address.value.street}
    </div>
  );
}

function Demo() {
  return (
    <>
      <DemoForm.Form
        initialValues={{
          firstName: "firstName",
          lastName: "lastName",
          address: {
            city: "",
            street: "",
          },
        }}
        onSubmit={(values) => console.log({ values })}
      >
        <Form />
        <hr />
        <Overview />
        <button type="submit">Submit</button>
      </DemoForm.Form>
    </>
  );
}

function App() {
  return <Demo />;
}

export default App;
