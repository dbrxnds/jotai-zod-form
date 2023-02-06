import { useAtomValue } from "jotai";
import { ExampleForm } from "../../main";
import { useMemo } from "react";
import { Box } from "./Box";
import { RenderCounter } from "./RenderCounter";

function PersonalOverview() {
  const personalAtom = useMemo(() => ExampleForm.getFieldAtom("personal"), []);
  const personal = useAtomValue(personalAtom);

  return (
    <Box color="orange">
      <h3>Personal</h3>
      <RenderCounter />
      <div>First name: {personal.value.firstName}</div>
    </Box>
  );
}

function AddressOverview() {
  const cityAtom = useMemo(() => ExampleForm.getFieldAtom("address.city"), []);
  const city = useAtomValue(cityAtom);

  return (
    <Box color="blue">
      <h3>Address</h3>
      <RenderCounter />
      <div>
        City:
        <span style={{ color: city.isDirty() ? "red" : "green" }}>
          {city.value}
        </span>
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
