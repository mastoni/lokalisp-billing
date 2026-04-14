const IntegrationService = require('../services/integration.service');
const IntegrationSyncLogService = require('../services/integrationSyncLog.service');

function parseBool(v, defaultValue = false) {
  if (v === undefined || v === null) return defaultValue;
  const s = String(v).toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on'].includes(s)) return true;
  if (['0', 'false', 'no', 'n', 'off'].includes(s)) return false;
  return defaultValue;
}

function nowIso() {
  return new Date().toISOString();
}

function startAcsSyncScheduler() {
  const enabled = parseBool(process.env.ACS_SYNC_ENABLED, false);
  const intervalSeconds = Math.max(30, parseInt(process.env.ACS_SYNC_INTERVAL_SECONDS || '300', 10) || 300);
  const intervalMs = intervalSeconds * 1000;
  const jobName = 'acs.last_seen.sync';

  if (!enabled) {
    console.log(`[scheduler] ACS sync disabled (set ACS_SYNC_ENABLED=1)`);
    return { stop: () => undefined };
  }

  let running = false;

  const tick = async () => {
    if (running) return;
    running = true;

    let logRow = null;
    try {
      logRow = await IntegrationSyncLogService.start({ provider: 'genieacs', job_name: jobName });
      console.log(`[scheduler] ${nowIso()} start ${jobName}`);

      const result = await IntegrationService.syncAcsDevices();
      await IntegrationSyncLogService.finish(logRow.id, {
        status: 'success',
        started_at: logRow.started_at,
        details: result.details,
        error_message: null,
      });
      console.log(`[scheduler] ${nowIso()} success ${jobName} ${JSON.stringify(result.details)}`);
    } catch (error) {
      const message = error?.message ? String(error.message) : 'unknown error';
      try {
        if (logRow?.id) {
          await IntegrationSyncLogService.finish(logRow.id, {
            status: 'error',
            started_at: logRow.started_at,
            details: null,
            error_message: message,
          });
        }
      } catch {
      }
      console.error(`[scheduler] ${nowIso()} error ${jobName} ${message}`);
    } finally {
      running = false;
    }
  };

  tick().catch(() => undefined);
  const timer = setInterval(() => tick().catch(() => undefined), intervalMs);

  console.log(`[scheduler] ACS sync enabled interval=${intervalSeconds}s`);

  return {
    stop: () => clearInterval(timer),
  };
}

module.exports = { startAcsSyncScheduler };

