import React from "react";
import Button from "./Button";
import ResourceCosts from "./ResourceCost";
import useStore from "../store";
import { Tech } from "../types";
import useIsAffordable from "../hooks/useIsAffordable";

const Technologies = () => {
  const techs = useStore((state) => state.techs);

  return (
    <table className="">
      <thead>
        <tr>
          <th className="px-2 text-left"></th>
          <th className="px-2 text-right">Price</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {Object.values(techs)
          .filter((tech) => tech.status !== "hidden")
          .map((tech) => (
            <Technology key={tech.name} tech={tech} />
          ))}
      </tbody>
    </table>
  );
};

const Technology = ({ tech }: { tech: Tech }) => {
  const adjustResource = useStore((state) => state.adjustResource);
  const techs = useStore((state) => state.techs);
  const setTech = useStore((state) => state.setTech);

  const isAffordable = useIsAffordable(tech.price);

  const makeDiscovery = (tech: Tech) => {
    if (tech.discovered || !isAffordable) return;

    adjustResource("research", -tech.price[0].amount);
    setTech(tech.name as keyof typeof techs, "discovered", true);
  };

  return (
    <tr>
      <td className="px-2">
        <div className="flex">
          <img
            className="w-6 h-6 mr-1"
            src={`ico/${tech.image}`}
            alt="technology"
          />
          {tech.name}
        </div>
      </td>
      <td className="px-2 text-right">
        <ResourceCosts key={tech.name} resourceAmounts={tech.price} />
      </td>
      <td className="px-2">
        <Button
          disabled={tech.discovered || !isAffordable}
          onClick={() => makeDiscovery(tech)}
        >
          {tech.discovered ? "Discovered" : "Discover"}
        </Button>
      </td>
    </tr>
  );
};

export default Technologies;
