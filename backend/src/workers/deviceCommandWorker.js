const DeviceService = require('../services/device.service');
const DeviceCommandService = require('../services/deviceCommand.service');

async function startDeviceCommandWorker() {
  const enabled = process.env.DEVICE_COMMAND_WORKER_ENABLED === 'true' || true; // Default to enabled for now
  const intervalMs = parseInt(process.env.DEVICE_COMMAND_INTERVAL_MS || '5000', 10);
  
  if (!enabled) {
    console.log('[worker] Device command worker disabled');
    return { stop: () => undefined };
  }

  let running = false;

  const processCommands = async () => {
    if (running) return;
    running = true;

    try {
      const pending = await DeviceCommandService.getPending(5);
      
      for (const cmd of pending) {
        console.log(`[worker] Processing command ${cmd.command_name} for device ${cmd.device_id}`);
        
        // Update status to processing
        await DeviceCommandService.updateStatus(cmd.id, { status: 'processing' });
        
        try {
          let result = null;
          
          switch (cmd.command_name) {
            case 'reboot':
              result = await DeviceService.reboot(cmd.acs_device_id);
              break;
            case 'set_wifi':
              result = await DeviceService.setWifiPassword(cmd.acs_device_id, cmd.payload);
              break;
            case 'sync_wifi':
              result = await DeviceService.getWifiInfo(cmd.acs_device_id);
              // Maybe we save this somewhere else too?
              break;
            default:
              throw new Error(`Unknown command: ${cmd.command_name}`);
          }
          
          await DeviceCommandService.updateStatus(cmd.id, { 
            status: 'success', 
            result: result 
          });
          console.log(`[worker] Success: ${cmd.command_name} for ${cmd.device_id}`);
          
        } catch (error) {
          console.error(`[worker] Failed: ${cmd.command_name} for ${cmd.device_id}: ${error.message}`);
          await DeviceCommandService.updateStatus(cmd.id, { 
            status: 'failed', 
            result: { error: error.message } 
          });
        }
      }
    } catch (error) {
      console.error(`[worker] Error in command loop: ${error.message}`);
    } finally {
      running = false;
    }
  };

  // Initial run
  processCommands();
  
  const timer = setInterval(processCommands, intervalMs);
  console.log(`[worker] Device command worker started (interval: ${intervalMs}ms)`);

  return {
    stop: () => clearInterval(timer)
  };
}

module.exports = { startDeviceCommandWorker };
