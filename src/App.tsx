import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { useInterval } from "usehooks-ts";
import {
	Buildings,
	Resources,
	Settings,
	Technologies,
	Villagers,
} from "./components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { MS_PER_TICK } from "./constants/gameSpeed";
import * as gameLogic from "./misc/game";

function App() {
	const [game, updateGame] = useImmer(
		JSON.parse(JSON.stringify(gameLogic.getDefaultGameState())),
	);
	const [perf, setPerf] = useState({ max: 0, recent: [0] });

	const updatePerf = (start: number) => {
		const tickDuration = Date.now() - start;
		const draft = { ...perf };
		draft.recent.push(tickDuration);
		if (draft.recent.length > 100) draft.recent = draft.recent.slice(1, 101);
		if (tickDuration > perf.max) draft.max = tickDuration;
		setPerf(draft);
	};

	useInterval(() => {
		const start = Date.now();
		gameLogic.doGameTick(game, updateGame);
		localStorage.setItem("persistedGame", JSON.stringify(game));
		updatePerf(start);
	}, MS_PER_TICK);

	useEffect(() => {
		if (localStorage.getItem("persistedGame"))
			updateGame(() => {
				return JSON.parse(localStorage.getItem("persistedGame") || "");
			});
	}, [updateGame]);

	const tabs = [
		{ name: "Buildings", unlocked: game.progress.unlockHuts.unlocked },
		{ name: "Villagers", unlocked: game.progress.unlockVillagers.unlocked },
		{ name: "Techs", unlocked: game.progress.unlockLevelOneTech.unlocked },
		{ name: "Settings", unlocked: true },
	];

	return (
		<div className="">
			<div className="min-h-screen p-6 flex flex-col mx-auto space-y-6">
				<section>
					<div className="text-5xl font-bold">
						<span>Eric</span>
						<span className="text-green-600">Idle</span>
					</div>
				</section>
				<section>
					<div className="flex flex-col md:flex-row items-start gap-2">
						<div className="w-80">
							<Resources game={game} updateGame={updateGame} />
						</div>
						<div>
							<Tabs defaultValue="Buildings" className="w-full">
								<TabsList>
									{tabs
										.filter((tab) => tab.unlocked)
										.map((tab) => (
											<TabsTrigger key={tab.name} value={tab.name}>
												{tab.name}
											</TabsTrigger>
										))}
								</TabsList>
								<TabsContent value="Buildings">
									<Buildings game={game} updateGame={updateGame} />
								</TabsContent>
								<TabsContent value="Villagers">
									<Villagers game={game} updateGame={updateGame} />
								</TabsContent>
								<TabsContent value="Techs">
									<Technologies game={game} updateGame={updateGame} />
								</TabsContent>
								<TabsContent value="Settings">
									<Settings game={game} updateGame={updateGame} perf={perf} />
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</section>
				<section className="flex-grow" />
				<footer className="p-6 text-center">hi</footer>
			</div>
		</div>
	);
}

export default App;
