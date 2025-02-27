import { Button } from "@/components/ui/button";
import type { Building } from "@/constants/types";
import {
	canAfford,
	getScaledBuildingCost,
	scaleBuildingCosts,
	useGame,
} from "@/store";
import { buildBuilding, sellBuilding } from "@/store/actions";
import EffectsTable from "./EffectsTable";
import { GameIcon } from "./GameIcon";
import ResourceCost from "./ResourceCost";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

const BuildingRow = ({ building }: { building: Building }) => {
	const { game } = useGame();

	return (
		<tr>
			<td className="px-2">
				<div className="flex flex-row">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<div className="flex gap-1">
									<GameIcon icon={building.image} />
									{building.name}
								</div>
							</TooltipTrigger>
							<TooltipContent className="bg-muted text-white">
								<EffectsTable gameObject={building} />
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</td>
			<td className="px-2 text-right">{building.amount}</td>
			<td className="px-2 text-right">
				{building.cost.map((cost) => {
					const scaledCost = getScaledBuildingCost(
						building.name,
						cost,
						building.amount,
					);
					const resource = game.resources[cost.resource];

					return (
						<ResourceCost
							key={building.name}
							resource={resource}
							amount={scaledCost}
						/>
					);
				})}
			</td>
			<td className="px-2">
				<div className="space-x-2">
					<Button
						variant="secondary"
						size="sm"
						disabled={!canAfford({ cost: scaleBuildingCosts(building) })}
						onClick={() => buildBuilding(building)}
					>
						+
					</Button>
					{building.sellable && (
						<Button
							variant="secondary"
							size="sm"
							disabled={building.amount === 0}
							onClick={() => sellBuilding(building)}
						>
							-
						</Button>
					)}
				</div>
			</td>
		</tr>
	);
};

export const Buildings = () => {
	const { game } = useGame();

	return (
		<table className="">
			<thead>
				<tr>
					<th className="px-2 text-left" />
					<th className="px-2 text-right">#</th>
					<th className="px-2 text-right">Price</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{Object.values(game.buildings)
					// .filter((building) => building.status !== "hidden")
					.map((building) => (
						<BuildingRow key={building.name} building={building} />
					))}
			</tbody>
		</table>
	);
};
