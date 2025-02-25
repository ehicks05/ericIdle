import Tippy from "@tippyjs/react";
import * as gameLogic from "../misc/game.js";
import Button from "./Button.jsx";
import EffectsTable from "./EffectsTable.jsx";
import "tippy.js/dist/tippy.css";

const Jobs = ({ game, updateGame }) => {
	return (
		<table className="">
			<thead>
				<tr>
					<th className="px-2 text-left" />
					<th className="px-2 text-right">#</th>
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

const Job = ({ game, updateGame, job }) => {
	const assignWorker = (jobName) => {
		gameLogic.assignJob(game, updateGame, jobName, 1);
	};
	const unAssignWorker = (jobName) => {
		gameLogic.assignJob(game, updateGame, jobName, -1);
	};

	return (
		<tr>
			<td className="px-2">
				<Tippy content={<EffectsTable gameObject={job} />}>
					<button
						type="button"
						style={{ cursor: "pointer" }}
						className={game.defaultJob === job.name ? "text-yellow-500" : ""}
						onClick={() => gameLogic.setDefaultJob(game, updateGame, job.name)}
					>
						{job.name}
					</button>
				</Tippy>
			</td>
			<td className="px-2 text-right">{job.amount}</td>
			<td className="px-2 text-center">
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
