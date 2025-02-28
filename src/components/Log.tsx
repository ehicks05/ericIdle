import type { Event } from "@/constants/types";
import { useGame } from "@/store";
import { getCalendar } from "@/store/loop/calendar";
import { ScrollArea } from "./ui/scroll-area";

export const df = Intl.DateTimeFormat("en-US", {
	hour: "numeric",
	minute: "2-digit",
	second: "2-digit",
});

// https://stackoverflow.com/a/39466341
function nth(n: number) {
	return ["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th";
}

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

const CalendarDay = () => {
	const { dayOfSeason, season, year } = getCalendar();
	return (
		<div className="flex gap-1 whitespace-nowrap">
			<div>year {year},</div>
			<div>the</div>
			<div className="w-8 text-center">
				{dayOfSeason}
				{nth(dayOfSeason)}
			</div>
			<div className="w-20">of {season.name}</div>
		</div>
	);
};

export const Log = () => {
	const { log } = useGame().game;

	return (
		<div className="flex flex-col gap-2">
			<CalendarDay />
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
