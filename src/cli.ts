#!/usr/bin/env node

import { Command } from 'commander';
import { createGlobalSearchCommand } from './commands/search/global';
import { createFamilySearchCommand } from './commands/search/family';
import { createDownloadSvgCommand } from './commands/download/svg';
import { createDownloadPngCommand } from './commands/download/png';
import { createGetIconCommand } from './commands/get/icon';
import { ConfigService } from './services/config';

const program = new Command();

program
  .name('streamline')
  .description('CLI tool for Streamline Icons API')
  .version('1.0.0')
.helpOption('-h, --help', 'display help for command');
program
  .option('--api-key <key>', 'API key (or use STREAMLINE_API_KEY environment variable)')
  .option('--verbose', 'verbose output');

const searchCommand = program
  .command('search')
  .description('Search for icons');

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
