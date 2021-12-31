import React from "react";
import ResourceCost from "./ResourceCost";
import EffectsTable from "./EffectsTable";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Button from "./Button";
import useStore from "../store";
import { Building } from "../types";
import { myRound } from "../util";

const Buildings = () => {
  const buildings = useStore((state) => state.buildings);
  return (
    <table className="">
      <thead>
        <tr>
          <th className="px-2 text-left"></th>
          <th className="px-2 text-right">#</th>
          <th className="px-2 text-right">Price</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {Object.values(buildings)
          .filter((building) => building.status !== "hidden")
          .map((building) => (
            <BuildingRow key={building.name} building={building} />
          ))}
      </tbody>
    </table>
  );
};

const getBuildingCost = (building: Building) => {
  const scalingFactor = building.name === "huts" ? 1.14 : 1.07;
  const cost =
    building.price[0].amount * Math.pow(scalingFactor, building.amount);
  return myRound(cost, 2);
};

const BuildingRow = ({ building }: { building: Building }) => {
  const adjustResource = useStore((state) => state.adjustResource);
  const buildings = useStore((state) => state.buildings);
  const setBuildings = useStore((state) => state.setBuildings);
  const isAffordable = useStore((state) => state.isAffordable);

  const buildingPrice = {
    resource: building.price[0].resource,
    amount: getBuildingCost(building),
  };

  const buildBuilding = (building: Building) => {
    if (isAffordable(buildingPrice)) {
      adjustResource(building.price[0].resource, -buildingPrice.amount);
      setBuildings({
        ...buildings,
        [building.name]: {
          ...building,
          amount: building.amount + 1,
        },
      });
    }
  };

  const reclaimBuilding = (building: Building) => {
    if (building.amount === 0) return;
    setBuildings({
      ...buildings,
      [building.name]: {
        ...building,
        amount: building.amount - 1,
      },
    });
    adjustResource(building.price[0].resource, buildingPrice.amount);
  };

  return (
    <tr>
      <td className="px-2 text-left">
        <div className="flex flex-row">
          <img
            className="w-6 h-6 mr-1"
            src={`ico/${building.image}`}
            alt="building"
          />
          <Tippy content={<EffectsTable gameObject={building} />}>
            <span>{building.name}</span>
          </Tippy>
        </div>
      </td>
      <td className="px-2 text-right">{building.amount}</td>
      <td className="px-2 text-right">
        <ResourceCost key="building.name" resourceAmounts={[buildingPrice]} />
      </td>
      <td className="px-2">
        <div className="space-x-2">
          <Button
            disabled={!isAffordable(buildingPrice)}
            onClick={() => buildBuilding(building)}
          >
            +
          </Button>
          {building.sellable && (
            <Button
              disabled={building.amount === 0}
              onClick={() => reclaimBuilding(building)}
            >
              -
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default Buildings;
