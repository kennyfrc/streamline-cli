import { Command } from 'commander';
import { StreamlineApi, StreamlineApiError } from '../../services/streamline-api';
import { ConfigService } from '../../services/config';
import { formatIconDetail, formatError } from '../../utils/format';

export function createGetIconCommand(): Command {
  const command = new Command('icon');
  
  command
    .description('Get detailed information about an icon')
    .argument('<hash>', 'Icon hash (e.g., ico_CVtS8rNWud0BTWe2)')
    .option('--api-key <key>', 'API key (or use STREAMLINE_API_KEY env var)')
    .action(async (iconHash: string, options: any, command: Command) => {
      try {
        const parentOpts = (command?.parent as any)?.opts();
        const apiKey = await ConfigService.getApiKey(
          options.apiKey,
          process.env.STREAMLINE_API_KEY,
          parentOpts?.apiKey
        );
        
        if (!apiKey) {
          console.log('🔑 API key not found. To get started:');
          console.log('1. Run: streamline init');
          console.log('2. Edit the config file and add your API key');
          console.log('3. Or use: --api-key YOUR_KEY or set STREAMLINE_API_KEY environment variable');
          console.log('');
          console.log(`Config file location: ${ConfigService.getConfigFilePath()}`);
          process.exit(1);
        }

        const api = new StreamlineApi(apiKey);
        
        console.log(`🔍 Getting icon details for ${iconHash}...`);
        
        const icon = await api.getIcon(iconHash);
        
        formatIconDetail(icon);

      } catch (error) {
        if (error instanceof StreamlineApiError) {
          formatError(error);
        } else if (error instanceof Error) {
          formatError(error);
        } else {
          console.error('❌ An unexpected error occurred');
        }
        process.exit(1);
      }
    });

  return command;
}