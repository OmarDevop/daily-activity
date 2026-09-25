const validateToken = async (token) => {
  try {
    const cached = await redis.get("auth:" + token);
    if (cached) {
      const decoded = JSON.parse(cached);
      if (decoded.exp * 1000 < Date.now()) return null;
      return decoded;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    const ttl = Math.max(1, decoded.exp - Math.floor(Date.now() / 1000));
    await redis.setex("auth:" + token, Math.min(ttl, 300), JSON.stringify(decoded));
    return decoded;
  } catch (err) {
    return null; // invalid/expired token → caller treats as unauthenticated
  }
  };