import { Injectable } from '@angular/core';
import { Entrant } from './entrants.service';

interface ImportResponse {
  entrants: Entrant[];
  warnings: string[];
}

@Injectable({ providedIn: 'root' })
export class ImportApiService {
  async upload(file: File): Promise<ImportResponse> {
    const form = new FormData();
    form.append('file', file);

    const response = await fetch('/api/import', {
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
        avatar: entrant.avatar,
      })),
      warnings: result.warnings ?? [],
    };
  }
}
