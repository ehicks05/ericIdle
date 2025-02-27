import { canAfford, useGame } from "../index";

export const checkProgress = () => {
	const { game } = useGame.getState();

	Object.values(game.progress)
		.filter((progress) => progress.goal && !progress.unlocked)
		.forEach((progress) => {
			const goal = progress.goal;

			const shouldUnlock =
				"technology" in goal
					? game.technologies[goal.technology].discovered
					: canAfford({ cost: [goal] });

			if (shouldUnlock) {
				useGame.setState(({ game }) => {
					game.progress[progress.name].unlocked = true;
				});

				applyProgress(progress.name);
			}
		});
};

// go through every game object, looking for ones whose prereq = this progressObject. Make it visible
// todo: consider what happens if you have multiple prereqs
const applyProgress = (progressName: string) => {
	const { game } = useGame.getState();

	Object.values(game.resources)
		.filter((o) => o.prereq === progressName)
		.forEach((o) =>
			useGame.setState(({ game }) => {
				game.resources[o.name].status = "visible";
			}),
		);
	Object.values(game.buildings)
		.filter((o) => o.prereq === progressName)
		.forEach((o) =>
			useGame.setState(({ game }) => {
				game.buildings[o.name].status = "visible";
			}),
		);
	Object.values(game.jobs)
		.filter((o) => o.prereq === progressName)
		.forEach((o) =>
			useGame.setState(({ game }) => {
				game.jobs[o.name].status = "visible";
			}),
		);
	Object.values(game.technologies)
		.filter((o) => o.prereq === progressName)
		.forEach((o) =>
			useGame.setState(({ game }) => {
				game.technologies[o.name].status = "visible";
			}),
		);
};
