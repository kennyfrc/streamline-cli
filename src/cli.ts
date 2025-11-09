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
  .description('CLI tool for Streamline Icons API\n\nCommon usage:\n  $ streamline search home                          # Global search\n  $ streamline search folder --family material      # Search Material family\n  $ streamline search family "Material Symbols" doc # Search specific family\n  $ streamline download svg <hash>                  # Download icon')
  .version('1.0.0')
.helpOption('-h, --help', 'display help for command');
program
  .option('--api-key <key>', 'API key (or use STREAMLINE_API_KEY environment variable)')
  .option('--verbose', 'verbose output');

const searchCommand = program
  .command('search')
  .description('Search for icons\n\n💡 Quick start:\n   $ streamline search home                    # Global search\n   $ streamline search folder --family sharp   # Search in Sharp family\n   $ streamline search family material folder  # Alternative syntax')
  .argument('[query]', 'Search query')
  .option('--family <name>', 'Search in specific family (e.g., material, sharp, core)')
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
    
    // Handle --family flag - route to family search
    if (options.family && query) {
      try {
        const familySearchCmd = createFamilySearchCommand();
        await familySearchCmd.parseAsync([options.family, query], { from: 'user' });
      } catch (error) {
        console.error('❌ Family search failed:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
      return;
    }
    
    // Show helpful message when no query or subcommand provided
    if (!query) {
      console.log('💡 Search globally:  streamline search home');
      console.log('💡 Search in family: streamline search folder --family material');
      console.log('💡 Alternative:     streamline search family "Material Symbols" doc\n');
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
