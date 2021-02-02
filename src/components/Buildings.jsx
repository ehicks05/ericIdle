import * as util from "../util.js";
import * as gameLogic from "../game.js";
import ResourceCost from "./ResourceCost";
import Tippy from "@tippyjs/react";
import { followCursor } from "tippy.js";
import "tippy.js/dist/tippy.css";

const Buildings = ({ game, updateGame }) => {
  return (
    <table className="table is-narrow">
      <thead>
        <tr className="noTopBorder">
          <th className="has-text-left">Structure</th>
          <th className="has-text-right">Quantity</th>
          <th className="has-text-right" style={{ width: "90px" }}>
            Price
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        {Object.values(game.buildings)
          .filter((building) => building.status !== "hidden")
          .map((building) => (
            <Building
              key={building.name}
              game={game}
              updateGame={updateGame}
              building={building}
            />
          ))}
      </tbody>
    </table>
  );
};

const Building = ({ game, updateGame, building }) => {
  const BuildingStats = ({ building }) => {
    const bonuses = building.bonus.length ? (
      <table className="table is-narrow">
        <thead>
          <tr>
            <td colSpan="2">Production Bonuses</td>
          </tr>
          <tr>
            <th>Resource</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {building.bonus.map((bonus) => (
            <tr key={bonus.resource.name}>
              <td>{bonus.resource.name}</td>
              <td>{bonus.amount * 100}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : undefined;

    const resourceLimitMods = building.resourceLimitModifier.length ? (
      <table className="table is-narrow">
        <thead>
          <tr>
            <td colSpan="3">Resource Limit Mods</td>
          </tr>
          <tr>
            <th>Resource</th>
            <th>Amount</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {building.resourceLimitModifier.map((mod) => (
            <tr key={mod.resource.name}>
              <td>{mod.resource.name}</td>
              <td>{mod.amount}</td>
              <td>{mod.type}</td>
            </tr>
          ))}
        </tbody>
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
        {/* <img
            src={`ico/${building.image}`}
            alt="building"
            style={{ height: "32px" }}
          /> */}
        <Tippy
          content={<BuildingStats building={building} />}
          followCursor={true}
          plugins={[followCursor]}
        >
          <span>{building.name}</span>
        </Tippy>
      </td>
      <td className="has-text-right">{building.amount}</td>
      <td className="has-text-right">
        <ResourceCost key="building.name" coster={building} />
      </td>
      <td className="has-text-center" style={{ whiteSpace: "nowrap" }}>
        <button
          className="button is-small"
          disabled={!gameLogic.canAffordBuilding(game, building)}
          onClick={() =>
            gameLogic.buildBuilding(game, updateGame, building.name)
          }
        >
          Build
        </button>
        <button
          className="button is-small"
          disabled={building.amount === 0}
          onClick={() =>
            gameLogic.reclaimBuilding(game, updateGame, building.name)
          }
        >
          Reclaim
        </button>
      </td>
    </tr>
  );
};

export default Buildings;
