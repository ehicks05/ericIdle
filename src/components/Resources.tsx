import { Button } from "@/components/ui/button";
import { FOOD_EATEN_PER_SECOND } from "@/constants/game.js";
import type { Resource } from "@/constants/types";
import { incrementResource, useGame } from "@/store";
import { intlFormatDistance } from "date-fns";
import { ChevronsUp, Ellipsis } from "lucide-react";
import React from "react";
import { GameIcon } from "./GameIcon";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip.js";

const LimitInfo = ({ resource }: { resource: Resource }) => {
	const { game } = useGame();
	const base = resource.baseLimit;

	const mods = Object.values(game.buildings)
		.filter(
			(building) =>
				building.amount &&
				building?.resourceLimitModifier.some(
					(limitMod) => limitMod.resource === resource.name,
				),
		)
		.map((building) => {
			const mods = building.resourceLimitModifier.filter(
				(limitMod) => limitMod.resource === resource.name,
			);
			return (
				<React.Fragment key={building.name}>
					{mods.map((mod) => (
						<tr key={mod.resource}>
							<td>{building.name}</td>
							<td className="pl-2 text-right">
								+{building.amount * mod.amount}
							</td>
						</tr>
					))}
				</React.Fragment>
			);
		});

	return (
		<table>
			<tbody>
				<tr className="">
					<td>Base</td>
					<td className="pl-2 text-right">{base}</td>
				</tr>
				{mods}
			</tbody>
		</table>
	);
};

const TimeUntil = ({ resource }: { resource: Resource }) => {
	const { rate, limit, amount } = resource;
	const { time, result } =
		rate > 0
			? { time: (limit - amount) / rate, result: "full" }
			: rate < 0
				? { time: amount / -rate, result: "empty" }
				: { time: 0, result: "" };

	const fmt = (time: number) =>
		intlFormatDistance(new Date().getTime() + time * 1000, new Date(), {
			style: "narrow",
		});

	const label = time === 0 ? "--" : `${result} in ${fmt(time)}`;

	return <div>{label}</div>;
};

const RateInfo = ({ resource }: { resource: Resource }) => {
	const { game } = useGame();

	const production = Object.values(game.jobs)
		.filter(
			(job) =>
				job.amount &&
				job?.production.some(
					(production) => production.resource === resource.name,
				),
		)
		.map((job) => {
			const production = job.production.filter(
				(production) => production.resource === resource.name,
			);
			return (
				<React.Fragment key={job.name}>
					{production.map((prod) => (
						<tr key={prod.resource}>
							<td>{job.name}</td>
							<td className="pl-2 text-right">
								+{(job.amount * prod.amount).toFixed(2)}
							</td>
						</tr>
					))}
				</React.Fragment>
			);
		});

	const percent = (amount: number) =>
		Intl.NumberFormat("en-US", { style: "percent" }).format(amount);

	const mods = Object.values(game.buildings)
		.filter(
			(building) =>
				building.amount &&
				building?.bonus.some((bonus) => bonus.resource === resource.name),
		)
		.map((building) => {
			const bonus = building.bonus.filter(
				(bonus) => bonus.resource === resource.name,
			);
			return (
				<React.Fragment key={building.name}>
					{bonus.map((bonus) => {
						const amount = building.amount * bonus.amount;
						// const prettyAmount =
						// 	bonus.type === "additive" ? amount.toFixed(2) : percent(amount);
						return (
							<tr key={bonus.resource}>
								<td className="pl-2">{building.name}</td>
								<td className="pl-2 text-right">+{percent(amount)}</td>
							</tr>
						);
					})}
				</React.Fragment>
			);
		});

	return (
		<div>
			<table>
				<tbody>
					{production}
					{mods}
					{resource.name === "food" && (
						<tr key="foodConsumption">
							<td>Villagers</td>
							<td className="pl-2 text-right">
								{(
									game.resources.villagers.amount *
									FOOD_EATEN_PER_SECOND *
									-1
								).toFixed(2)}
							</td>
						</tr>
					)}
				</tbody>
			</table>
			<TimeUntil resource={resource} />
		</div>
	);
};

const ResourceRow = ({ resource }: { resource: Resource }) => {
	const { game } = useGame();
	const harvestFood = () => {
		incrementResource("food", 1);
	};

	const { image, name, limit, rate } = resource;
	const amount =
		resource.name === "villagers"
			? Math.round(resource.amount)
			: resource.amount.toFixed(2);

	const rateColumn =
		resource.name === "villagers" ? (
			game.isIncomingVillager ? (
				<ChevronsUp size={16} />
			) : (
				<Ellipsis size={16} />
			)
		) : (
			<>
				{rate > 0 ? "+" : ""}
				{rate.toFixed(2)}
				<span className="text-sm text-muted-foreground">/s</span>
			</>
		);

	const quantity = (
		<>
			{amount}
			<span className="text-sm text-muted-foreground">/{limit}</span>
		</>
	);

	return (
		<tr>
			<td className="px-2 py-1">
				<div className="flex items-center gap-2">
					<GameIcon icon={image} />
					<span>{name}</span>
				</div>
			</td>
			<td className="px-2 text-right">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>{quantity}</TooltipTrigger>
						<TooltipContent
							side="right"
							className="p-4 rounded-lg bg-muted text-foreground"
						>
							<LimitInfo resource={resource} />
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</td>
			<td className="px-2 text-right">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger className="flex w-full items-baseline justify-end">
							{rateColumn}
						</TooltipTrigger>
						<TooltipContent
							side="right"
							className="p-4 rounded-lg bg-muted text-foreground"
						>
							<RateInfo resource={resource} />
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</td>
			<td className="text-right">
				{name === "food" && (
					<Button variant="secondary" size="sm" onClick={harvestFood}>
						+
					</Button>
				)}
			</td>
		</tr>
	);
};

export const Resources = () => {
	const { game } = useGame();

	return (
		<table className="w-full">
			<tbody>
				{Object.values(game.resources)
					.filter((resource) => resource.status === "visible")
					.map((resource) => (
						<ResourceRow key={resource.name} resource={resource} />
					))}
			</tbody>
		</table>
	);
};
