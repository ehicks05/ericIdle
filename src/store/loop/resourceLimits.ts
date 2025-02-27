import { useGame } from "..";

export const updateResourceLimits = () => {
	const { game } = useGame.getState();

	Object.values(game.resources).forEach((resource) => {
		let multiplicativeMod = 1;
		let additiveMod = 0;
		Object.values(game.buildings)
			.filter((building) => building.resourceLimitModifier)
			.forEach((building) => {
				building.resourceLimitModifier
					.filter(
						(resourceLimitMod) => resourceLimitMod.resource === resource.name,
					)
					.forEach((resourceLimitMod) => {
						if (resourceLimitMod.type === "mult")
							multiplicativeMod += building.amount * resourceLimitMod.amount;
						if (resourceLimitMod.type === "add")
							additiveMod += building.amount * resourceLimitMod.amount;
					});
			});

		const newLimit = (resource.baseLimit + additiveMod) * multiplicativeMod;

		useGame.setState(({ game }) => {
			game.resources[resource.name].limit = newLimit;
		});
	});
};
