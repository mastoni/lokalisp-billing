const { MikroTikClient } = require('../src/integrations/mikrotik.client');
const SettingService = require('../src/services/setting.service');

async function test() {
  try {
    const cfg = await SettingService.getCategoryMap('mikrotik');
    console.log('Config:', cfg);
    const client = new MikroTikClient(cfg);
    
    console.log('Fetching PPPoE Secrets...');
    const secrets = await client.getSecrets();
    console.log('Secrets count:', secrets?.length);
    console.log('Sample secret:', secrets?.[0]);

    console.log('Fetching Active PPPoE...');
    const active = await client.getActiveSessions();
    console.log('Active count:', active?.length);

    console.log('Fetching Profiles...');
    const pppProfiles = await client.getPPPProfiles();
    console.log('PPP Profiles:', pppProfiles?.length);

    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

test();
