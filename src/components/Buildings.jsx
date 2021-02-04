import * as gameLogic from "../game.js";
import ResourceCost from "./ResourceCost";
import EffectsTable from "./EffectsTable";
import Tippy from "@tippyjs/react";
import { followCursor } from "tippy.js";
import "tippy.js/dist/tippy.css";
import Button from "./Button.jsx";

const Buildings = ({ game, updateGame }) => {
  return (
    <table className="">
      <thead>
        <tr>
          <th className="text-left">Structure</th>
          <th className="text-right">Quantity</th>
          <th className="text-right">Price</th>
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
      <td className="text-left">
        <div className="flex flex-row">
          <img
            className="w-6 h-6 mr-1"
            src={`ico/${building.image}`}
            alt="building"
          />
          <Tippy
            content={<EffectsTable gameObject={building} />}
            followCursor={true}
            plugins={[followCursor]}
          >
            <span>{building.name}</span>
          </Tippy>
        </div>
      </td>
      <td className="text-right">{building.amount}</td>
      <td className="text-right">
        <ResourceCost key="building.name" game={game} coster={building} />
      </td>
      <td>
        <div className="space-x-2">
          <Button
            disabled={!gameLogic.canAffordBuilding(game, building)}
            onClick={() => gameLogic.buildBuilding(game, updateGame, building)}
          >
            +
          </Button>
          {building.sellable && (
            <Button
              disabled={building.amount === 0}
              onClick={() =>
                gameLogic.reclaimBuilding(game, updateGame, building)
              }
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
