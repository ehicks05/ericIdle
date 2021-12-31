import useStore from "../store";
import { ResourceAmount } from "../types";

const useIsAffordable = (resourceAmounts: ResourceAmount[]) => {
  const resources = useStore((state) => state.resources);

  const isAffordable = resourceAmounts.every(({ resource, amount }) => {
    return resources[resource].amount >= amount;
  });

  return isAffordable;
};

export default useIsAffordable;
