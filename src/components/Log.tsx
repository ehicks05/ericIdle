import type { Event } from "@/constants/types";
import { useGame } from "@/store";
import { getCalendar } from "@/store/loop/calendar";
import { ScrollArea } from "./ui/scroll-area";

export const df = Intl.DateTimeFormat("en-US", {
	hour: "numeric",
	minute: "2-digit",
	second: "2-digit",
});

const LogLine = ({ event }: { event: Event }) => {
	const { dayOfSeason, season, year } = getCalendar(event.tick);
	return (
		<div className="flex flex-col">
			<span className="text-xs text-muted-foreground">
				Year {year} · {season.name} - day {dayOfSeason}
			</span>
			<span>{event.text}</span>
		</div>
	);
};

const CalendarDay = () => {
	const { dayOfSeason, season, year } = getCalendar();
	return (
		<div className="flex gap-1 whitespace-nowrap">
			<div>
				Year {year} · {season.name}, day {dayOfSeason}
			</div>
		</div>
	);
};

export const Log = () => {
	const { log } = useGame().game;

	return (
		<div className="relative flex flex-col gap-2">
			<CalendarDay />
			<ScrollArea className="h-[600px]">
				<div className="flex flex-col gap-2 text-sm">
					{log.slice(0, 100).map((event) => (
						<LogLine key={event.date} event={event} />
					))}
				</div>
				<div className="absolute bottom-0 w-[calc(100%-0.5rem)] h-1/12 bg-gradient-to-b from-transparent to-background" />
			</ScrollArea>
		</div>
	);
};
