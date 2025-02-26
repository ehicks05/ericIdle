import { Button } from "@/components/ui/button";
import Tippy from "@tippyjs/react";
import EffectsTable from "./EffectsTable.tsx";
import "tippy.js/dist/tippy.css";
import type { Job } from "@/constants/types.ts";
import { useGame } from "@/misc/store.ts";

const Jobs = () => {
	const { game } = useGame();
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
						<JobRow key={job.name} job={job} />
					))}
			</tbody>
		</table>
	);
};

const JobRow = ({ job }: { job: Job }) => {
	const { game } = useGame();

	const assignWorker = (jobName) => {
		gameLogic.assignJob(jobName, 1);
	};
	const unAssignWorker = (jobName) => {
		gameLogic.assignJob(jobName, -1);
	};

	return (
		<tr>
			<td className="px-2">
				<Tippy content={<EffectsTable gameObject={job} />}>
					<button
						type="button"
						style={{ cursor: "pointer" }}
						className={game.defaultJob === job.name ? "text-yellow-500" : ""}
						onClick={() => setDefaultJob(job.name)}
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
							variant="secondary"
							size="sm"
							disabled={game.jobs.idlers.amount <= 0}
							onClick={() => assignWorker(job.name)}
						>
							+
						</Button>
						<Button
							variant="secondary"
							size="sm"
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
