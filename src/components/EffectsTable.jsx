import { camelToTitle } from "../util";

const PRODUCTION_TABLE = {
  title: "Production",
  columns: ["resource", "amount"],
};

const BONUS_TABLE = {
  title: "Production Bonuses",
  columns: ["resource", "amount"],
};

const LIMIT_MOD_TABLE = {
  title: "Resource Limit Mods",
  columns: ["resource", "amount", "type"],
};

const buildTable = ({ title, columns }, data) => {
  return (
    <table className="table is-narrow">
      <thead>
        <tr>
          <th colSpan={columns.length}>{title}</th>
        </tr>
        <tr>
          {columns.map((column) => (
            <th key={column}>{camelToTitle(column)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((rowData) => (
          <tr key={rowData.resource}>
            {columns.map((column) => (
              <td key={column}>{rowData[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const EffectsTable = ({ gameObject }) => {
  const productionTable = gameObject.production?.length
    ? buildTable(PRODUCTION_TABLE, gameObject.production)
    : undefined;

  const bonusTable = gameObject.bonus?.length
    ? buildTable(BONUS_TABLE, gameObject.bonus)
    : undefined;

  const resourceLimitModTable = gameObject.resourceLimitModifier?.length
    ? buildTable(LIMIT_MOD_TABLE, gameObject.resourceLimitModifier)
    : undefined;

  return (
    <>
      <div style={{ fontWeight: "bold" }}>{camelToTitle(gameObject.name)}</div>
      {productionTable} {bonusTable} {resourceLimitModTable}
    </>
  );
};

export default EffectsTable;
