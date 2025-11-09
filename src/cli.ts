#!/usr/bin/env node

import { Command } from 'commander';
import { createGlobalSearchCommand } from './commands/search/global';
import { createFamilySearchCommand } from './commands/search/family';
import { createDownloadSvgCommand } from './commands/download/svg';
import { createDownloadPngCommand } from './commands/download/png';
import { createGetIconCommand } from './commands/get/icon';
import { ConfigService } from './services/config';
import { listAllSets, listFamiliesInSet } from './data/families';

const program = new Command();

program
  .name('streamline')
  .description('CLI tool for Streamline Icons API\n\nCommon usage:\n  $ streamline search home              # Search for "home" icon globally\n  $ streamline search family mat *      # Explore Material family\n  $ streamline download svg <hash>      # Download icon')
  .version('1.0.0')
.helpOption('-h, --help', 'display help for command');
program
  .option('--api-key <key>', 'API key (or use STREAMLINE_API_KEY environment variable)')
  .option('--verbose', 'verbose output');

const searchCommand = program
  .command('search')
  .description('Search for icons\n\n💡 Quick start: streamline search <query>           # Search globally\n   Advanced: streamline search global <query>         # Explicit global search\n   Targeted: streamline search family <family> <query> # Search in a specific family')
  .argument('[query]', 'Search query (try: streamline search home)')
  .option('-l, --limit <number>', 'Number of results (max 100)', '50')
  .option('--api-key <key>', 'API key (or use STREAMLINE_API_KEY env var)')
  .option('--sets', 'List all available icon sets (e.g., Ultimate, Sharp, Core, Material Pro)')
  .option('--list-families <set>', 'List families within a set (e.g., --list-families sharp)')
  .action(async (query: string | undefined, options: any, command: Command) => {
    // Handle --sets flag (list available sets)
    if (options.sets) {
      listAllSets();
      return;
    }
    
    // Handle --list-families flag (list families in a set)
    if (options.listFamilies) {
      listFamiliesInSet(options.listFamilies);
      return;
    }
    
    // Show helpful message when no query or subcommand provided
    if (!query) {
      console.log('💡 Usage: streamline search <query>           # Search globally\n   Example: streamline search home\n');
      console.log('   Advanced: streamline search global <query>    # Explicit global search');
      console.log('   Targeted: streamline search family <family> <query> # Search in specific family\n');
      console.log('🤔 Not sure which family to use?');
      console.log('   Try: streamline search --sets           # List all sets');
      console.log('   Try: streamline search --list-families sharp  # List families in Sharp set\n');
      command.help();
      return;
    }

    // Default to global search when query provided without subcommand
    try {
      const globalSearchCmd = createGlobalSearchCommand();
      const searchArgv = [query];
      
      // Pass through any options
      if (options.limit) searchArgv.push('--limit', options.limit);
      if (options.apiKey) searchArgv.push('--api-key', options.apiKey);
      
      // Parse with the global command directly
      await globalSearchCmd.parseAsync(searchArgv, { from: 'user' });
    } catch (error) {
      console.error('❌ Search failed:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

searchCommand.addCommand(createGlobalSearchCommand());
searchCommand.addCommand(createFamilySearchCommand());

const downloadCommand = program
  .command('download')
  .description('Download icons');

downloadCommand.addCommand(createDownloadSvgCommand());
downloadCommand.addCommand(createDownloadPngCommand());

const getCommand = program
  .command('get')
  .description('Get icon information');

getCommand.addCommand(createGetIconCommand());

program
  .command('init')
  .description('Initialize configuration file')
  .action(async () => {
    await ConfigService.createDefaultConfig();
  });

program
  .command('help')
  .description('display help for command')
  .action(() => {
    program.help();
  });

program.parse();
