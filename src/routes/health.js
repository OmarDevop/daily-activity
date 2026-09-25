const checkDb = async () => {
  const start = Date.now();
  let client;
  try {
    client = await db.pool.connect();
    await Promise.race([
      client.query("SELECT 1"),
      new Promise((_, rej) => setTimeout(() => rej(new Error("health timeout")), 2000)),
    ]);
    return { status: "healthy", latencyMs: Date.now() - start };
  } catch (err) {
    return { status: "unhealthy", error: err.message };
  } finally {
    if (client) client.release();
  }
};
