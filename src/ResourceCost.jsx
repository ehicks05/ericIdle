import * as gameLogic from './game.js'

const ResourceCost = ({coster}) => {
    const cost = gameLogic.getBuildingCost(coster);
    return (
        <div className="resourceCost"
             style={{whiteSpace: 'nowrap', backgroundColor: 'transparent', textAlign: 'right', paddingLeft: '5px'}}>
            {cost}
            <img src={`ico/${coster.cost.resource.image}`} style={{height: '32px', verticalAlign: 'middle'}} alt='cost'/>
        </div>
    );
}

export default ResourceCost;