// Centralized family data structure mapping sets to families
// This compensates for Streamline API's lack of family discovery endpoints

export interface FamilyInfo {
  displayName: string;
  slug: string;
}

export interface FamilySet {
  name: string;
  families: Record<string, FamilyInfo>;
}

export const FAMILY_SETS: Record<string, FamilySet> = {
  // Streamline Core Sets
  'ultimate': {
    name: 'Ultimate',
    families: {
      'ultimate-bold': { displayName: 'Ultimate Bold', slug: 'ultimate-bold' },
      'ultimate-light': { displayName: 'Ultimate Light', slug: 'ultimate-light' },
      'ultimate-regular': { displayName: 'Ultimate Regular', slug: 'ultimate-regular' },
      'ultimate-colors': { displayName: 'Ultimate Colors', slug: 'ultimate-colors' },
      'ultimate-duotone': { displayName: 'Ultimate Duotone', slug: 'ultimate-duotone' }
    }
  },
  'sharp': {
    name: 'Sharp',
    families: {
      'sharp-line': { displayName: 'Sharp Line', slug: 'sharp-line' },
      'sharp-solid': { displayName: 'Sharp Solid', slug: 'sharp-solid' },
      'sharp-duo': { displayName: 'Sharp Duo', slug: 'sharp-duo' },
      'sharp-flat': { displayName: 'Sharp Flat', slug: 'sharp-flat' },
      'sharp-remix': { displayName: 'Sharp Remix', slug: 'sharp-remix' },
      'sharp-gradient': { displayName: 'Sharp Gradient', slug: 'sharp-gradient' },
      'sharp-neon': { displayName: 'Sharp Neon', slug: 'sharp-neon' },
      'sharp-pop': { displayName: 'Sharp Pop', slug: 'sharp-pop' }
    }
  },
  'core': {
    name: 'Core',
    families: {
      'core-line': { displayName: 'Core Line', slug: 'core-line' },
      'core-solid': { displayName: 'Core Solid', slug: 'core-solid' },
      'core-duo': { displayName: 'Core Duo', slug: 'core-duo' },
      'core-flat': { displayName: 'Core Flat', slug: 'core-flat' },
      'core-remix': { displayName: 'Core Remix', slug: 'core-remix' },
      'core-gradient': { displayName: 'Core Gradient', slug: 'core-gradient' },
      'core-neon': { displayName: 'Core Neon', slug: 'core-neon' },
      'core-pop': { displayName: 'Core Pop', slug: 'core-pop' }
    }
  },
  'flex': {
    name: 'Flex',
    families: {
      'flex-line': { displayName: 'Flex Line', slug: 'flex-line' },
      'flex-solid': { displayName: 'Flex Solid', slug: 'flex-solid' },
      'flex-duo': { displayName: 'Flex Duo', slug: 'flex-duo' },
      'flex-flat': { displayName: 'Flex Flat', slug: 'flex-flat' },
      'flex-remix': { displayName: 'Flex Remix', slug: 'flex-remix' },
      'flex-gradient': { displayName: 'Flex Gradient', slug: 'flex-gradient' },
      'flex-neon': { displayName: 'Flex Neon', slug: 'flex-neon' },
      'flex-pop': { displayName: 'Flex Pop', slug: 'flex-pop' }
    }
  },
  'plump': {
    name: 'Plump',
    families: {
      'plump-line': { displayName: 'Plump Line', slug: 'plump-line' },
      'plump-solid': { displayName: 'Plump Solid', slug: 'plump-solid' },
      'plump-duo': { displayName: 'Plump Duo', slug: 'plump-duo' },
      'plump-flat': { displayName: 'Plump Flat', slug: 'plump-flat' },
      'plump-remix': { displayName: 'Plump Remix', slug: 'plump-remix' },
      'plump-gradient': { displayName: 'Plump Gradient', slug: 'plump-gradient' },
      'plump-neon': { displayName: 'Plump Neon', slug: 'plump-neon' },
      'plump-pop': { displayName: 'Plump Pop', slug: 'plump-pop' }
    }
  },
  'micro': {
    name: 'Micro',
    families: {
      'micro-line': { displayName: 'Micro Line', slug: 'micro-line' },
      'micro-solid': { displayName: 'Micro Solid', slug: 'micro-solid' }
    }
  },
  'freehand': {
    name: 'Freehand',
    families: {
      'freehand-duotone': { displayName: 'Freehand Duotone', slug: 'freehand-duotone' }
    }
  },
  
  // Material Pro (Google Material Icons adaptation)
  'material-pro': {
    name: 'Material Pro',
    families: {
      'sharp-line-material-pro': { displayName: 'Sharp Line - Material Pro', slug: 'sharp-line-material-pro' },
      'outlined-line-material-pro': { displayName: 'Outlined Line - Material Pro', slug: 'outlined-line-material-pro' },
      'rounded-line-material-pro': { displayName: 'Rounded Line - Material Pro', slug: 'rounded-line-material-pro' },
      'sharp-fill-material-pro': { displayName: 'Sharp Fill - Material Pro', slug: 'sharp-fill-material-pro' },
      'outlined-fill-material-pro': { displayName: 'Outlined Fill - Material Pro', slug: 'outlined-fill-material-pro' },
      'rounded-fill-material-pro': { displayName: 'Rounded Fill - Material Pro', slug: 'rounded-fill-material-pro' }
    }
  },
  
  // Nova family
  'nova': {
    name: 'Nova',
    families: {
      'nova-line': { displayName: 'Nova Line', slug: 'nova-line' },
      'nova-solid': { displayName: 'Nova Solid', slug: 'nova-solid' }
    }
  },
  
  // Cyber family
  'cyber': {
    name: 'Cyber',
    families: {
      'cyber-line': { displayName: 'Cyber Line', slug: 'cyber-line' },
      'cyber-duotone': { displayName: 'Cyber Duotone', slug: 'cyber-duotone' }
    }
  },
  
  // Kameleon family
  'kameleon': {
    name: 'Kameleon',
    families: {
      'kameleon-colors': { displayName: 'Kameleon Colors', slug: 'kameleon-colors' },
      'kameleon-duo': { displayName: 'Kameleon Duo', slug: 'kameleon-duo' },
      'kameleon-pop': { displayName: 'Kameleon Pop', slug: 'kameleon-pop' }
    }
  },
  
  // Solar family
  'solar': {
    name: 'Solar',
    families: {
      'solar-bold': { displayName: 'Solar Bold', slug: 'solar-bold' },
      'solar-bold-duotone': { displayName: 'Solar Bold Duotone', slug: 'solar-bold-duotone' },
      'solar-line-duotone': { displayName: 'Solar Line Duotone', slug: 'solar-line-duotone' },
      'solar-linear': { displayName: 'Solar Linear', slug: 'solar-linear' },
      'solar-broken': { displayName: 'Solar Broken', slug: 'solar-broken' }
    }
  },
  
  // External/Third-party icon sets
  'material-symbols': {
    name: 'Material Symbols',
    families: {
      'sharp-line-material-symbols': { displayName: 'Sharp Line - Material Symbols', slug: 'sharp-line-material-symbols' },
      'outlined-line-material-symbols': { displayName: 'Outlined Line - Material Symbols', slug: 'outlined-line-material-symbols' },
      'rounded-line-material-symbols': { displayName: 'Rounded Line - Material Symbols', slug: 'rounded-line-material-symbols' },
      'sharp-fill-material-symbols': { displayName: 'Sharp Fill - Material Symbols', slug: 'sharp-fill-material-symbols' },
      'outlined-fill-material-symbols': { displayName: 'Outlined Fill - Material Symbols', slug: 'outlined-fill-material-symbols' },
      'rounded-fill-material-symbols': { displayName: 'Rounded Fill - Material Symbols', slug: 'rounded-fill-material-symbols' }
    }
  },
  
  'tabler': {
    name: 'Tabler',
    families: {
      'tabler-line': { displayName: 'Tabler Line', slug: 'tabler-line' },
      'tabler-filled': { displayName: 'Tabler Filled', slug: 'tabler-filled' }
    }
  },
  
  'remix': {
    name: 'Remix',
    families: {
      'remix-line': { displayName: 'Remix Line', slug: 'remix-line' },
      'remix-fill': { displayName: 'Remix Fill', slug: 'remix-fill' }
    }
  },
  
  'carbon': {
    name: 'Carbon',
    families: {
      'carbon': { displayName: 'Carbon', slug: 'carbon' }
    }
  },
  
  'feather': {
    name: 'Feather',
    families: {
      'feather': { displayName: 'Feather', slug: 'feather' }
    }
  },
  
  'iconoir': {
    name: 'Iconoir',
    families: {
      'iconoir-regular': { displayName: 'Iconoir Regular', slug: 'iconoir-regular' }
    }
  },
  
  'unicons': {
    name: 'Unicons',
    families: {
      'unicons-line': { displayName: 'Unicons Line', slug: 'unicons-line' }
    }
  },
  
  'bootstrap': {
    name: 'Bootstrap',
    families: {
      'bootstrap': { displayName: 'Bootstrap', slug: 'bootstrap' }
    }
  },
  
  'atlas': {
    name: 'Atlas',
    families: {
      'atlas-line': { displayName: 'Atlas Line', slug: 'atlas-line' }
    }
  },
  
  'heroicons': {
    name: 'Heroicons',
    families: {
      'heroicons-outline': { displayName: 'Heroicons Outline', slug: 'heroicons-outline' },
      'heroicons-solid': { displayName: 'Heroicons Solid', slug: 'heroicons-solid' }
    }
  },
  
  'font-awesome': {
    name: 'Font Awesome',
    families: {
      'font-awesome-regular': { displayName: 'Font Awesome Regular', slug: 'font-awesome-regular' },
      'font-awesome-solid': { displayName: 'Font Awesome Solid', slug: 'font-awesome-solid' }
    }
  },
  
  'phosphor': {
    name: 'Phosphor',
    families: {
      'phosphor-thin': { displayName: 'Phosphor Thin', slug: 'phosphor-thin' },
      'phosphor-light': { displayName: 'Phosphor Light', slug: 'phosphor-light' },
      'phosphor-regular': { displayName: 'Phosphor Regular', slug: 'phosphor-regular' },
      'phosphor-bold': { displayName: 'Phosphor Bold', slug: 'phosphor-bold' },
      'phosphor-fill': { displayName: 'Phosphor Fill', slug: 'phosphor-fill' },
      'phosphor-duotone': { displayName: 'Phosphor Duotone', slug: 'phosphor-duotone' }
    }
  },
  
  'lucide': {
    name: 'Lucide',
    families: {
      'lucide-line': { displayName: 'Lucide Line', slug: 'lucide-line' }
    }
  },
  
  'mingcute': {
    name: 'MingCute',
    families: {
      'mingcute-line': { displayName: 'MingCute Line', slug: 'mingcute-line' },
      'mingcute-fill': { displayName: 'MingCute Fill', slug: 'mingcute-fill' }
    }
  },
  
  'mynaui': {
    name: 'Mynaui',
    families: {
      'mynaui-line': { displayName: 'Mynaui Line', slug: 'mynaui-line' }
    }
  },
  
  'radix': {
    name: 'Radix',
    families: {
      'radix': { displayName: 'Radix', slug: 'radix' }
    }
  },
  
  'ionic': {
    name: 'Ionic',
    families: {
      'ionic-sharp': { displayName: 'Ionic Sharp', slug: 'ionic-sharp' }
    }
  }
};

// Style variations for filtering
export const STYLES = ['Line', 'Solid', 'Duo', 'Flat', 'Remix', 'Gradient', 'Neon', 'Pop', 'Colors'];

// Helper functions for fuzzy matching
export function getAllFamilySlugs(): string[] {
  const slugs: string[] = [];
  Object.values(FAMILY_SETS).forEach(set => {
    Object.values(set.families).forEach(family => {
      slugs.push(family.slug);
    });
  });
  return slugs;
}

export function getAllSetNames(): string[] {
  return Object.values(FAMILY_SETS).map(set => set.name);
}

export function findSetByName(name: string): FamilySet | undefined {
  const key = name.toLowerCase();
  return FAMILY_SETS[key];
}

export function findFamilyBySlug(slug: string): FamilyInfo | undefined {
  for (const set of Object.values(FAMILY_SETS)) {
    for (const family of Object.values(set.families)) {
      if (family.slug === slug) {
        return family;
      }
    }
  }
  return undefined;
}

export function resolveFamilyInput(input: string, style?: string): string[] {
  // First check if it's an exact family slug
  const exactMatch = findFamilyBySlug(input);
  if (exactMatch) {
    return [exactMatch.slug];
  }
  
  // Check if it's a partial family slug match
  const allSlugs = getAllFamilySlugs();
  const partialMatches = allSlugs.filter(slug => 
    slug.toLowerCase().includes(input.toLowerCase()) ||
    input.toLowerCase().includes(slug.toLowerCase())
  );
  if (partialMatches.length > 0 && partialMatches.length <= 10) {
    return partialMatches;
  }
  
  // Enhanced: Check common aliases
  const inputLower = input.toLowerCase();
  
  // Map common shorthand to set keys
  const aliasMap: Record<string, string> = {
    'mat': 'material-pro',
    'material': 'material-pro',
    'materials': 'material-pro',
    'matpro': 'material-pro',
    'material-pro': 'material-pro',
    'materialpro': 'material-pro',
    'material-symbols': 'material-symbols',
    'material symbols': 'material-symbols',
    'mat-sym': 'material-symbols',
    'matsymbols': 'material-symbols',
    'materialsymbols': 'material-symbols'
  };
  
  const mappedKey = aliasMap[inputLower];
  if (mappedKey) {
    const set = FAMILY_SETS[mappedKey];
    if (set) {
      let families = Object.values(set.families);
      
      // Filter by style if provided
      if (style) {
        families = families.filter(f => {
          const styleLower = style.toLowerCase();
          return f.slug.toLowerCase().includes(styleLower);
        });
      }
      
      return families.map(f => f.slug);
    }
  }
  
  // Check if it's a set name
  const set = findSetByName(input);
  if (set) {
    let families = Object.values(set.families);
    
    // Filter by style if provided
    if (style) {
      families = families.filter(f => {
        const styleLower = style.toLowerCase();
        return f.slug.toLowerCase().includes(styleLower);
      });
    }
    
    return families.map(f => f.slug);
  }
  
  return [];
}

export function findSimilarNames(input: string, maxResults: number = 5): string[] {
  const allNames: string[] = [
    ...getAllSetNames(),
    ...getAllFamilySlugs()
  ];
  
  const lowercaseInput = input.toLowerCase();
  
  // Find names that contain the input or are contained in the input
  let matches = allNames.filter(name => {
    const lowercaseName = name.toLowerCase();
    return lowercaseName.includes(lowercaseInput) || lowercaseInput.includes(lowercaseName);
  });
  
  // If no matches, try fuzzy matching by splitting input
  if (matches.length === 0) {
    const parts = lowercaseInput.split(/[-\s]/);
    matches = allNames.filter(name => {
      const lowercaseName = name.toLowerCase();
      return parts.some(part => lowercaseName.includes(part));
    });
  }
  
  return matches.slice(0, maxResults);
}

export function listAllSets(): void {
  console.log('📦 Available Icon Sets:');
  Object.values(FAMILY_SETS).forEach((setData) => {
    const familyCount = Object.keys(setData.families).length;
    console.log(`  ${setData.name.padEnd(20)} (${familyCount} families)`);
  });
}

export function listFamiliesInSet(setName: string): void {
  const set = findSetByName(setName);
  
  if (!set) {
    console.error(`❌ Unknown set: ${setName}`);
    console.log('\n💡 Use --sets to see available sets');
    process.exit(1);
  }
  
  console.log(`\n🏷️  Families in ${set.name}:`);
  Object.values(set.families).forEach((family) => {
    console.log(`  ${family.displayName.padEnd(30)} (slug: ${family.slug})`);
  });
}