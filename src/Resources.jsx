import * as util from "./util.js";
import { updateResource } from './game'

const Resources = ({ game, updateGame }) => {
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th className="text-left">Resource</th>
            <th className="text-right">Quantity</th>
            <th className="text-right">Rate</th>
          </tr>
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
    </div>
  );
};

const Resource = ({ game, updateGame, resource }) => {
  const harvestFood = () => {
    updateResource(game, updateGame, 'food', 1);
  };

  const { image, name, limit, rate } = resource;
  const amount = util.myRound(resource.amount, 2);

  return (
    <tr>
      <td>
        <img
          src={`ico/${image}`}
          style={{ height: "32px" }}
          alt="resourceIcon"
        />
        {name}
      </td>
      <td>
        <span>{amount}</span>/
        <span>{limit}</span>
      </td>
      <td>
        {name === "food" && (
          <button onClick={harvestFood}>Harvest</button>
        )}
        {rate}
      </td>
    </tr>
  );
};

export default Resources;
