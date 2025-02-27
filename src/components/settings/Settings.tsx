import type { Perf } from "@/hooks/usePerf";
import { Debug } from "./Debug";
import { ExportButton } from "./ExportButton";
import { ImportForm } from "./ImportForm";
import { ResetButton } from "./ResetButton";

export const Settings = ({ perf }: { perf: Perf }) => {
	return (
		<div className="flex flex-col gap-4">
			<h1 className="">Save Game</h1>
			<ImportForm />
			<div className="flex gap-2 justify-between">
				<ExportButton />
				<ResetButton />
			</div>

			<Debug perf={perf} />
		</div>
	);
};
