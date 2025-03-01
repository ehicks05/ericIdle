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
import { ThemeToggle } from "./components/ThemeToggle";

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
		<div className="h-svh max-w-7xl mx-auto flex flex-col items-center p-8 gap-8">
			<section className="flex items-center justify-between w-full text-5xl font-bold self-start">
				<h1>
					<span>Eric</span>
					<span className="text-green-600">Idle</span>
				</h1>
				<ThemeToggle />
			</section>
			<section className="grow w-full flex flex-col lg:flex-row gap-12">
				<div className="w-full lg:w-1/4 min-w-80">
					<Resources />
				</div>
				<div className="w-full lg:w-1/2">
					<Tabs defaultValue="Buildings">
						<TabsList className="w-full">
							{tabs.map((tab) => (
								<TabsTrigger key={tab.name} value={tab.name} className="w-full">
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
				<div className="w-full lg:w-1/4">
					<Log />
				</div>
			</section>
			<footer className="p-6 text-center">
				hi
				{import.meta.env.DEV && (
					<span className="ml-4">
						<ResetButton
							skipConfirm
							cb={() => {
								useGame.setState(({ game }) => {
									game.resources.food.amount = 20;
									game.resources.villagers.amount = 20;
									game.resources.lumber.amount = 20;
									game.resources.research.amount = 20;
									game.buildings.huts.amount = 10;
									game.jobs.farmers.amount = 20;
									game.log = [
										{
											date: new Date().getTime(),
											tick: 0,
											text: "You wake up",
										},
									];
								});
							}}
						/>
					</span>
				)}
			</footer>
		</div>
	);
}

export default App;
