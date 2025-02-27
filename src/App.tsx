import { useInterval } from "usehooks-ts";

import { Buildings } from "@/components/Buildings";
import { Resources } from "@/components/Resources";
import { Settings } from "@/components/Settings";
import { Technologies } from "@/components/Technologies";
import { Villagers } from "@/components/Villagers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MS_PER_TICK } from "@/constants/gameSpeed";
import { usePerf } from "@/hooks/usePerf";
import { useGame } from "@/store";
import { doGameTick } from "@/store/loop";
import { Debug } from "./components/Debug";
import { Log } from "./components/Log";
import { ResetButton } from "./components/Settings/ResetButton";

function App() {
	const { game } = useGame();
	const { perf, updatePerf } = usePerf();

	useInterval(() => {
		const tickStart = Date.now();
		doGameTick();
		updatePerf(tickStart);
	}, MS_PER_TICK);

	const tabs = [
		{ name: "Buildings", unlocked: game.progress.unlockHuts.unlocked },
		{ name: "Villagers", unlocked: game.progress.unlockVillagers.unlocked },
		{ name: "Techs", unlocked: game.progress.unlockLevelOneTech.unlocked },
		{ name: "Settings", unlocked: true },
		{ name: "Debug", unlocked: import.meta.env.DEV },
	].filter(({ unlocked }) => unlocked);

	return (
		<div className="h-svh p-6 grid justify-center items-end gap-4">
			<section className="text-5xl font-bold">
				<span>Eric</span>
				<span className="text-green-600">Idle</span>
			</section>
			<section className="h-full flex flex-col md:flex-row items-start gap-4">
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
							<Settings />
						</TabsContent>
						<TabsContent value="Debug">
							<Debug perf={perf} />
						</TabsContent>
					</Tabs>
				</div>
				<div className="w-80 h-3/4">
					<Log />
				</div>
			</section>
			<footer className="p-6 text-center">
				hi
				{import.meta.env.DEV && (
					<span className="ml-4">
						<ResetButton skipConfirm />
					</span>
				)}
			</footer>
		</div>
	);
}

export default App;
