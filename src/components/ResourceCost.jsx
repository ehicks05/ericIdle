import * as gameLogic from "../game.js";

const ResourceCost = ({ coster }) => {
  const cost = gameLogic.getBuildingCost(coster);
  return (
    <div className="tag">
      <span>{cost}</span>
      <figure className="image is-24x24" style={{ marginLeft: ".5rem" }}>
        <img src={`ico/${coster.cost.resource.image}`} alt="cost" />
      </figure>
    </div>
  );
};

export default ResourceCost;
