import { useAtomValue } from "jotai";
import { ExampleForm } from "../../main";
import { useMemo } from "react";
import { Box } from "./Box";
import { RenderCounter } from "./RenderCounter";

function PersonalOverview() {
  const personalAtom = useMemo(
    () => ExampleForm.getFieldAtom((optic) => optic.prop("personal")),
    []
  );
  const personal = useAtomValue(personalAtom);

  return (
    <Box color="green">
      <h3>Personal</h3>
      <RenderCounter />
      <div>First name: {personal.values.firstName.value}</div>
    </Box>
  );
}

function AddressOverview() {
  const addressAtom = useMemo(
    () => ExampleForm.getFieldAtom((optic) => optic.prop("address")),
    []
  );
  const address = useAtomValue(addressAtom);

  console.log(address);

  return (
    <Box color="blue">
      <h3>Address</h3>
      <RenderCounter />
      <div>City: {address.values.city.value}</div>
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
