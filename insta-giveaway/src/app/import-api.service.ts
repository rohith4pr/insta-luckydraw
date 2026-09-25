import { Injectable } from '@angular/core';
import { Entrant } from './entrants.service';

interface ImportResponse {
  entrants: Entrant[];
  warnings: string[];
}

interface AppConfig {
  apiBaseUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class ImportApiService {
  private apiBaseUrl?: Promise<string>;

  async upload(file: File): Promise<ImportResponse> {
    const form = new FormData();
    form.append('file', file);

    const apiBaseUrl = await this.getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/api/import`, {
      method: 'POST',
      body: form,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail ?? 'The file could not be imported.');
    }

    return {
      entrants: result.entrants.map((entrant: Entrant) => ({
        ...entrant,
        avatar: entrant.avatar ? new URL(entrant.avatar, apiBaseUrl || window.location.origin).href : '',
      })),
      warnings: result.warnings ?? [],
    };
  }

  private getApiBaseUrl(): Promise<string> {
    this.apiBaseUrl ??= fetch('/app-config.json')
      .then((response) => response.json() as Promise<AppConfig>)
      .then((config) => (config.apiBaseUrl ?? '').replace(/\/$/, ''));
    return this.apiBaseUrl;
  }
}
