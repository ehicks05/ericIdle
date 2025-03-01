import { Button } from "@/components/ui/button";
import type { Technology } from "@/constants/types";
import { camelToTitle } from "@/lib/utils";
import { canAfford, useGame } from "@/store";
import { makeDiscovery } from "@/store/actions";
import { GameIcon } from "./GameIcon";
import ResourceCost from "./ResourceCost";

const TechnologyRow = ({ technology }: { technology: Technology }) => {
	const { game } = useGame();
	const isCanAfford = canAfford({ cost: technology.cost });

	return (
		<tr>
			<td className="p-1 w-full">
				<div className="flex items-center gap-2">
					<GameIcon icon={technology.image} />
					{camelToTitle(technology.name)}
				</div>
			</td>
			<td className="p-1 text-right">
				{technology.cost.map((cost) => (
					<ResourceCost
						key={technology.name}
						resource={game.resources[cost.resource]}
						amount={cost.amount}
					/>
				))}
			</td>
			<td className="p-1">
				<Button
					variant="secondary"
					size="sm"
					disabled={technology.discovered || !isCanAfford}
					onClick={() => makeDiscovery(technology.name)}
				>
					{technology.discovered ? "Discovered" : "Discover"}
				</Button>
			</td>
		</tr>
	);
};

export const Technologies = () => {
	const { game } = useGame();

	return (
		<table className="w-full">
			<tbody>
				{Object.values(game.technologies)
					.filter((technology) => technology.status === "visible")
					.map((technology) => (
						<TechnologyRow key={technology.name} technology={technology} />
					))}
			</tbody>
		</table>
	);
};
