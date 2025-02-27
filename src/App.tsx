import { useInterval } from "usehooks-ts";

import { Buildings } from "@/components/Buildings";
import { Resources } from "@/components/Resources";
import { Settings } from "@/components/Settings";
import { Technologies } from "@/components/Technologies";
import { Villagers } from "@/components/Villagers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MS_PER_TICK } from "@/constants/gameSpeed";
import { ICONS } from "@/constants/icons";
import { usePerf } from "@/hooks/usePerf";
import { tick, useGame } from "@/store";

function App() {
	const { game } = useGame();
	const { perf, updatePerf } = usePerf();

	useInterval(() => {
		const tickStart = Date.now();
		tick();
		updatePerf(tickStart);
	}, MS_PER_TICK);

	const tabs = [
		{ name: "Buildings", unlocked: game.progress.unlockHuts.unlocked },
		{ name: "Villagers", unlocked: game.progress.unlockVillagers.unlocked },
		{ name: "Techs", unlocked: game.progress.unlockLevelOneTech.unlocked },
		{ name: "Settings", unlocked: true },
	].filter(({ unlocked }) => unlocked);

	return (
		<div className="min-h-screen p-6 flex flex-col mx-auto space-y-6">
			<section className="text-5xl font-bold">
				<span>Eric</span>
				<span className="text-green-600">Idle</span>
			</section>
			<section className="flex flex-col md:flex-row items-start gap-2">
				<div className="w-80">
					<Resources />
				</div>
				<div>
					<Tabs defaultValue="Buildings" className="w-full">
						<TabsList>
							{tabs.map((tab) => (
								<TabsTrigger key={tab.name} value={tab.name}>
									{tab.name}
								</TabsTrigger>
							))}
						</TabsList>
						<TabsContent value="Buildings">
							<Buildings />
						</TabsContent>
						<TabsContent value="Villagers">
							<Villagers />
						</TabsContent>
						<TabsContent value="Techs">
							<Technologies />
						</TabsContent>
						<TabsContent value="Settings">
							<Settings perf={perf} />
						</TabsContent>
					</Tabs>
				</div>
			</section>
			<section className="flex-grow" />
			<div className="grid grid-cols-12 w-fit mx-auto gap-2">
				{Object.entries(ICONS).map(([name, { Icon, color }]) => (
					<Icon key={name} className={color} />
				))}
			</div>
			<footer className="p-6 text-center">hi</footer>
		</div>
	);
}

export default App;
