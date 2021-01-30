import * as util from "./util.js";
import * as gameLogic from "./game.js";

const Jobs = ({ game, updateGame }) => {
  return (
    <div id="villagersContainer">
      <table className="table table-sm table-responsive-sm">
        <tbody>
          <tr className="noTopBorder">
            <th className="text-left">Villagers</th>
            <th className="text-right">Quantity</th>
            <th />
          </tr>
          {Object.values(game.jobs)
            .filter((job) => job.status !== "hidden")
            .map((job) => (
              <Job
                key={job.name}
                game={game}
                updateGame={updateGame}
                job={job}
              />
            ))}
        </tbody>
      </table>
    </div>
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
        <img src={`ico/${job.image}`} alt="job" style={{ height: "32px" }} />
        {job.name}
      </td>
      <td className="text-right">{job.amount}</td>
      <td className="text-center">
        {job.name !== "idlers" && (
          <span>
            <input
              type="button"
              className="btn btn-outline-secondary btn-sm"
              value="+"
              disabled={game.jobs.idlers.amount <= 0}
              onClick={() => assignWorker(job.name)}
            />
            <input
              type="button"
              className="btn btn-outline-secondary btn-sm"
              value="-"
              disabled={job.amount <= 0}
              onClick={() => unAssignWorker(job.name)}
            />
          </span>
        )}
      </td>
    </tr>
  );
};

export default Jobs;
