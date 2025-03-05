import { useGame } from "@/store";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export const ExportButton = () => {
	const { game } = useGame();
	const [label, setLabel] = useState<"Export" | "Copied">("Export");

	useEffect(() => {
		if (label === "Copied") setTimeout(() => setLabel("Export"), 1500);
	}, [label]);

	async function handleExport() {
		const encoded = btoa(JSON.stringify(game));
		await navigator.clipboard.writeText(encoded);
		setLabel("Copied");
	}

	return (
		<Button variant="secondary" className="w-full" onClick={handleExport}>
			{label}
		</Button>
	);
};
