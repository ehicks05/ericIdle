import React from "react";
import ResourceCost from "./ResourceCost";
import EffectsTable from "./EffectsTable";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Button from "./Button";
import useStore from "../store";
import { Building } from "../types";
import { myRound } from "../util";
import useIsAffordable from "../hooks/useIsAffordable";

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

  const buildingPrice = building.price.map((p) => ({
    ...p,
    amount: getBuildingCost(building),
  }));

  const isAffordable = useIsAffordable(buildingPrice);

  const addOrRemoveBuilding = (building: Building, isAdd: boolean) => {
    if (isAdd && !isAffordable) return;
    if (!isAdd && building.amount < 1) return;

    buildingPrice.forEach((p) =>
      adjustResource(p.resource, (isAdd ? -1 : 1) * p.amount)
    );
    setBuildings({
      ...buildings,
      [building.name]: {
        ...building,
        amount: building.amount + (isAdd ? 1 : -1),
      },
    });
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
        <ResourceCost key="building.name" resourceAmounts={buildingPrice} />
      </td>
      <td className="px-2">
        <div className="space-x-2">
          <Button
            disabled={!isAffordable}
            onClick={() => addOrRemoveBuilding(building, true)}
          >
            +
          </Button>
          {building.sellable && (
            <Button
              disabled={building.amount === 0}
              onClick={() => addOrRemoveBuilding(building, false)}
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
