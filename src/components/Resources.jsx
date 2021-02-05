import * as util from "../util.js";
import { updateResource } from "../game";
import Button from "./Button";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const Resources = ({ game, updateGame }) => {
  return (
    <table>
      <thead>
        <tr>
          <th className="px-2 text-left">Resource</th>
          <th className="px-2 text-right">Quantity</th>
          <th className="px-2 text-right w-32">Rate</th>
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

const RateInfo = ({ resource }) => {
  const time =
    resource.rate > 0
      ? (resource.limit - resource.amount) / resource.rate
      : resource.amount / -resource.rate;

  const message =
    resource.rate > 0 ? "seconds until full" : "seconds until empty";

  return <div>{`${time.toFixed(0)} ${message}`}</div>;
};

const Resource = ({ game, updateGame, resource }) => {
  const harvestFood = () => {
    updateResource(game, updateGame, "food", 1);
  };

  const { image, name, limit, rate } = resource;
  const amount = util.myRound(resource.amount, 2);

  return (
    <tr>
      <td className="px-2">
        <div className="flex flex-row">
          <img
            className="w-6 h-6"
            style={{ marginRight: ".5rem" }}
            src={`ico/${image}`}
            alt="cost"
          />
          <span>{name}</span>
        </div>
      </td>
      <td className="px-2 text-right">
        <span>{amount}</span>/<span>{limit}</span>
      </td>
      <td className="px-2 text-right">
        <Tippy content={<RateInfo resource={resource} />}>
          <span>{rate}/s</span>
        </Tippy>
      </td>
      <td className="px-2">
        {name === "food" && <Button onClick={harvestFood}>+</Button>}
      </td>
    </tr>
  );
};

export default Resources;
