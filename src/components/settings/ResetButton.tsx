import { useGame } from "@/store";
import { Button } from "../ui/button";

interface Props {
	skipConfirm?: boolean;
	cb?: () => void;
}

export const ResetButton = ({ skipConfirm = false, cb }: Props) => {
	const { resetGame } = useGame();

	const handleReset = () => {
		const confirm = "Are you sure you? All progress will be lost.";
		if (skipConfirm || window.confirm(confirm)) {
			resetGame();
			if (cb) {
				cb();
			}
		}
	};

	return (
		<Button variant="destructive" onClick={handleReset}>
			Reset Save
		</Button>
	);
};
