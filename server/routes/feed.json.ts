// JSON Feed 1.0 endpoint
export default defineEventHandler(async (event) => {
  const feed = await generateFeed();

  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

  return feed.json1();
});
