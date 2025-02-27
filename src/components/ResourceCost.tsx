import { ICONS } from "@/constants/icons";
import type { Resource } from "@/constants/types";
import { cn } from "@/lib/utils";

interface Props {
	resource: Resource;
	amount: number;
}

const ResourceCost = ({ resource, amount }: Props) => {
	const { Icon, color } = ICONS[resource.image];

	return (
		<div
			className="flex items-center justify-between gap-1 p-1 rounded bg-muted/50"
			title={resource.name}
		>
			<span>{amount}</span>
			<Icon className={cn(color, "p-1 h-8 w-8")} />
		</div>
	);
};

export default ResourceCost;
