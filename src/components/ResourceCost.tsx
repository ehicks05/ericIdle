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
		<div className="flex items-center justify-end" title={resource.name}>
			<span className="text-right">{amount.toFixed(2)}</span>
			<Icon className={cn(color, "p-1 h-8 w-8")} />
		</div>
	);
};

export default ResourceCost;
