import { checkProgress } from "./progress";
import { updateResourceLimits } from "./resourceLimits";
import { updateResources } from "./resources";
import { checkVillagerCreation } from "./villagerCreation";

export const doGameTick = () => {
	checkProgress();
	updateResourceLimits();
	updateResources();
	checkVillagerCreation();
};
