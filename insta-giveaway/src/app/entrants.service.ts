import { Injectable, signal } from '@angular/core';

export interface Entrant {
  username: string;
  avatar: string;
  color: string;
}

@Injectable({ providedIn: 'root' })
export class EntrantsService {
  readonly entrants = signal<Entrant[]>([]);
  readonly warnings = signal<string[]>([]);

  replace(entrants: Entrant[], warnings: string[] = []): void {
    this.entrants.set(entrants);
    this.warnings.set(warnings);
  }
}
