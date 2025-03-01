import type { Building, Game } from "@/constants/types";
import { canAfford, incrementResource, scaleBuildingCosts, useGame } from ".";

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

	scaleBuildingCosts(building, true).forEach((cost) =>
		incrementResource(cost.resource, cost.amount),
	);
};

export const assignJob = (name: keyof Game["jobs"], _amount: number) => {
	const { jobs } = useGame.getState().game;
	const idlerCount = jobs.idlers.amount;
	const jobCount = jobs[name].amount;

	const amount =
		_amount > 0
			? Math.min(_amount, idlerCount)
			: -1 * Math.min(Math.abs(_amount), jobCount);

	if (amount) {
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
