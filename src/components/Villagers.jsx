import * as util from "../util.js";
import * as gameLogic from "../game.js";

const Jobs = ({ game, updateGame }) => {
  return (
    <table className="table is-narrow">
      <thead>
        <tr>
          <th className="has-text-left">Villagers</th>
          <th className="has-text-right">Quantity</th>
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
      <td className="text-left">
        {/* <img src={`ico/${job.image}`} alt="job" style={{ height: "32px" }} /> */}
        {job.name}
      </td>
      <td className="has-text-right">{job.amount}</td>
      <td className="text-center">
        {job.name !== "idlers" && (
          <span>
            <button
              className="button is-small"
              disabled={game.jobs.idlers.amount <= 0}
              onClick={() => assignWorker(job.name)}
            >
              +
            </button>
            <button
              className="button is-small"
              disabled={job.amount <= 0}
              onClick={() => unAssignWorker(job.name)}
            >
              -
            </button>
          </span>
        )}
      </td>
    </tr>
  );
};

export default Jobs;
