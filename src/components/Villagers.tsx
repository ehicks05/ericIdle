import { Button } from "@/components/ui/button";
import type { Job } from "@/constants/types";
import { cn } from "@/lib/utils";
import { useGame } from "@/store";
import { assignJob, setDefaultJob } from "@/store/actions";
import EffectsTable from "./EffectsTable";
import { GameIcon } from "./GameIcon";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

const JobRow = ({ job }: { job: Job }) => {
	const { game } = useGame();
	const isDefaultJob = game.defaultJob === job.name;

	return (
		<tr>
			<td className="p-2 w-full">
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
						<TooltipContent
							side="right"
							className="p-4 rounded-lg bg-muted text-foreground"
						>
							<EffectsTable gameObject={job} />
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</td>
			<td className="px-2 text-right">{job.amount}</td>
			<td className="px-2 text-center whitespace-nowrap">
				{job.name !== "idlers" && (
					<div className="space-x-2">
						<Button
							variant="secondary"
							size="sm"
							disabled={game.jobs.idlers.amount <= 0}
							onClick={(e) => assignJob(job.name, 1 * (e.ctrlKey ? 10 : 1))}
						>
							+
						</Button>
						<Button
							variant="secondary"
							size="sm"
							disabled={job.amount <= 0}
							onClick={(e) => assignJob(job.name, -1 * (e.ctrlKey ? 10 : 1))}
						>
							-
						</Button>
					</div>
				)}
			</td>
		</tr>
	);
};

export const Villagers = () => {
	const { game } = useGame();
	return (
		<table className="w-full">
			<tbody>
				{Object.values(game.jobs)
					.filter((job) => job.status === "visible")
					.map((job) => (
						<JobRow key={job.name} job={job} />
					))}
			</tbody>
		</table>
	);
};
