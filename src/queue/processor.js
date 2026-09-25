const scheduleRetry = (queueName, job, delay) => {
  const safeDelay = Number.isFinite(delay) && delay > 0 ? Math.min(delay, 60_000) : 1000;
  let payload;
  try {
    payload = JSON.stringify(job);
  } catch (err) {
    logger.error("Retry enqueue failed: unserializable job", err);
    return;
  }
  const timer = setTimeout(() => {
    redis.zadd(queueName, 0, payload).catch((err) => {
      logger.error("Retry enqueue failed", err);
    });
  }, safeDelay);
  timer.unref();
};