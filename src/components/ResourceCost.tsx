import React, { FC } from "react";
import useStore from "../store";
import { ResourceAmount } from "../types.js";

interface Props {
  resourceAmounts: ResourceAmount[];
}

const ResourceCosts: FC<Props> = ({ resourceAmounts }) => {
  return (
    <>
      {resourceAmounts.map((r) => (
        <ResourceCost key={r.resource} resourceAmount={r} />
      ))}
    </>
  );
};

interface ResourceAmountProps {
  resourceAmount: ResourceAmount;
}
const ResourceCost: FC<ResourceAmountProps> = ({ resourceAmount }) => {
  const { resource: resourceName, amount } = resourceAmount;
  const resources = useStore((state) => state.resources);
  const resource = resources[resourceName];
  return (
    <div className="flex flex-row justify-end" title={resourceName}>
      <span>{amount}</span>
      <img className="w-6 h-6 ml-1" src={`ico/${resource.image}`} alt="cost" />
    </div>
  );
};

export default ResourceCosts;
