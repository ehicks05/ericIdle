import * as gameLogic from "../game.js";
import Button from "./Button.jsx";
import ResourceCost from "./ResourceCost";

const Technologies = ({ game, updateGame }) => {
  return (
    <table className="">
      <thead>
        <tr>
          <th className="text-left">Technology</th>
          <th className="text-right">Price</th>
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
      <td>
        <div className="flex">
          <img
            className="w-6 h-6 mr-1"
            src={`ico/${technology.image}`}
            alt="technology"
          />
          {technology.name}
        </div>
      </td>
      <td className="text-right">
        <ResourceCost key={technology.name} game={game} coster={technology} />
      </td>
      <td>
        <Button
          disabled={technology.discovered || !canAfford}
          onClick={() => makeDiscovery(technology.name)}
        >
          {technology.discovered ? "Discovered" : "Discover"}
        </Button>
      </td>
    </tr>
  );
};

export default Technologies;
