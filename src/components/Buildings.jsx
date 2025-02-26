import {Button} from "@/components/ui/button";
import Tippy from "@tippyjs/react";
import * as gameLogic from "../misc/game.js";
import EffectsTable from "./EffectsTable.jsx";
import ResourceCost from "./ResourceCost.jsx";
import "tippy.js/dist/tippy.css";

const Buildings = ({ game, updateGame }) => {
  return (
    <table className="">
      <thead>
        <tr>
          <th className="px-2 text-left" />
          <th className="px-2 text-right">#</th>
          <th className="px-2 text-right">Price</th>
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
        <ResourceCost key="building.name" game={game} coster={building} />
      </td>
      <td className="px-2">
        <div className="space-x-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={!gameLogic.canAffordBuilding(game, building)}
            onClick={() => gameLogic.buildBuilding(game, updateGame, building)}
          >
            +
          </Button>
          {building.sellable && (
            <Button
              variant="secondary"
              size="sm"
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
