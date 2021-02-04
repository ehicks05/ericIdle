import * as gameLogic from "../game.js";

const ResourceCost = ({ game, coster }) => {
  const cost = gameLogic.getBuildingCost(coster);
  return (
    <div className="flex flex-row" title={coster.cost.resource}>
      <span>{cost}</span>
      <img
        className="w-6 h-6 ml-1"
        src={`ico/${game.resources[coster.cost.resource].image}`}
        alt="cost"
      />
    </div>
  );
};

export default ResourceCost;
