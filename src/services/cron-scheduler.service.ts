import { Scheduler, Job } from "next-scheduler";
import { Logger } from "@/utils/logger";

export interface SchedulerConfig {
  /**
   * Cron expression for the ingestion job.
   * Example: "0 * * * *" – every hour.
   */
  ingestionCron: string;
  /**
   * Cron expression for the publishing job.
   * Example: "*/5 * * * *" – every 5 minutes.
   */
  publishingCron: string;
  /**
   * Optional callback executed when a job finishes successfully.
   */
  onSuccess?: (jobId: string, result: unknown) => void;
  /**
   * Optional callback executed when a job fails.
   */
  onFailure?: (jobId: string, err: Error) => void;
}

/**
 * A very small, idempotent scheduler implementation.
 * The same job will not run concurrently – if a job is still running and a new trigger
 * occurs, the trigger is ignored.
 */
export function startScheduler(config: SchedulerConfig): Scheduler {
  const scheduler = new Scheduler();
  const running = new Set<string>();

  const scheduleJob = (cron: string, jobName: string, jobFn: () => Promise<unknown>) => {
    scheduler.schedule(cron, async () => {
      const jobId = jobName;
      if (running.has(jobId)) {
        Logger.warn(`Job ${jobId} already running – skipping this trigger`);
        return;
      }
      running.add(jobId);
      try {
        const result = await jobFn();
        config.onSuccess?.(jobId, result);
      } catch (err) {
        const error = err as Error;
        Logger.error(`Job ${jobId} failed: ${error.message}`);
        config.onFailure?.(jobId, error);
      } finally {
        running.delete(jobId);
      }
    });
  };

  // Ingestion job – replace the implementation body with real logic.
  scheduleJob(config.ingestionCron, "ingestion", async () => {
    // TODO: Implement ingestion logic.
    Logger.info("Running ingestion job");
    // Simulate async work.
    await new Promise((res) => setTimeout(res, 1000));
    return { status: "ok" };
  });

  // Publishing job – replace the implementation body with real logic.
  scheduleJob(config.publishingCron, "publishing", async () => {
    // TODO: Implement publishing logic.
    Logger.info("Running publishing job");
    // Simulate async work.
    await new Promise((res) => setTimeout(res, 500));
    return { status: "published" };
  });

  return scheduler;
}
