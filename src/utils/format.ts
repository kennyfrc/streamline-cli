import { IconSearchResult, IconDetail } from '../types/api';

export function formatSearchResults(results: IconSearchResult[], pagination?: { total: number; hasMore: boolean; offset: number }): void {
  if (results.length === 0) {
    console.log('No results found.');
    return;
  }

  console.log(`\n🔍 Search Results (${results.length} icons)`);
  if (pagination) {
    console.log(`📊 Total: ${pagination.total} icons`);
  }
  console.log('');

  results.forEach((icon, index) => {
    const freeBadge = icon.isFree ? '🆓 FREE' : '💎 PRO';
    const family = icon.familyName;
    const category = icon.categoryName;
    
    console.log(`${index + 1}. ${icon.name}`);
    console.log(`   Hash: ${icon.hash}`);
    console.log(`   Family: ${family}`);
    console.log(`   Category: ${category}`);
    console.log(`   Status: ${freeBadge}`);
    console.log(`   Preview: ${icon.imagePreviewUrl}`);
    console.log('');
  });

  if (pagination?.hasMore) {
    console.log(`💡 Use --offset ${pagination.offset + results.length} to see more results`);
  }
}

export function formatIconDetail(icon: IconDetail): void {
  console.log(`\n📄 Icon Details: ${icon.name}`);
  console.log(`Hash: ${icon.hash}`);
  console.log(`Family: ${icon.familyName}`);
  console.log(`Category: ${icon.categoryName}`);
  console.log(`Subcategory: ${icon.subcategoryName}`);
  console.log(`Free: ${icon.isFree ? 'Yes' : 'No'}`);
  console.log(`Preview: ${icon.imagePreviewUrl}`);
  
  if (icon.colors && icon.colors.length > 0) {
    console.log(`Colors: ${icon.colors.join(', ')}`);
  }
  
  if (icon.tags && icon.tags.length > 0) {
    console.log(`Tags: ${icon.tags.join(', ')}`);
  }
  
  if (icon.description) {
    console.log(`Description: ${icon.description}`);
  }
}

export function formatError(error: Error): void {
  console.error(`❌ Error: ${error.message}`);
  
  if (error.name === 'StreamlineApiError') {
    const apiError = (error as any).apiError;
    if (apiError) {
      console.error(`Status: ${apiError.statusCode}`);
      console.error(`Details: ${apiError.error}`);
    }
  }
}

export function formatDownloadSuccess(filePath: string, format: 'svg' | 'png'): void {
  console.log(`✅ Successfully downloaded ${format.toUpperCase()} icon to: ${filePath}`);
}

export function formatProgress(message: string): void {
  console.log(`⏳ ${message}`);
}
