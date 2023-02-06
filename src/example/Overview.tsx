import { ExampleForm } from "../../main";
import { Box } from "./Box";
import { RenderCounter } from "./RenderCounter";

function PersonalOverview() {
  const personal = ExampleForm.useField("personal");

  return (
    <Box color="orange">
      <h3>Personal</h3>
      <RenderCounter />
      <div>First name: {personal.value.firstName}</div>
    </Box>
  );
}

function AddressOverview() {
  const cityField = ExampleForm.useField("address.city");

  return (
    <Box color="blue">
      <h3>Address</h3>
      <RenderCounter />
      <div>
        City:
        <span style={{ color: cityField.isDirty ? "red" : "green" }}>
          {cityField.value}
        </span>
        <pre>{JSON.stringify(cityField, null, 2)}</pre>
      </div>
    </Box>
  );
}

export function Overview() {
  return (
    <div>
      <AddressOverview />
      <PersonalOverview />
    </div>
  );
}
