import * as util from './util.js';
import * as gameLogic from './game.js';

const Resources = ({resources}) => {
    return (
        <div id="resourcesContainer">
            <table className="table table-sm table-responsive-sm">
                <tr>
                    <th className="text-left">Resource</th>
                    <th className="text-right">Quantity</th>
                    <th className="text-right">Rate</th>
                </tr>
                {resources
                    .filter(resource => resource.status !== 'hidden')
                    .map(resource => <Resource key={resource.name} resource={resource} />)
                }

            </table>
        </div>
    );
};

const camelToTitle = input => input;
const myRound = (input, in2) => input;
const harvestFood = () => null;

const Resource = ({resource}) => {
    return (
        <tr>
            <td className="text-left" style={{whiteSpace: 'nowrap'}}>
                <img src={`ico/${resource.image}`} style={{height: '32px'}} alt='resource'/>
                {camelToTitle(resource.name)}
            </td>
            <td className="text-right" style={{whiteSpace: 'nowrap'}}>
                <span id="resource.name">{myRound(resource.amount, 2)}</span>
                /
                <span id="resource.name + 'Limit'">{resource.limit}</span>
            </td>
            <td className="text-right" style={{whiteSpace: 'nowrap'}} id="resource.name + 'Rate'">
                {resource.name === 'food' && <button className="btn btn-outline-primary btn-sm"
                        onClick={harvestFood}>Harvest
                </button>}
                {resource.rate}
            </td>
        </tr>
    );
}

export default Resources;