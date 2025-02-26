import type { Perf } from "@/hooks/usePerf";
import { useGame } from "@/misc/store";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

export const Debug = ({ perf: { history, max } }: { perf: Perf }) => {
	const { game } = useGame();

	const average = history.reduce((agg, cur) => agg + cur, 0) / history.length;
	const tickTimes = `${(average).toFixed(2)} ms (max: ${max} ms)`;

	return (
		<div>
			<h1 className="subtitle mt-4">Debug Info</h1>
			<p>Tick times: {tickTimes}</p>
			State:
			<div className="flex flex-wrap gap-4 p-4 bg-muted">
				<JsonView src={game} collapsed={1} />
			</div>
		</div>
	);
};
