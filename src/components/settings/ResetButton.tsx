import { useGame } from "@/store";
import { Button } from "../ui/button";

export const ResetButton = () => {
	const { resetGame } = useGame();

	const handleReset = () => {
		if (window.confirm("Are you sure you? All progress will be lost.")) {
			resetGame();

			if (import.meta.env.DEV) {
				useGame.setState(({ game }) => {
					game.resources.food.amount = 20;
					game.resources.villagers.amount = 20;
					game.resources.lumber.amount = 20;
					game.resources.research.amount = 20;
					game.buildings.huts.amount = 10;
					game.jobs.farmers.amount = 20;
				});
			}
		}
	};

	return (
		<Button variant="destructive" onClick={handleReset}>
			Reset Save
		</Button>
	);
};
