import { MS_PER_TICK } from "../constants/gameSpeed.ts";

const updateResourceLimits = (game, updateGame) => {
	Object.entries(game.resources).forEach(([resourceKey, resource]) => {
		let multiplicativeMod = 0;
		let additiveMod = 0;
		Object.values(game.buildings)
			.filter((building) => building.resourceLimitModifier)
			.forEach((building) => {
				building.resourceLimitModifier
					.filter(
						(resourceLimitMod) => resourceLimitMod.resource === resource.name,
					)
					.forEach((resourceLimitMod) => {
						if (resourceLimitMod.type === "multi")
							multiplicativeMod += building.amount * resourceLimitMod.amount;
						if (resourceLimitMod.type === "additive")
							additiveMod += building.amount * resourceLimitMod.amount;
					});
			});

		const newLimit =
			(resource.baseLimit + additiveMod) * (1 + multiplicativeMod);
		updateGame((draft) => {
			draft.resources[resourceKey].limit = newLimit;
			return;
		});
	});
};
