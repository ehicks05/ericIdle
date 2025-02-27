import { Button } from "@/components/ui/button";
import type { Job } from "@/constants/types.ts";
import { cn } from "@/lib/utils.ts";
import { assignJob, setDefaultJob, useGame } from "@/misc/store.ts";
import EffectsTable from "./EffectsTable.tsx";
import { GameIcon } from "./GameIcon.tsx";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip.tsx";

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
	const isDefaultJob = game.defaultJob === job.name;

	return (
		<tr>
			<td className="p-2">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								className={cn(
									"flex gap-1 cursor-pointer",
									isDefaultJob ? "text-yellow-500" : "",
								)}
								onClick={() => setDefaultJob(job.name)}
							>
								<GameIcon icon={job.image} />
								{job.name}
							</button>
						</TooltipTrigger>
						<TooltipContent className="bg-muted text-white">
							<EffectsTable gameObject={job} />
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</td>
			<td className="px-2 text-right">{job.amount}</td>
			<td className="px-2 text-center">
				{job.name !== "idlers" && (
					<div className="space-x-2">
						<Button
							variant="secondary"
							size="sm"
							disabled={game.jobs.idlers.amount <= 0}
							onClick={() => assignJob(job.name, 1)}
						>
							+
						</Button>
						<Button
							variant="secondary"
							size="sm"
							disabled={job.amount <= 0}
							onClick={() => assignJob(job.name, -1)}
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
