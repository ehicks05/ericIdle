import { useGame } from "..";
import { checkHuntingParty } from "./huntingParty";
import { checkProgress } from "./progress";
import { updateResourceLimits } from "./resourceLimits";
import { updateResources } from "./resources";
import { checkVillagerCreation } from "./villagerCreation";

const countTick = () => {
	useGame.setState(({ game }) => {
		game.tickCount += 1;
	});
};

export const doGameTick = () => {
	countTick();
	checkProgress();
	updateResourceLimits();
	checkHuntingParty();
	updateResources();
	checkVillagerCreation();
};
