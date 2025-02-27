import { ICONS } from "@/constants/icons";
import type { Perf } from "@/hooks/usePerf";
import { useGame } from "@/store";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

export const Debug = ({ perf: { history, max } }: { perf: Perf }) => {
	const { game } = useGame();

	const average = history.reduce((agg, cur) => agg + cur, 0) / history.length;
	const tickTimes = `${(average).toFixed(2)} ms (max: ${max} ms)`;

	return (
		<div className="flex flex-col gap-2 text-muted-foreground">
			<div className="flex flex-col gap-1 p-4 bg-muted">
				Perf
				<p>Tick duration: {tickTimes}</p>
			</div>
			<div className="flex flex-col gap-1 p-4 bg-muted">
				State
				<JsonView src={game} collapsed={1} />
			</div>
			<div className="flex flex-col gap-1 p-4 bg-muted">
				Icons
				<div className="grid grid-cols-12 w-fit mx-auto gap-2 ">
					{Object.entries(ICONS).map(([name, { Icon, color }]) => (
						<Icon key={name} className={color} />
					))}
				</div>
			</div>
		</div>
	);
};
