import https from 'https';
import { URL } from 'url';
import { 
  SearchResponse, 
  IconDetail, 
  ApiError, 
  GlobalSearchOptions, 
  FamilySearchOptions,
  DownloadSvgOptions,
  DownloadPngOptions
} from '../types/api';

export class StreamlineApiError extends Error {
  constructor(
    message: string, 
    public statusCode?: number, 
    public apiError?: ApiError
  ) {
    super(message);
    this.name = 'StreamlineApiError';
  }
}

export class StreamlineApi {
  private readonly baseUrl = 'https://public-api.streamlinehq.com/v1';
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new StreamlineApiError('API key is required');
    }
    this.apiKey = apiKey;
  }

  private makeRequest<T>(path: string, params?: Record<string, string>): Promise<T> {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.baseUrl}${path}`);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.set(key, value);
          }
        });
      }

      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'accept': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              resolve(JSON.parse(data) as T);
            } catch (error) {
              reject(new StreamlineApiError(`Failed to parse response: ${error instanceof Error ? error.message : 'Unknown error'}`));
            }
          } else {
            try {
              const errorData = JSON.parse(data) as ApiError;
              reject(new StreamlineApiError(errorData.message || 'API request failed', res.statusCode, errorData));
            } catch {
              reject(new StreamlineApiError(`API request failed with status ${res.statusCode}: ${data}`, res.statusCode));
            }
          }
        });
      });

      req.on('error', (error) => {
        reject(new StreamlineApiError(`Network error: ${error.message}`));
      });

      req.end();
    });
  }

  async globalSearch(options: GlobalSearchOptions): Promise<SearchResponse> {
    const params: Record<string, string> = {
      productType: options.productType || 'icons',
      query: options.query,
      limit: String(options.limit || 50),
      offset: String(options.offset || 0)
    };

    if (options.freeOnly) {
      // API lacks a freeOnly flag; CLI callers filter results themselves.
    }

    return this.makeRequest<SearchResponse>('/search/global', params);
  }

  async familySearch(options: FamilySearchOptions): Promise<SearchResponse> {
    const params: Record<string, string> = {
      productType: options.productType || 'icons',
      limit: String(options.limit || 50),
      offset: String(options.offset || 0)
    };

    if (options.query) {
      params.query = options.query;
    }

    return this.makeRequest<SearchResponse>(`/search/family/${options.familySlug}`, params);
  }

  async getIcon(hash: string): Promise<IconDetail> {
    return this.makeRequest<IconDetail>(`/icons/${hash}`);
  }

  async downloadSvg(hash: string, options: DownloadSvgOptions = {}): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.baseUrl}/icons/${hash}/download/svg`);
      if (options.responsive) {
        url.searchParams.set('responsive', 'true');
      }

      const options_ = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'accept': 'image/svg+xml'
        }
      };

      const req = https.request(options_, (res) => {
        let data = Buffer.alloc(0);
        
        res.on('data', (chunk) => {
          data = Buffer.concat([data, chunk]);
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(data);
          } else {
            reject(new StreamlineApiError(`Download failed with status ${res.statusCode}`, res.statusCode));
          }
        });
      });

      req.on('error', (error) => {
        reject(new StreamlineApiError(`Download error: ${error.message}`));
      });

      req.end();
    });
  }

  async downloadPng(hash: string, options: DownloadPngOptions = {}): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.baseUrl}/icons/${hash}/download/png`);
      
      if (options.size) {
        url.searchParams.set('size', String(options.size));
      }

      const options_ = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'accept': 'image/png'
        }
      };

      const req = https.request(options_, (res) => {
        let data = Buffer.alloc(0);
        
        res.on('data', (chunk) => {
          data = Buffer.concat([data, chunk]);
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(data);
          } else {
            reject(new StreamlineApiError(`Download failed with status ${res.statusCode}`, res.statusCode));
          }
        });
      });

      req.on('error', (error) => {
        reject(new StreamlineApiError(`Download error: ${error.message}`));
      });

      req.end();
    });
  }
}
