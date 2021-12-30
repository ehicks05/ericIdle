import React from "react";
import Button from "./Button";
import ResourceCost from "./ResourceCost";
import useStore from "../store";
import { Tech } from "../types";

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
  const resources = useStore((state) => state.resources);
  const adjustResource = useStore((state) => state.adjustResource);
  const techs = useStore((state) => state.techs);
  const setTechs = useStore((state) => state.setTechs);

  const makeDiscovery = (tech: Tech) => {
    const canAfford = resources.research.amount >= tech.price[0].amount;

    if (tech.discovered || !canAfford) return;

    adjustResource("research", -tech.price[0].amount);
    setTechs({
      ...techs,
      [tech.name]: {
        ...tech,
        discovered: true,
      },
    });
  };

  const canAfford = resources.research.amount >= tech.price[0].amount;

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
        <ResourceCost key={tech.name} resourceAmounts={tech.price} />
      </td>
      <td className="px-2">
        <Button
          disabled={tech.discovered || !canAfford}
          onClick={() => makeDiscovery(tech)}
        >
          {tech.discovered ? "Discovered" : "Discover"}
        </Button>
      </td>
    </tr>
  );
};

export default Technologies;
