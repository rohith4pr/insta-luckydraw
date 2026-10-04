import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Entrant, EntrantsService } from './entrants.service';

// Set to null to use a random winner. A fixed winner is labeled in the UI.
// const WINNER_OVERRIDE_USERNAME: string | null = 'fixed.winner';
const WINNER_OVERRIDE_USERNAME: string | null = null;

@Component({
  imports: [RouterLink],
  selector: 'app-draw-page',
  templateUrl: './draw-page.html',
})
export class DrawPage {
  private readonly entrantStore = inject(EntrantsService);
  protected readonly entrants = this.entrantStore.entrants;
  protected readonly warnings = this.entrantStore.warnings;
  protected readonly winnerOverrideUsername = WINNER_OVERRIDE_USERNAME;
  protected readonly currentIndex = signal<number | null>(null);
  protected readonly currentEntrant = computed(() => {
    const index = this.currentIndex();
    return index === null ? null : this.entrants()[index] ?? null;
  });
  protected readonly winner = signal<Entrant | null>(null);
  protected readonly isSpinning = signal(false);

  protected pickWinner(): void {
    const entrants = this.entrants();
    if (this.isSpinning() || entrants.length === 0) return;

    this.isSpinning.set(true);
    this.winner.set(null);
    const startIndex = ((this.currentIndex() ?? 0) + 1) % entrants.length;
    this.currentIndex.set(startIndex);
    const configuredWinnerIndex = WINNER_OVERRIDE_USERNAME
      ? entrants.findIndex(
          (entrant) => entrant.username.replace(/^@/, '').toLowerCase() === WINNER_OVERRIDE_USERNAME.replace(/^@/, '').toLowerCase(),
        )
      : -1;
    const winnerIndex = configuredWinnerIndex >= 0
      ? configuredWinnerIndex
      : Math.floor(Math.random() * entrants.length);
    const stepsToWinner = (winnerIndex - startIndex + entrants.length) % entrants.length;
    const totalSteps = entrants.length * 3 + stepsToWinner;
    const spinDuration = 5000;
    const startTime = performance.now();

    const animate = (timestamp: number): void => {
      const progress = Math.min((timestamp - startTime) / spinDuration, 1);
      const easedProgress = progress + 0.08 * Math.sin(Math.PI * progress);
      const traversedSteps = Math.max(1, Math.floor(easedProgress * totalSteps));
      const nextIndex = (startIndex + traversedSteps) % entrants.length;
      if (this.currentIndex() !== nextIndex) this.currentIndex.set(nextIndex);

      if (progress < 1) {
        window.requestAnimationFrame(animate);
        return;
      }

      this.currentIndex.set(winnerIndex);
      this.winner.set(entrants[winnerIndex]);
      this.isSpinning.set(false);
    };

    window.requestAnimationFrame(animate);
  }
}
