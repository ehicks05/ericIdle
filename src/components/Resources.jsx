import React from "react";
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
          <th className="px-2 text-right">#</th>
          <th className="px-2 text-right w-24">Rate</th>
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

const LimitInfo = ({ game, resource }) => {
  const base = resource.baseLimit;

  const mods = Object.values(game.buildings)
    .filter(
      (building) =>
        building.amount &&
        building?.resourceLimitModifier.some(
          (limitMod) => limitMod.resource === resource.name
        )
    )
    .map((building) => {
      const mods = building.resourceLimitModifier.filter(
        (limitMod) => limitMod.resource === resource.name
      );
      return (
        <React.Fragment key={building.name}>
          {mods.map((mod) => (
            <tr key={mod.resource}>
              <td>{building.name}</td>
              <td className="pl-2 text-right">
                +{building.amount * mod.amount}
              </td>
            </tr>
          ))}
        </React.Fragment>
      );
    });

  return (
    <table>
      <tbody>
        <tr className="">
          <td>Base</td>
          <td className="pl-2 text-right">{base}</td>
        </tr>
        {mods}
      </tbody>
    </table>
  );
};

const TimeUntil = ({ resource }) => {
  const time =
    resource.rate > 0
      ? (resource.limit - resource.amount) / resource.rate
      : resource.amount / -resource.rate;

  const destination = resource.rate > 0 ? "full" : "empty";

  const rateInfo =
    resource.rate > 0 || resource.rate < 0
      ? `${destination} in ${util.shortEnglishHumanizer(time * 1000, {
          round: true,
          largest: 2,
          spacer: "",
        })}`
      : "No change";

  return <div>{rateInfo}</div>;
};

const RateInfo = ({ game, resource }) => {
  const production = Object.values(game.jobs)
    .filter(
      (job) =>
        job.amount &&
        job?.production.some(
          (production) => production.resource === resource.name
        )
    )
    .map((job) => {
      const production = job.production.filter(
        (production) => production.resource === resource.name
      );
      return (
        <React.Fragment key={job.name}>
          {production.map((prod) => (
            <tr key={prod.resource}>
              <td>{job.name}</td>
              <td className="pl-2 text-right">
                +{(job.amount * prod.amount).toFixed(2)}
              </td>
            </tr>
          ))}
        </React.Fragment>
      );
    });

  const mods = Object.values(game.buildings)
    .filter(
      (building) =>
        building.amount &&
        building?.bonus.some((bonus) => bonus.resource === resource.name)
    )
    .map((building) => {
      const bonus = building.bonus.filter(
        (bonus) => bonus.resource === resource.name
      );
      return (
        <React.Fragment key={building.name}>
          {bonus.map((bonus) => {
            const amount = building.amount * bonus.amount;
            const prettyAmount =
              bonus.type === "additive"
                ? amount.toFixed(2)
                : !bonus.type || bonus.type === "multiplicative"
                ? (1 + amount * 100).toFixed(0) + "%"
                : "?";
            return (
              <tr key={bonus.resource}>
                <td className="pl-2">{building.name}</td>
                <td className="pl-2 text-right">+{prettyAmount}</td>
              </tr>
            );
          })}
        </React.Fragment>
      );
    });

  const rateInfo = (
    <table>
      <tbody>
        {production}
        {mods}
        {resource.name === "food" && (
          <tr key="foodConsumption">
            <td>Villagers</td>
            <td className="pl-2 text-right">
              -{(game.resources.villagers.amount * 0.045).toFixed(2)}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div>
      {rateInfo}
      <TimeUntil resource={resource} />
    </div>
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
        <Tippy content={<LimitInfo game={game} resource={resource} />}>
          <span>{`${Math.floor(amount)}/${limit}`}</span>
        </Tippy>
      </td>
      <td className="px-2 text-right">
        <Tippy content={<RateInfo game={game} resource={resource} />}>
          <span>{`${rate > 0 ? "+" : ""}${rate.toFixed(2)}`}/s</span>
        </Tippy>
      </td>
      <td className="px-2">
        {name === "food" && <Button onClick={harvestFood}>+</Button>}
      </td>
    </tr>
  );
};

export default Resources;
