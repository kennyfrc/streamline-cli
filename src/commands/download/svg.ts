import { Command } from 'commander';
import { StreamlineApi, StreamlineApiError } from '../../services/streamline-api';
import { ConfigService } from '../../services/config';
import { DownloadSvgOptions } from '../../types/api';
import { formatDownloadSuccess, formatError } from '../../utils/format';
import * as fs from 'fs';
import * as path from 'path';

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9\-_]/gi, '_').toLowerCase();
}

function generateFilename(iconHash: string, iconName: string, customName?: string, responsive?: boolean): string {
  const baseName = customName || sanitizeFilename(iconName) || iconHash;
  const suffix = responsive ? '_responsive' : '';
  return `${baseName}${suffix}.svg`;
}

export function createDownloadSvgCommand(): Command {
  const command = new Command('svg');
  
  command
    .description('Download an icon as SVG')
    .argument('<hash>', 'Icon hash (e.g., ico_CVtS8rNWud0BTWe2)')
    .option('-o, --output <path>', 'Output directory (default: current directory)')
    .option('--name <name>', 'Custom filename (without extension)')
    .option('--no-responsive', 'Disable responsive SVG')
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
        
        const downloadOptions: DownloadSvgOptions = {
          responsive: options.responsive !== false
        };

        const outputDir = options.output || process.cwd();
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        console.log('🔍 Getting icon details...');
        const icon = await api.getIcon(iconHash);
        
        const filename = generateFilename(icon.hash, icon.name, options.name, downloadOptions.responsive);
        const outputPath = path.join(outputDir, filename);

        console.log(`📥 Downloading ${icon.name} as SVG...`);
        
        const svgBuffer = await api.downloadSvg(iconHash, downloadOptions);
        
        fs.writeFileSync(outputPath, svgBuffer);
        
        formatDownloadSuccess(outputPath, 'svg');
        console.log(`📄 Icon: ${icon.name}`);
        console.log(`🎨 Family: ${icon.familyName}`);
        console.log(`📂 Saved to: ${outputPath}`);

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
