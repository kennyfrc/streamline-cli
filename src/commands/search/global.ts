import { Command } from 'commander';
import { StreamlineApi, StreamlineApiError } from '../../services/streamline-api';
import { ConfigService } from '../../services/config';
import { GlobalSearchOptions } from '../../types/api';
import { formatSearchResults, formatError } from '../../utils/format';

export function createGlobalSearchCommand(): Command {
  const command = new Command('global');
  
  command
    .description('Search for icons across all families')
    .argument('<query>', 'Search query (e.g., "home", "folder", "user")')
    .option('-t, --product-type <type>', 'Product type', 'icons')
    .option('-l, --limit <number>', 'Number of results (max 100)', '50')
    .option('-o, --offset <number>', 'Pagination offset', '0')
    .option('--style <name>', 'Filter by style/family (see "streamline search family <familySlug> *" to explore families)')
    .option('--category <name>', 'Filter by category')
    .option('--free-only', 'Show only free icons')
    .option('--api-key <key>', 'API key (or use STREAMLINE_API_KEY env var)')
    .addHelpText('after', `
Examples:
  $ streamline search global home --limit 10
  $ streamline search global folder --free-only
  $ streamline search global user --style material

💡 PRO TIP: Find available families with:
  $ streamline search family material-pro-sharp-line * --limit 5
  $ streamline search family "font-awesome-regular" * --limit 5
`)
    .action(async (query: string, options: any, command: Command) => {
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
        
        const searchOptions: GlobalSearchOptions = {
          query,
          productType: options.productType as 'icons' | 'illustrations' | 'emoji' | 'elements',
          limit: parseInt(options.limit),
          offset: parseInt(options.offset)
        };

        if (options.style) {
          searchOptions.style = options.style;
        }
        
        if (options.category) {
          searchOptions.category = options.category;
        }
        
        if (options.freeOnly) {
          searchOptions.freeOnly = true;
        }

        console.log(`🔍 Searching for "${query}"...`);
        
        const response = await api.globalSearch(searchOptions);
        
        let filteredResults = response.results;
        
        if (options.freeOnly) {
          filteredResults = filteredResults.filter(icon => icon.isFree);
        }
        
        if (options.style) {
          const styleFilter = options.style.toLowerCase();
          filteredResults = filteredResults.filter(icon => 
            icon.familySlug.toLowerCase().includes(styleFilter) ||
            icon.familyName.toLowerCase().includes(styleFilter)
          );
        }
        
        if (options.category) {
          const categoryFilter = options.category.toLowerCase();
          filteredResults = filteredResults.filter(icon => 
            icon.categorySlug.toLowerCase().includes(categoryFilter) ||
            icon.categoryName.toLowerCase().includes(categoryFilter)
          );
        }

        formatSearchResults(filteredResults, response.pagination);

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
