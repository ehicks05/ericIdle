import type { Resource } from "@/constants/types";

interface Props {
	resource: Resource;
	amount: number;
}

const ResourceCost = ({ resource, amount }: Props) => {
	return (
		<div className="flex gap-1 p-1 rounded bg-muted/50" title={resource.name}>
			<span>{amount}</span>
			<img className="w-6 h-6" src={`ico/${resource.image}`} alt="cost" />
		</div>
	);
};

export default ResourceCost;
