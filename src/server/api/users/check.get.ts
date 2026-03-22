export default defineEventHandler(async (event) => {
  return checkCommunityAccess(event);
});
