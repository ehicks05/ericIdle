import { Button } from "@/components/ui/button";
import type { Technology } from "@/constants/types.ts";
import { canAfford, makeDiscovery, useGame } from "@/misc/store.ts";
import { GameIcon } from "./GameIcon.tsx";
import ResourceCost from "./ResourceCost.tsx";

const Technologies = () => {
	const { game } = useGame();

	return (
		<table className="">
			<thead>
				<tr>
					<th className="px-2 text-left" />
					<th className="px-2 text-right">Price</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{Object.values(game.technologies)
					.filter((technology) => technology.status !== "hidden")
					.map((technology) => (
						<TechnologyRow key={technology.name} technology={technology} />
					))}
			</tbody>
		</table>
	);
};

const TechnologyRow = ({ technology }: { technology: Technology }) => {
	const { game } = useGame();
	const isCanAfford = canAfford({ cost: technology.cost });

	return (
		<tr>
			<td className="px-2">
				<div className="flex items-center gap-2">
					<GameIcon icon={technology.image} />
					{technology.name
						.split(/(?=[A-Z])/)
						.map((s) => `${s[0].toUpperCase()}${s.slice(1)}`)
						.join(" ")}
				</div>
			</td>
			<td className="px-2 text-right">
				{technology.cost.map((cost) => (
					<ResourceCost
						key={technology.name}
						resource={game.resources[cost.resource]}
						amount={cost.amount}
					/>
				))}
			</td>
			<td className="px-2">
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

export default Technologies;
