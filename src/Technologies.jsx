import * as util from "./util.js";
import * as gameLogic from "./game.js";
import ResourceCost from "./ResourceCost";

const Technologies = ({ game, updateGame }) => {
  return (
    <div id="technologiesContainer">
      <table
        className="table table-sm table-responsive-sm"
        id="technologiesTable"
        style={{ textAlign: "center" }}
      >
        <tbody>
          <tr className="noTopBorder">
            <th className="text-left">Technology</th>
            <th className="text-right">Price</th>
            <th />
          </tr>
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
    </div>
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
        <img
          src={`ico/${technology.image}`}
          alt="technology"
          style={{ height: "32px" }}
        />
        {technology.name}
      </td>
      <td className="text-right">
        <ResourceCost key={technology.name} coster={technology} />
      </td>
      <td className="text-left">
        <input
          type="button"
          className="btn btn-outline-secondary btn-sm"
          value={technology.discovered ? "Discovered" : "Discover"}
          disabled={technology.discovered || !canAfford}
          onClick={() => makeDiscovery(technology.name)}
        />
      </td>
    </tr>
  );
};

export default Technologies;
