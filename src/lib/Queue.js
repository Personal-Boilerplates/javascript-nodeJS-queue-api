import Queue from "bull";
import redisConfig from "../config/redis";

import * as jobs from "../app/jobs";

const queues = Object.values(jobs).map((job) => ({
  bull: new Queue(job.key, redisConfig),
  name: job.key,
  handle: job.handle,
  options: job.options,
}));

/**
 * Adds a job to the queue.
 * @method add
 * @param name: Especific job key name.
 * @param data: {} Custom data to store for this job. Should be JSON serializable.
 * The options are given on the job creation.
 */
function add(name, data) {
  const queue = this.queues.find((queue) => queue.name === name);

  return queue.bull.add(data, queue.options);
}

/**
 * Automatically starts all processes
 * It should only be called in the file that starts the service.
 */
function process() {
  return this.queues.forEach((queue) => {
    queue.bull.process(queue.handle);

    queue.bull.on("failed", (job, err) => {
      console.log("job failed", queue.key, job.data);
      console.log(err);
    });
  });
}

/**
 * @function clean
 * Cleans jobs from a queue. Similar to remove but keeps jobs within a certain
 * grace period.
 * @param {string} name - Key name of the job you want to clean
 * @param {int} grace - The grace period
 * @param {string} [type=completed] - The type of job to clean. Possible values are completed, wait, active, paused, delayed, failed. Defaults to completed.
 * @param {int} The max number of jobs to clean
 */
function clean(name, grace, type, limit) {
  const queue = this.queues.find((queue) => queue.name === name);

  return queue.bull.clean(grace, type, limit);
}

/**
 * @function clean
 * Pauses all processes of a single job,
 * removes all types that are not paused,
 * then restart the processes.
 * @param {string} name - Nome da key do job que deseja limpar
 */
function safeClean(name) {
  const queue = this.queues.find((queue) => queue.name === name);

  const clean = queue.bull.clean.bind(queue.bull, 0);

  return queue.bull
    .pause()
    .then(clean("completed"))
    .then(clean("failed"))
    .then(clean("active"))
    .then(clean("delayed"))
    .then(queue.bull.resume());
}

/**
 * @function clean
 * Pauses all processes of all jobs,
 * removes all types that are not paused,
 * then restart the processes.
 */
function safeCleanAll() {
  return this.queues.forEach((queue) => {
    const clean = queue.bull.clean.bind(queue.bull, 0);

    queue.bull
      .pause()
      .then(clean("completed"))
      .then(clean("failed"))
      .then(clean("active"))
      .then(clean("delayed"))
      .then(queue.bull.resume());
  });
}

/**
 * Deletes all processes for a given key from a job.
 * @param name - Nome da key de um job específico.
 */
function emptyKeyCache(name) {
  const queue = this.queues.find((queue) => queue.name === name);

  const clean = queue.bull.clean.bind(queue.bull, 0);

  return queue.bull
    .then(clean("active"))
    .then(clean("wait"))
    .then(clean("completed"))
    .then(clean("failed"))
    .then(clean("delayed"))
    .then(clean("paused"));
}

/**
 * Completely erases all processes from memory.
 */
function emptyAllKeysCache() {
  return this.queues.forEach((queue) => {
    const clean = queue.bull.clean.bind(queue.bull, 0);

    clean("active")
      .then(clean("wait"))
      .then(clean("completed"))
      .then(clean("failed"))
      .then(clean("delayed"))
      .then(clean("paused"));
  });
}

export default {
  queues,
  add,
  process,
  clean,
  emptyKeyCache,
  emptyAllKeysCache,
  safeClean,
  safeCleanAll,
};
