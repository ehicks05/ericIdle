import { Button } from "@/components/ui/button";
import { useGame } from "@/store";
import { useState } from "react";

export const ImportForm = () => {
	const [importText, setImportText] = useState("");
	const [isImportTextValid, setIsImportTextValid] = useState(false);

	const handleImport = () => {
		if (window.confirm("Are you sure you? All progress will be replaced.")) {
			const parsed = JSON.parse(atob(importText));
			useGame.setState({ game: parsed });
			setImportText("");
		}
	};

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
		<div className="flex flex-col">
			<textarea
				className="w-full p-2 bg-muted"
				placeholder="Paste save here..."
				value={importText}
				onChange={(e) => handleTextInputChange(e.target.value)}
			/>
			<Button
				variant="secondary"
				className="w-full"
				disabled={!importText || !isImportTextValid}
				onClick={handleImport}
			>
				{isImportTextValid ? "Import" : "Invalid Save"}
			</Button>
		</div>
	);
};
