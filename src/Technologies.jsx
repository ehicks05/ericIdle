import * as util from './util.js';
import * as gameLogic from './game.js';
import ResourceCost from "./ResourceCost";

const Technologies = ({technologies}) => {
    return (
        <div id="technologiesContainer">
            <table className="table table-sm table-responsive-sm" id="technologiesTable" style={{textAlign: 'center'}}>
                <tbody>
                <tr className="noTopBorder">
                    <th className="text-left">Technology</th>
                    <th className="text-right">Price</th>
                    <th/>
                </tr>
                {technologies.filter(technology => technology.status !== 'hidden').map(technology => <Technology key={technology.name} technology={technology} />)}
                </tbody>
            </table>
        </div>
    );
}

const Technology = ({technology}) => {
  const makeDiscovery = (technologyName) => {
    // const canAfford =
    //   game.resources.research.amount >=
    //   game.technologies[technologyName].cost.amount;
    // if (canAfford) {
    //   gameLogic.updateResource(
    //     game,
    //     "research",
    //     -game.technologies[technologyName].cost.amount
    //   );
    //   game.technologies[technologyName].discovered = true;
    // }
  };

    return (
        <tr>
            <td className="text-left">
                <img src={`ico/${technology.image}`} alt="technology" />
                {technology.name}
            </td>
            <td className="text-right">
                <ResourceCost key={technology.name} coster={technology}/>
            </td>
            <td className="text-left">
                <input type="button" className="btn btn-outline-secondary btn-sm"
                       value={technology.discovered ? 'Discovered' : 'Discover'}
                       disabled={technology.discovered || (technology.cost.amount > technology.amount)}
                       onClick={() => makeDiscovery(technology.name)}/>
            </td>
        </tr>
    );
}

export default Technologies;