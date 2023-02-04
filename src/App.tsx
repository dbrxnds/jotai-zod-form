import { createForm } from "./form/createForm";
import { z } from "zod";
import { useAtom } from "jotai/react";

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
const addressStreetAtom = DemoForm.getFieldAtom("address.street");
const addressCityAtom = DemoForm.getFieldAtom("address.city");

function Child() {
  return (
    <DemoForm.Field name="firstName">
      {({ value, setValue }) => (
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      )}
    </DemoForm.Field>
  );
}

function Overview() {
  const [field, setField] = useAtom(firstNameAtom);

  return <div>Overview: {field}</div>;
}

function Child2() {
  return (
    <div>
      <DemoForm.Field name="lastName">
        {({ value, setValue }) => (
          <input value={value} onChange={(e) => setValue(e.target.value)} />
        )}
      </DemoForm.Field>
      <DemoForm.Field name="address.street">
        {({ value, setValue }) => (
          <input value={value} onChange={(e) => setValue(e.target.value)} />
        )}
      </DemoForm.Field>
    </div>
  );
}

function Overview2() {
  const [field, setField] = useAtom(lastNameAtom);
  const [addressStreet, setAddressStreet] = useAtom(addressStreetAtom);

  return (
    <div>
      Overview: {field} - street: {addressStreet}
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
        <Child />
        <Overview />
        <Child2 />
        <Overview2 />
        <button type="submit">Submit</button>
      </DemoForm.Form>
      <div style={{ margin: "60px 0" }} />
      <DemoForm.Form
        initialValues={{
          firstName: "firstName 2",
          lastName: "lastName 2",
          address: {
            city: "",
            street: "",
          },
        }}
        onSubmit={(values) => console.log({ values })}
      >
        <Child />
        <Overview />
        <Child2 />
        <Overview2 />
        <button type="submit">Submit 2</button>
      </DemoForm.Form>
    </>
  );
}

function App() {
  return <Demo />;
}

export default App;
