import type { Perf } from "@/hooks/usePerf";
import { useGame } from "@/store";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

export const Debug = ({ perf: { history, max } }: { perf: Perf }) => {
	const { game } = useGame();

	const average = history.reduce((agg, cur) => agg + cur, 0) / history.length;
	const tickTimes = `${(average).toFixed(2)} ms (max: ${max} ms)`;

	return (
		<div>
			<div className="flex flex-col text-muted-foreground p-4 bg-muted">
				<p className="mb-4">Tick duration: {tickTimes}</p>
				State
				<JsonView src={game} collapsed={1} />
			</div>
		</div>
	);
};
