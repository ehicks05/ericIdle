import * as util from "../util.js";
import { updateResource } from "../game";

const Resources = ({ game, updateGame }) => {
  return (
    <table className="table is-narrow">
      <thead>
        <tr>
          <th className="has-text-left">Resource</th>
          <th className="has-text-right">Quantity</th>
          <th className="has-text-right">Rate</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {Object.values(game.resources)
          .filter((resource) => resource.status !== "hidden")
          .map((resource) => (
            <Resource
              key={resource.name}
              game={game}
              updateGame={updateGame}
              resource={resource}
            />
          ))}
      </tbody>
    </table>
  );
};

const Resource = ({ game, updateGame, resource }) => {
  const harvestFood = () => {
    updateResource(game, updateGame, "food", 1);
  };

  const { image, name, limit, rate } = resource;
  const amount = util.myRound(resource.amount, 2);

  return (
    <tr>
      <td>
        {/* <img
          src={`ico/${image}`}
          style={{ height: "16px" }}
          alt="resourceIcon"
        /> */}
        {name}
      </td>
      <td className="has-text-right">
        <span>{amount}</span>/<span>{limit}</span>
      </td>
      <td className="has-text-right">{rate}</td>
      <td>
        {name === "food" && (
          <button className="button is-small" onClick={harvestFood}>
            Harvest
          </button>
        )}
      </td>
    </tr>
  );
};

export default Resources;
