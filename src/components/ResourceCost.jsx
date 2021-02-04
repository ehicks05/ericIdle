import * as gameLogic from "../game.js";

const ResourceCost = ({ game, coster }) => {
  const cost = gameLogic.getBuildingCost(coster);
  return (
    <div className="tag" title={coster.cost.resource}>
      <span>{cost}</span>
      <figure className="image is-24x24" style={{ marginLeft: ".5rem" }}>
        <img
          src={`ico/${game.resources[coster.cost.resource].image}`}
          alt="cost"
        />
      </figure>
    </div>
  );
};

export default ResourceCost;
