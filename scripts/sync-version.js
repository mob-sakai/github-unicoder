const fs = require('fs').promises;

(async () => {
  try {
    const [srcPath, dstPath] = process.argv.slice(2);

    if (!srcPath || !dstPath) {
      console.error('[Sync Version] Usage: node ./scripts/sync-version.js <src.json> <dst.json>');
      process.exit(2);
    }

    const srcRaw = await fs.readFile(srcPath, 'utf8');
    const dstRaw = await fs.readFile(dstPath, 'utf8');
    const srcJson = JSON.parse(srcRaw);
    const dstJson = JSON.parse(dstRaw);

    const srcVersion = srcJson.version;
    if (!srcVersion) throw new Error(`${srcPath} does not contain a version`);

    if (dstJson.version === srcVersion) {
      console.log(`[Sync Version] dst version is already ${srcVersion}`);
      process.exit(0);
    }

    dstJson.version = srcVersion;
    await fs.writeFile(dstPath, JSON.stringify(dstJson, null, 2) + '\n', 'utf8');
    console.log(`[Sync Version] Updated dst version -> ${srcVersion}`);
  } catch (err) {
    console.error('[Sync Version] Failed to update dst version:', err);
    process.exit(1);
  }
})();
