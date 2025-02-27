import { checkProgress } from "./progress";
import { updateResourceLimits } from "./resourceLimits";
import { updateResources } from "./resources";
import { createVillager, isCreateVillager } from "./villagerCreation";

export const doGameTick = () => {
	checkProgress();
	updateResourceLimits();
	updateResources();
	if (isCreateVillager()) {
		createVillager();
	}
};
