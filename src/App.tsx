import { createForm } from "./form/createForm";
import { z } from "zod";
import { useAtomValue } from "jotai/react";

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

const firstNameAtom = DemoForm.getFieldAtom("firstName");
const lastNameAtom = DemoForm.getFieldAtom("lastName");
const addressAtom = DemoForm.getFieldAtom("address");

function Form() {
  return (
    <div>
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
    <div>
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
    <div>
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
