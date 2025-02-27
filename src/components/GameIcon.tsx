import { ICONS } from "@/constants/icons";
import { cn } from "@/lib/utils";

export const GameIcon = ({
	icon,
	className,
}: { icon: keyof typeof ICONS; className?: string }) => {
	const { Icon, color } = ICONS[icon];
	return <Icon className={cn(color, "h-6 w-6", className)} />;
};
