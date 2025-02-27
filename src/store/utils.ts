import { useGame } from ".";

// Villager
export const updateVillagerCount = (amount: number) => {
	useGame.setState(({ game }) => {
		game.resources.villagers.amount += amount;
	});
};

export const addWorker = (amount: number) => {
	useGame.setState(({ game }) => {
		game.jobs[game.defaultJob].amount += amount;
	});
};

export const removeWorker = () => {
	const { game } = useGame.getState();

	const jobName =
		game.jobs.idlers.amount > 0
			? "idlers"
			: Object.values(game.jobs).find((job) => job.amount > 0)?.name;

	if (jobName) {
		useGame.setState(({ game }) => {
			game.jobs[jobName].amount -= 1;
		});
	}
};
