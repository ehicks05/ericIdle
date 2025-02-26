import { Button } from "@/components/ui/button";
import { DEFAULT_GAME } from "@/constants/game";
import type { Game } from "@/constants/types";
import type { Perf } from "@/hooks/usePerf";
import { useGame } from "@/misc/store";
import { useEffect, useState } from "react";
import { Debug } from "./settings/Debug";

export function exportState(state: Game, json: boolean) {
	const stringified = JSON.stringify(state);
	return json ? stringified : btoa(stringified);
}

export function importState(state: string) {
	useGame.setState(JSON.parse(atob(state)));
}

const Settings = ({ perf }: { perf: Perf }) => {
	const { game } = useGame();

	const [copyButtonLabel, setCopyButtonLabel] = useState("Export");
	const [importText, setImportText] = useState("");
	const [isImportTextValid, setIsImportTextValid] = useState(false);

	useEffect(() => {
		if (copyButtonLabel === "Copied")
			setTimeout(() => setCopyButtonLabel("Export"), 1500);
	}, [copyButtonLabel]);

	const handleReset = () => {
		if (window.confirm("Are you sure you? All progress will be lost.")) {
			importState(exportState(DEFAULT_GAME, false));
		}
	};

	const handleImport = () => {
		importState(importText);
		setImportText("");
	};

	async function handleCopy(json: boolean) {
		await navigator.clipboard.writeText(exportState(game, json));
		setCopyButtonLabel("Copied");
	}

	const handleTextInputChange = (text: string) => {
		try {
			setImportText(text);
			JSON.parse(atob(text));
			setIsImportTextValid(true);
		} catch (e) {
			setIsImportTextValid(false);
		}
	};

	return (
		<>
			<h1 className="subtitle mt-4">Import/Export/Reset</h1>
			<textarea
				className="w-full p-2 bg-muted"
				placeholder="Paste save here..."
				value={importText}
				onChange={(e) => handleTextInputChange(e.target.value)}
			/>
			<div className="mt-4 space-x-2">
				<Button
					variant="secondary"
					disabled={!importText || !isImportTextValid}
					onClick={handleImport}
				>
					{isImportTextValid ? "Import" : "Invalid Save"}
				</Button>
				<Button variant="secondary" onClick={() => handleCopy(false)}>
					{copyButtonLabel}
				</Button>
				<Button variant="secondary" onClick={() => handleCopy(true)}>
					{copyButtonLabel} JSON
				</Button>
				<Button variant="destructive" onClick={handleReset}>
					Reset
				</Button>
			</div>

			<Debug perf={perf} />
		</>
	);
};

export default Settings;
