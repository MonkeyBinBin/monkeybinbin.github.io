// Search index JSON endpoint
export default defineEventHandler(async (event) => {
  const searchIndex = await generateSearchIndex();

  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

  return searchIndex;
});
