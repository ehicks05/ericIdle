import type { Building, Game } from "@/constants/types";
import {
	canAfford,
	getScaledBuildingCost,
	incrementResource,
	scaleBuildingCosts,
	useGame,
} from ".";

export const makeDiscovery = (name: keyof Game["technologies"]) => {
	const { game } = useGame.getState();

	if (game.technologies[name].discovered) return;

	if (canAfford({ cost: game.technologies[name].cost })) {
		incrementResource("research", game.technologies[name].cost[0].amount * -1);
		useGame.setState(({ game }) => {
			game.technologies[name].discovered = true;
		});
	}
};

export const buildBuilding = (building: Building) => {
	const scaledCosts = scaleBuildingCosts(building);
	const isCanAfford = canAfford({ cost: scaledCosts });

	if (isCanAfford) {
		scaledCosts.forEach((cost) =>
			incrementResource(cost.resource, -1 * cost.amount),
		);

		useGame.setState(({ game }) => {
			game.buildings[building.name].amount += 1;
		});
	}
};

export const sellBuilding = (building: Building) => {
	if (building.amount === 0) return;

	useGame.setState(({ game }) => {
		game.buildings[building.name].amount -= 1;
	});

	building.cost.forEach((cost) =>
		incrementResource(
			cost.resource,
			getScaledBuildingCost(building.name, building.amount - 1, cost),
		),
	);
};

export const assignJob = (name: keyof Game["jobs"], amount: number) => {
	const { game } = useGame.getState();
	const idlerCount = game.jobs.idlers.amount;
	const jobCount = game.jobs[name].amount;

	if (
		(amount > 0 && idlerCount >= amount) ||
		(amount < 0 && jobCount >= amount)
	) {
		useGame.setState(({ game }) => {
			game.jobs[name].amount += amount;
			game.jobs.idlers.amount -= amount;
		});
	}
};

export const setDefaultJob = (job: keyof Game["jobs"]) => {
	useGame.setState(({ game }) => {
		game.defaultJob = job;
	});
};
