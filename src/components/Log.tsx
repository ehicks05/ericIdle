import type { Event } from "@/constants/types";
import { useGame } from "@/store";
import { ScrollArea } from "./ui/scroll-area";

export const df = Intl.DateTimeFormat("en-US", {
	hour: "numeric",
	minute: "2-digit",
	second: "2-digit",
});

const LogLine = ({ event }: { event: Event }) => {
	return (
		<div className="flex flex-col">
			<span className="text-xs text-muted-foreground">
				{df.format(new Date(event.date))}
			</span>
			<span>{event.text}</span>
		</div>
	);
};

export const Log = () => {
	const { log } = useGame().game;
	return (
		<div className="flex flex-col gap-2">
			Events
			<ScrollArea className="h-[600px]">
				<div className="flex flex-col gap-2 text-sm">
					{log.slice(0, 100).map((event) => (
						<LogLine key={event.date} event={event} />
					))}
				</div>
			</ScrollArea>
		</div>
	);
};
