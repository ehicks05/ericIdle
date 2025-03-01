import type { Building, Job } from "@/constants/types";
import { camelToTitle } from "@/lib/utils";

const PRODUCTION_TABLE = {
	title: "Production",
	columns: ["resource", "amount"],
} as const;

const BONUS_TABLE = {
	title: "Production Bonuses",
	columns: ["resource", "amount"],
} as const;

const LIMIT_MOD_TABLE = {
	title: "Resource Limit Mods",
	columns: ["resource", "amount", "type"],
} as const;

const buildTable = (
	{
		title,
		columns,
	}: { title: string; columns: readonly ("resource" | "amount" | "type")[] },
	data: { resource: string; amount: number; type?: string }[],
) => {
	return (
		<table className="text-left">
			<thead>
				<tr>
					<th colSpan={columns.length}>{title}</th>
				</tr>
				<tr>
					{columns.map((column) => (
						<th className="p-4" key={column}>
							{camelToTitle(column)}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data.map((rowData) => (
					<tr key={rowData.resource}>
						{columns.map((column) => (
							<td className="p-4" key={column}>
								{rowData[column]}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};

const EffectsTable = ({ gameObject }: { gameObject: Building | Job }) => {
	return (
		<div>
			<div className="font-bold">{camelToTitle(gameObject.name)}</div>

			{"production" in gameObject &&
				gameObject.production.length > 0 &&
				buildTable(PRODUCTION_TABLE, gameObject.production)}

			{"bonus" in gameObject &&
				gameObject.bonus.length > 0 &&
				buildTable(BONUS_TABLE, gameObject.bonus)}
			{"resourceLimitModifier" in gameObject &&
				gameObject.resourceLimitModifier.length > 0 &&
				buildTable(LIMIT_MOD_TABLE, gameObject.resourceLimitModifier)}
		</div>
	);
};

export default EffectsTable;
