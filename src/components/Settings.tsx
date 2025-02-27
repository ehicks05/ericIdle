import { Button } from "@/components/ui/button";
import type { Game } from "@/constants/types";
import type { Perf } from "@/hooks/usePerf";
import { resetGame, useGame } from "@/misc/store";
import { useEffect, useState } from "react";
import { Debug } from "./settings/Debug";

export function exportState(state: Game) {
	return btoa(JSON.stringify(state));
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
			resetGame();
		}
	};

	const handleImport = () => {
		importState(importText);
		setImportText("");
	};

	async function handleCopy() {
		await navigator.clipboard.writeText(exportState(game));
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
		<div className="flex flex-col gap-4">
			<h1 className="">Save Game</h1>
			<textarea
				className="w-full p-2 bg-muted"
				placeholder="Paste save here..."
				value={importText}
				onChange={(e) => handleTextInputChange(e.target.value)}
			/>
			<div className="flex gap-2 justify-between">
				<Button
					variant="secondary"
					disabled={!importText || !isImportTextValid}
					onClick={handleImport}
				>
					{isImportTextValid ? "Import" : "Invalid Save"}
				</Button>
				<Button variant="secondary" onClick={handleCopy}>
					{copyButtonLabel}
				</Button>
				<Button variant="destructive" onClick={handleReset}>
					Reset Save
				</Button>
			</div>

			<Debug perf={perf} />
		</div>
	);
};

export default Settings;
