import * as util from './util.js';
import * as gameLogic from './game.js';

const Jobs = ({jobs}) => {
    return (
        <div id="villagersContainer">
            <table className="table table-sm table-responsive-sm">
                <tbody>
                <tr className="noTopBorder">
                    <th className="text-left">Villagers</th>
                    <th className="text-right">Quantity</th>
                    <th/>
                </tr>
                {jobs.filter(job => job.status !== 'hidden').map(job => <Job key={job.name} jobs={jobs} job={job}/>)}
                </tbody>
            </table>
        </div>
    );
}

const Job = ({jobs, job}) => {
    const assignWorker = (jobName) => {
        // $emit('assignWorker', jobName);
    };
    const unAssignWorker = (jobName) => {
        // $emit('unAssignWorker', jobName);
    };

    return (
        <tr>
            <td className="text-left">
                <img src={`ico/${job.image}`} alt='job'/>
                {job.name}
            </td>
            <td className="text-right">{job.amount}</td>
            <td className="text-center">
                {job.name !== 'idlers' &&
                    <span>
                        <input type="button" className="btn btn-outline-secondary btn-sm" value="+"
                               disabled={jobs.idlers.amount === 0} onClick={() => assignWorker(job.name)}/>
                        <input type="button" className="btn btn-outline-secondary btn-sm" value="-"
                               disabled={job.amount === 0} onClick={() => unAssignWorker(job.name)}/>
                    </span>
                }
            </td>
        </tr>
    );
}

export default Jobs;
