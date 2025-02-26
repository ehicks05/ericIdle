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
import { MS_PER_TICK } from "./constants/gameSpeed";
import * as gameLogic from "./misc/game";

function App() {
	const [game, updateGame] = useImmer(
		JSON.parse(JSON.stringify(gameLogic.getDefaultGameState())),
	);
	const [activeTab, setActiveTab] = useState("Buildings");
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
		{
			name: "Buildings",
			unlocked: game.progress.unlockHuts.unlocked,
			component: <Buildings game={game} updateGame={updateGame} />,
		},
		{
			name: "Villagers",
			unlocked: game.progress.unlockVillagers.unlocked,
			component: <Villagers game={game} updateGame={updateGame} />,
		},
		{
			name: "Technologies",
			unlocked: game.progress.unlockLevelOneTech.unlocked,
			component: <Technologies game={game} updateGame={updateGame} />,
		},
		{
			name: "Settings",
			unlocked: true,
			component: <Settings game={game} updateGame={updateGame} perf={perf} />,
		},
	];

	return (
		<div className="font-mono text-black dark:text-white bg-white dark:bg-gray-900">
			<div className="min-h-screen p-6 flex flex-col mx-auto space-y-6">
				<section>
					<div className="text-5xl font-bold">
						<span>Eric</span>
						<span style={{ color: "green" }}>Idle</span>
					</div>
				</section>
				<section>
					<div>
						<div className="md:flex md:flex-row space-y-6 md:space-y-0 md:space-x-12">
							<div>
								<Resources game={game} updateGame={updateGame} />
							</div>
							<div>
								<div className="max-w-full overflow-x-auto flex space-x-5 mb-2 border-b">
									{tabs
										.filter((tab) => tab.unlocked)
										.map((tab) => {
											return (
												<button
													type="button"
													key={tab.name}
													className={`mb-2
                              ${tab.name !== activeTab ? "opacity-50" : ""}
                            `}
													onClick={() => setActiveTab(tab.name)}
												>
													{tab.name}
												</button>
											);
										})}
								</div>
								{tabs.find((tab) => tab.unlocked && tab.name === activeTab)
									?.component || <div />}
							</div>
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
