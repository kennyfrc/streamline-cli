import { Command } from 'commander';
import { StreamlineApi, StreamlineApiError } from '../../services/streamline-api';
import { ConfigService } from '../../services/config';
import { FamilySearchOptions } from '../../types/api';
import { formatSearchResults, formatError } from '../../utils/format';
import { 
  resolveFamilyInput, 
  findSimilarNames,
  findFamilyBySlug
} from '../../data/families';

export function createFamilySearchCommand(): Command {
  const command = new Command('family');
  
  command
    .description('Search for icons within a specific family or set (run "streamline search --sets" to see available sets)')
    .argument('<familySlug>', 'Family slug or set name (e.g., material-pro-sharp-line, sharp, core, flex)')
    .argument('[query]', 'Search query (use "*" for all icons in family/set)', '*')
    .option('-t, --product-type <type>', 'Product type', 'icons')
    .option('-l, --limit <number>', 'Number of results per family (max 100)', '50')
    .option('-o, --offset <number>', 'Pagination offset', '0')
    .option('--style <style>', 'Filter by style (Line, Solid, Duo, Flat, Remix, Gradient, Neon, Pop, Colors) - only works with set names')
    .option('--category <name>', 'Filter by category')
    .option('--free-only', 'Show only free icons')
    .option('--api-key <key>', 'API key (or use STREAMLINE_API_KEY env var)')
    .addHelpText('after', `
Examples:
  # Search in a specific family by slug
  $ streamline search family material-pro-sharp-line home --limit 10
  
  # Search in all families of a set (fuzzy matching)
  $ streamline search family sharp home
  $ streamline search family material user
  $ streamline search family core * --limit 5
  
  # Filter by style within a set
  $ streamline search family sharp --style line home
  $ streamline search family core --style solid user
  $ streamline search family ultimate --style duo star
  
  # Discover available sets and families
  $ streamline search --sets
  $ streamline search --list-families sharp

💡 PRO TIP: Use set names instead of full slugs for easier searching
   Try: streamline search family sharp home        # Searches all Sharp families
   Instead of: streamline search family sharp-line home  # Only one family
`)
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
        
        // Resolve family input (handle sets, fuzzy matching, etc.)
        const familiesToSearch = resolveFamilyInput(familySlug, options.style);
        
        if (familiesToSearch.length === 0) {
          // No matches found - show helpful error with suggestions
          const suggestions = findSimilarNames(familySlug);
          
          console.error(`❌ Unknown family or set: ${familySlug}`);
          
          if (suggestions.length > 0) {
            console.log('\n💡 Did you mean:');
            suggestions.forEach(s => console.log(`   - ${s}`));
          }
          
          // Show general discovery help
          console.log('\n💡 Discovery commands:');
          console.log('   - streamline search --sets                    # List all sets');
          console.log('   - streamline search --list-families <set>     # List families in a set');
          
          // Show usage examples
          console.log('\n💡 Usage examples:');
          console.log('   - Search by set: streamline search family sharp home');
          console.log('   - Search by family: streamline search family sharp-line home');
          console.log('   - With style filter: streamline search family core --style solid user');
          
          process.exit(1);
        }
        
        const displayQuery = query || '*';
        let allResults: any[] = [];
        let totalResults = 0;
        let searchCount = 0;
        
        // Search each resolved family
        for (const slug of familiesToSearch) {
          try {
            const searchOptions: FamilySearchOptions = {
              familySlug: slug,
              query: query || '*',
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
            
            // Show search header for multiple families
            if (familiesToSearch.length > 1) {
              const familyInfo = findFamilyBySlug(slug);
              const displayName = familyInfo?.displayName || slug;
              console.log(`\n🔍 Searching ${displayName}...`);
            } else {
              console.log(`🔍 Searching family "${familySlug}"${displayQuery !== '*' ? ` for "${displayQuery}"` : ' (all icons)'}...`);
            }
            
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
            
            // Add family name to each result for combined display
            const familyInfo = findFamilyBySlug(slug);
            const enrichedResults = filteredResults.map(result => ({
              ...result,
              _familyDisplayName: familyInfo?.displayName || slug
            }));
            
            // Show results for this family
            if (familiesToSearch.length === 1) {
              formatSearchResults(filteredResults, response.pagination);
            } else if (enrichedResults.length > 0) {
              // Show family header and first few results
              console.log(`   Found ${enrichedResults.length} icons`);
              const displayLimit = Math.min(3, enrichedResults.length);
              for (let i = 0; i < displayLimit; i++) {
                const result = enrichedResults[i];
                if (result) {
                  console.log(`   ${i + 1}. ${result.name} (${result.hash})`);
                }
              }
              if (enrichedResults.length > displayLimit) {
                console.log(`   ... and ${enrichedResults.length - displayLimit} more`);
              }
            }
            
            searchCount++;
            allResults = allResults.concat(enrichedResults);
            totalResults += response.pagination.total;
            
          } catch (error) {
            // Log error for this family but continue with others
            console.error(`   ⚠️  Failed to search ${slug}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
        
        // Show summary for multiple family searches
        if (familiesToSearch.length > 1) {
          console.log(`\n📊 Summary: Searched ${familiesToSearch.length} families, found ${allResults.length} total icons`);
          
          // Group by family for display
          interface GroupedResults {
            [family: string]: any[];
          }
          
          const grouped = allResults.reduce((acc: GroupedResults, result: any) => {
            const family = result._familyDisplayName;
            if (!acc[family]) acc[family] = [];
            acc[family].push(result);
            return acc;
          }, {} as GroupedResults);
          
          console.log('\n📈 Results by family:');
          Object.entries(grouped).forEach(([family, results]) => {
            console.log(`   ${family}: ${results.length} icons`);
          });
        }

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
