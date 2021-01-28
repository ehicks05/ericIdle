import * as util from './util.js';
import * as gameLogic from './game.js';
import ResourceCost from "./ResourceCost";

const Buildings = ({buildings}) => {
    return (
        <div id="buildingsContainer">
            <table className="table table-sm table-responsive-sm">
                <tbody>
                <tr className="noTopBorder">
                    <th className="text-left">Structure</th>
                    <th className="text-right">Quantity</th>
                    <th className="text-right" style={{width: '90px'}}>Price</th>
                    <th/>
                </tr>
                {buildings.filter(building => building.status !== 'hidden').map(building => <Building
                    key={building.name} building={building}/>)}
                </tbody>
            </table>
        </div>
    );
}

const Building = ({building}) => {
    const canAffordBuilding = (building) => {
        return building.cost.resource.amount >= gameLogic.getBuildingCost(building);
    };
  const buildBuilding = (buildingName) => {
    // gameLogic.buildBuilding(game, buildingName);
  };
  const reclaimBuilding = (buildingName) => {
    // gameLogic.reclaimBuilding(game, buildingName);
  };
    const getBuildingPopoverTitle = (building) => {
        return '<div style="font-weight: bold;">' + util.camelToTitle(building.name) + '</div>';
    };
    const getBuildingPopoverContent = (building) => {
        let content = '';
        if (building.bonus.length > 0) {
            content += '<table class="table table-sm"><tr><td colspan="2">Production Bonuses</td></tr><tr><td>Resource</td><td>Amount</td></tr>';
            building.bonus.forEach(function (bonus) {
                content += '<tr><td>' + bonus.resource.name + '</td><td>+' + (bonus.amount * 100) + '%</td></tr>';
            });
            content += '</table>';
        }

        if (building.resourceLimitModifier.length > 0) {
            content += '<table class="table table-sm"><tr><td colspan="3">Resource Limit Mods</td></tr><tr><td>Resource</td><td>Amount</td><td>Type</td></tr>';
            building.resourceLimitModifier.forEach(function (limitModifier) {
                content += '<tr><td>' + limitModifier.resource.name + '</td><td>' + limitModifier.amount + '</td><td>' + limitModifier.type + '</td></tr>';
            });
            content += '</table>';
        }

        return content;
    };

    return (
        <tr>
            <td className="text-left" style={{whiteSpace: 'nowrap'}}>
                <a tabIndex={0} data-html="true" data-toggle="popover"
                   data-title={getBuildingPopoverTitle(building)}
                   data-content={getBuildingPopoverContent(building)} data-trigger="hover">
                    <img src={`ico/${building.image}`} alt='building'/>
                </a>
                {building.name}
            </td>
            <td className="text-right">{building.amount}</td>
            <td className="text-right">
                <ResourceCost key="building.name" coster="building"/>
            </td>
            <td className="text-center" style={{whiteSpace: 'nowrap'}}>
                <input type="button" className="btn btn-outline-secondary btn-sm"
                       value="Build" disabled={!canAffordBuilding(building)}
                       onClick={() => buildBuilding(building.name)}/>
                <input type="button" className="btn btn-outline-secondary btn-sm"
                       value="Reclaim" disabled={building.amount === 0} onClick={() => reclaimBuilding(building.name)}/>
            </td>
        </tr>
    );
}

export default Buildings;