import * as util from "../util.js";
import * as gameLogic from "../game.js";
import ResourceCost from "./ResourceCost";

const Technologies = ({ game, updateGame }) => {
  return (
    <table className="table is-narrow">
      <thead>
        <tr>
          <th className="has-text-left">Technology</th>
          <th className="has-text-right">Price</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {Object.values(game.technologies)
          .filter((technology) => technology.status !== "hidden")
          .map((technology) => (
            <Technology
              key={technology.name}
              game={game}
              updateGame={updateGame}
              technology={technology}
            />
          ))}
      </tbody>
    </table>
  );
};

const Technology = ({ game, updateGame, technology }) => {
  const canAfford =
    game.resources.research.amount >=
    game.technologies[technology.name].cost.amount;

  const makeDiscovery = (technologyName) => {
    gameLogic.makeDiscovery(game, updateGame, technologyName);
  };

  return (
    <tr>
      <td className="text-left">
        {/* <img
          src={`ico/${technology.image}`}
          alt="technology"
          style={{ height: "32px" }}
        /> */}
        {technology.name}
      </td>
      <td className="has-text-right">
        <ResourceCost key={technology.name} game={game} coster={technology} />
      </td>
      <td className="text-left">
        <button
          className="button is-small"
          disabled={technology.discovered || !canAfford}
          onClick={() => makeDiscovery(technology.name)}
        >
          {technology.discovered ? "Discovered" : "Discover"}
        </button>
      </td>
    </tr>
  );
};

export default Technologies;
