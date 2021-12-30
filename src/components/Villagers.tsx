import React from "react";
import EffectsTable from "./EffectsTable";
import Tippy from "@tippyjs/react";
import Button from "./Button";
import "tippy.js/dist/tippy.css";
import useStore from "../store";
import shallow from "zustand/shallow";
import { Villager } from "../types";
import { villagers } from "../default_state";

const Jobs = () => {
  const jobs = useStore((state) => state.villagers);
  return (
    <table className="">
      <thead>
        <tr>
          <th className="px-2 text-left"></th>
          <th className="px-2 text-right">#</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {Object.values(jobs)
          .filter((job) => job.status !== "hidden")
          .map((job) => (
            <Job key={job.name} job={job} />
          ))}
      </tbody>
    </table>
  );
};

const Job = ({ job }: { job: Villager }) => {
  const { jobs, setJobs } = useStore(
    (state) => ({
      jobs: state.villagers,
      setJobs: state.setVillagers,
    }),
    shallow
  );
  const { defaultJob, setDefaultJob } = useStore(
    (state) => ({
      defaultJob: state.defaultJob,
      setDefaultJob: state.setDefaultJob,
    }),
    shallow
  );

  const assignJob = (name: keyof typeof villagers, amount: number) => {
    setJobs({
      ...jobs,
      idlers: { ...jobs.idlers, amount: jobs.idlers.amount - amount },
      [name]: {
        ...jobs[name],
        amount: jobs[name].amount + amount,
      },
    });
  };

  return (
    <tr>
      <td className="px-2">
        <Tippy content={<EffectsTable gameObject={job} />}>
          <span
            className={`cursor-pointer
              ${defaultJob === job.name ? "text-yellow-500" : undefined}
            `}
            onClick={() => setDefaultJob(job.name as keyof typeof villagers)}
          >
            {job.name}
          </span>
        </Tippy>
      </td>
      <td className="px-2 text-right">{job.amount}</td>
      <td className="px-2 text-center">
        {job.name !== "idlers" && (
          <div className="space-x-2">
            <Button
              disabled={jobs.idlers.amount <= 0}
              onClick={() => assignJob(job.name as keyof typeof villagers, 1)}
            >
              +
            </Button>
            <Button
              disabled={job.amount <= 0}
              onClick={() => assignJob(job.name as keyof typeof villagers, -1)}
            >
              -
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default Jobs;
