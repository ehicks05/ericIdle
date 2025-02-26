import { useState } from "react";

export interface Perf {
	history: number[];
	max: number;
}

export const usePerf = () => {
	const [max, setMax] = useState(0);
	const [history, setHistory] = useState([0]);

	const updatePerf = (tickStart: number) => {
		const tickDuration = Date.now() - tickStart;
		history.push(tickDuration);
		if (history.length > 100) setHistory(history.slice(1));
		if (tickDuration > max) setMax(tickDuration);
	};

	const perf: Perf = { history, max };

	return { perf, updatePerf };
};
