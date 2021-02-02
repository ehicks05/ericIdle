import * as gameLogic from "../game.js";
import ResourceCost from "./ResourceCost";
import EffectsTable from "./EffectsTable";
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
  return (
    <tr>
      <td className="text-left" style={{ whiteSpace: "nowrap" }}>
        {/* <img
            src={`ico/${building.image}`}
            alt="building"
            style={{ height: "32px" }}
          /> */}
        <Tippy
          content={<EffectsTable gameObject={building} />}
          followCursor={true}
          plugins={[followCursor]}
        >
          <span>{building.name}</span>
        </Tippy>
      </td>
      <td className="has-text-right">{building.amount}</td>
      <td className="has-text-right">
        <ResourceCost key="building.name" game={game} coster={building} />
      </td>
      <td className="has-text-center" style={{ whiteSpace: "nowrap" }}>
        <button
          className="button is-small"
          disabled={!gameLogic.canAffordBuilding(game, building)}
          onClick={() => gameLogic.buildBuilding(game, updateGame, building)}
        >
          Build
        </button>
        <button
          className="button is-small"
          disabled={building.amount === 0}
          onClick={() => gameLogic.reclaimBuilding(game, updateGame, building)}
        >
          Reclaim
        </button>
      </td>
    </tr>
  );
};

export default Buildings;
