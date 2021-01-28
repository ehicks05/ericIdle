import { useState } from "react";
import * as util from "./util.js";
import * as gameLogic from "./game.js";
import ResourceCost from "./ResourceCost";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

const Buildings = ({ game, updateGame }) => {
  return (
    <div id="buildingsContainer">
      <table className="table table-sm table-responsive-sm">
        <tbody>
          <tr className="noTopBorder">
            <th className="text-left">Structure</th>
            <th className="text-right">Quantity</th>
            <th className="text-right" style={{ width: "90px" }}>
              Price
            </th>
            <th />
          </tr>
          {Object.values(game.buildings)
            .filter((building) => building.status !== "hidden")
            .map((building) => (
              <Building key={building.name} game={game} updateGame={updateGame} building={building} />
            ))}
        </tbody>
      </table>
    </div>
  );
};

const Building = ({ game, updateGame, building }) => {
  const canAffordBuilding = (building) => {
    return game.resources[building.cost.resource.name].amount >= gameLogic.getBuildingCost(building);
  };
  const buildBuilding = (buildingName) => {
    gameLogic.buildBuilding(game, updateGame, buildingName);
  };
  const reclaimBuilding = (buildingName) => {
    gameLogic.reclaimBuilding(game, updateGame, buildingName);
  };

  const BuildingStats = ({ building }) => {
    const bonuses = building.bonus.length ? (
      <table>
        <tr>
          <td colspan="2">Production Bonuses</td>
        </tr>
        <tr>
          <td>Resource</td>
          <td>Amount</td>
        </tr>
        {building.bonus.map((bonus) => (
          <tr>
            <td>{bonus.resource.name}</td>
            <td>{bonus.amount * 100}</td>
          </tr>
        ))}
      </table>
    ) : undefined;

    const resourceLimitMods = building.resourceLimitModifier.length ? (
      <table>
        <tr>
          <td colspan="3">Resource Limit Mods</td>
        </tr>
        <tr>
          <td>Resource</td>
          <td>Amount</td>
          <td>Type</td>
        </tr>
        {building.resourceLimitModifier.map((mod) => (
          <tr>
            <td>{mod.resource.name}</td>
            <td>{mod.amount}</td>
            <td>{mod.type}</td>
          </tr>
        ))}
      </table>
    ) : undefined;

    return (
      <>
        <div style={{ fontWeight: "bold" }}>
          {util.camelToTitle(building.name)}
        </div>
        {bonuses} {resourceLimitMods}
      </>
    );
  };

  return (
    <tr>
      <td className="text-left" style={{ whiteSpace: "nowrap" }}>
        <Tippy content={<BuildingStats building={building} />}>
          <img
            src={`ico/${building.image}`}
            alt="building"
            style={{ height: "32px" }}
          />
        </Tippy>

        {building.name}
      </td>
      <td className="text-right">{building.amount}</td>
      <td className="text-right">
        <ResourceCost key="building.name" coster={building} />
      </td>
      <td className="text-center" style={{ whiteSpace: "nowrap" }}>
        <input
          type="button"
          className="btn btn-outline-secondary btn-sm"
          value="Build"
          disabled={!canAffordBuilding(building)}
          onClick={() => buildBuilding(building.name)}
        />
        <input
          type="button"
          className="btn btn-outline-secondary btn-sm"
          value="Reclaim"
          disabled={building.amount === 0}
          onClick={() => reclaimBuilding(building.name)}
        />
      </td>
    </tr>
  );
};

export default Buildings;
