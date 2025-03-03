export default async function () {
  await global.shutdown();
  await global.postgres.stop();
}
