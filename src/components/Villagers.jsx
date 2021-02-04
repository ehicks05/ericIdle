import EffectsTable from "./EffectsTable";
import Tippy from "@tippyjs/react";
import * as gameLogic from "../game.js";
import Button from "./Button";
import { followCursor } from "tippy.js";
import "tippy.js/dist/tippy.css";

const Jobs = ({ game, updateGame }) => {
  return (
    <table className="">
      <thead>
        <tr>
          <th className="text-left">Villagers</th>
          <th className="text-right">Quantity</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {Object.values(game.jobs)
          .filter((job) => job.status !== "hidden")
          .map((job) => (
            <Job key={job.name} game={game} updateGame={updateGame} job={job} />
          ))}
      </tbody>
    </table>
  );
};
// export const assignJob = (game, updateGame, name, amount) => {

const Job = ({ game, updateGame, job }) => {
  const assignWorker = (jobName) => {
    gameLogic.assignJob(game, updateGame, jobName, 1);
  };
  const unAssignWorker = (jobName) => {
    gameLogic.assignJob(game, updateGame, jobName, -1);
  };

  return (
    <tr>
      <td>
        <Tippy
          content={<EffectsTable gameObject={job} />}
          followCursor={true}
          plugins={[followCursor]}
        >
          <span
            style={{ cursor: "pointer" }}
            className={
              game.defaultJob === job.name ? "text-yellow-300" : undefined
            }
            onClick={() => gameLogic.setDefaultJob(game, updateGame, job.name)}
          >
            {job.name}
          </span>
        </Tippy>
      </td>
      <td className="text-right">{job.amount}</td>
      <td className="text-center">
        {job.name !== "idlers" && (
          <div className="space-x-2">
            <Button
              disabled={game.jobs.idlers.amount <= 0}
              onClick={() => assignWorker(job.name)}
            >
              +
            </Button>
            <Button
              disabled={job.amount <= 0}
              onClick={() => unAssignWorker(job.name)}
            >
              -
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default Jobs;
