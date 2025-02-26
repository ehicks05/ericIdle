import { Button } from "@/components/ui/button";
import Tippy from "@tippyjs/react";
import EffectsTable from "./EffectsTable.tsx";
import ResourceCost from "./ResourceCost.tsx";
import "tippy.js/dist/tippy.css";
import type { Building } from "@/constants/types.js";
import {
	buildBuilding,
	canAfford,
	getScaledBuildingCost,
	sellBuilding,
	useGame,
} from "@/misc/store.js";

const Buildings = () => {
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
					.filter((building) => building.status !== "hidden")
					.map((building) => (
						<BuildingRow key={building.name} building={building} />
					))}
			</tbody>
		</table>
	);
};

const BuildingRow = ({ building }: { building: Building }) => {
	const { game } = useGame();

	return (
		<tr>
			<td className="px-2 text-left">
				<div className="flex flex-row">
					<img
						className="w-6 h-6 mr-1"
						src={`ico/${building.image}`}
						alt="building"
					/>
					<Tippy content={<EffectsTable gameObject={building} />}>
						<span>{building.name}</span>
					</Tippy>
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
						disabled={!canAfford({ cost: building.cost })}
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

export default Buildings;
