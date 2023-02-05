import { useAtomValue } from "jotai";
import { ExampleForm } from "../../main";
import { useMemo } from "react";
import { Box } from "./Box";
import { RenderCounter } from "./RenderCounter";

function PersonalOverview() {
  const personalAtom = useMemo(() => ExampleForm.getFieldAtom("personal"), []);
  const personal = useAtomValue(personalAtom);

  return (
    <Box color="green">
      <h3>Personal</h3>
      <RenderCounter />
      <div>First name: {personal.value.firstName}</div>
    </Box>
  );
}

function AddressOverview() {
  const addressAtom = useMemo(() => ExampleForm.getFieldAtom("address"), []);
  const address = useAtomValue(addressAtom);

  return (
    <Box color="blue">
      <h3>Address</h3>
      <RenderCounter />
      <div>City: {address.value.city}</div>
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
