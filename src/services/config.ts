import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

export interface StreamlineConfig {
  apiKey?: string;
}

export class ConfigService {
  private static configDir = path.join(process.env.HOME || process.env.USERPROFILE || '', '.config', 'streamline');
  private static configFile = path.join(this.configDir, 'config.toml');

  /** Prefer caller overrides before falling back to the stored config key. */
  static async getApiKey(commandLineKey?: string, envKey?: string, globalOptionKey?: string): Promise<string | undefined> {
    if (commandLineKey) {
      return commandLineKey;
    }

    if (globalOptionKey) {
      return globalOptionKey;
    }

    if (envKey) {
      return envKey;
    }

    try {
      const configFileKey = await this.getConfigFileApiKey();
      if (configFileKey) {
        return configFileKey;
      }
    } catch (error) {
      // Missing or malformed config should not block other sources.
    }

    return undefined;
  }

  /** Load the persisted API key from config if the file exists. */
  private static async getConfigFileApiKey(): Promise<string | undefined> {
    try {
      if (!fs.existsSync(this.configFile)) {
        return undefined;
      }

      const content = await readFile(this.configFile, 'utf8');
      
      // Regex is enough because the config currently stores only auth.apiKey.
      const apiKeyMatch = content.match(/apiKey\s*=\s*["']([^"']+)["']/);
      
      if (apiKeyMatch && apiKeyMatch[1]) {
        return apiKeyMatch[1].trim();
      }

      return undefined;
    } catch (error) {
      console.warn(`⚠️  Could not read config file: ${error}`);
      return undefined;
    }
  }

  /** Seed a starter config so first-time users know where to place the key. */
  static async createDefaultConfig(): Promise<void> {
    try {
      if (!fs.existsSync(this.configDir)) {
        fs.mkdirSync(this.configDir, { recursive: true });
      }

      if (fs.existsSync(this.configFile)) {
        console.log(`ℹ️  Config file already exists at: ${this.configFile}`);
        console.log('✅ Skipping creation to preserve your saved settings.');
        console.log('');
        return;
      }

      const defaultConfig = `# Streamline CLI Configuration
# Get your API key from: https://www.streamlinehq.com/profile?tab=api_keys

[auth]
apiKey = ""`;

      fs.writeFileSync(this.configFile, defaultConfig);
      console.log(`📝 Created default config file: ${this.configFile}`);
      console.log('🔑 Please edit the config file and add your API key.');
      console.log('');
    } catch (error) {
      console.error(`❌ Failed to create config file: ${error}`);
    }
  }
  static getConfigFilePath(): string {
    return this.configFile;
  }
  static configFileExists(): boolean {
    return fs.existsSync(this.configFile);
  }
}
