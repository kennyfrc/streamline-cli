import { Command } from 'commander';
import { StreamlineApi, StreamlineApiError } from '../../services/streamline-api';
import { ConfigService } from '../../services/config';
import { FamilySearchOptions } from '../../types/api';
import { formatSearchResults, formatError } from '../../utils/format';

export function createFamilySearchCommand(): Command {
  const command = new Command('family');
  
  command
    .description('Search for icons within a specific family')
    .argument('<familySlug>', 'Family slug (e.g., material-pro-sharp-line)')
    .argument('[query]', 'Search query (optional - use * for all icons)', '')
    .option('-t, --product-type <type>', 'Product type', 'icons')
    .option('-l, --limit <number>', 'Number of results (max 100)', '50')
    .option('-o, --offset <number>', 'Pagination offset', '0')
    .option('--category <name>', 'Filter by category')
    .option('--free-only', 'Show only free icons')
    .option('--api-key <key>', 'API key (or use STREAMLINE_API_KEY env var)')
    .action(async (familySlug: string, query: string, options: any, command: Command) => {
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
        
        const searchOptions: FamilySearchOptions = {
          familySlug,
          query: query || '*',  // API treats * as "list all".
          productType: options.productType as 'icons' | 'illustrations' | 'emoji' | 'elements',
          limit: parseInt(options.limit),
          offset: parseInt(options.offset)
        };

        if (options.category) {
          searchOptions.category = options.category;
        }
        
        if (options.freeOnly) {
          searchOptions.freeOnly = true;
        }

        const displayQuery = query || '*';
        console.log(`🔍 Searching family "${familySlug}"${displayQuery !== '*' ? ` for "${displayQuery}"` : ' (all icons)'}...`);
        
        const response = await api.familySearch(searchOptions);
        
        let filteredResults = response.results;
        
        if (options.freeOnly) {
          filteredResults = filteredResults.filter(icon => icon.isFree);
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
