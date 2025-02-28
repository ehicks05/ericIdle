import { countTick } from "./calendar";
import { checkHuntingParty } from "./huntingParty";
import { checkProgress } from "./progress";
import { updateResourceLimits } from "./resourceLimits";
import { updateResources } from "./resources";
import { checkVillagerCreation } from "./villagerCreation";

export const doGameTick = () => {
	countTick();
	checkProgress();
	updateResourceLimits();
	checkHuntingParty();
	updateResources();
	checkVillagerCreation();
};
