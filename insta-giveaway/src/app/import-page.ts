import { Component, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { EntrantsService } from './entrants.service';
import { ImportApiService } from './import-api.service';

@Component({
  imports: [RouterLink],
  selector: 'app-import-page',
  templateUrl: './import-page.html',
})
export class ImportPage {
  protected readonly selectedFile = signal<File | null>(null);
  protected readonly isDragging = signal(false);
  protected readonly isUploading = signal(false);
  protected readonly errorMessage = signal('');

  constructor(
    private readonly importApi: ImportApiService,
    private readonly entrantStore: EntrantsService,
    private readonly router: Router,
  ) {}

  protected chooseFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.setFile(input.files?.[0] ?? null);
    input.value = '';
  }

  protected dropFile(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    this.setFile(event.dataTransfer?.files[0] ?? null);
  }

  protected setDragging(value: boolean): void {
    this.isDragging.set(value);
  }

  protected async upload(): Promise<void> {
    const file = this.selectedFile();
    if (!file || this.isUploading()) return;

    this.isUploading.set(true);
    this.errorMessage.set('');

    try {
      const result = await this.importApi.upload(file);
      this.entrantStore.replace(result.entrants, result.warnings);
      await this.router.navigateByUrl('/');
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'The file could not be imported.');
    } finally {
      this.isUploading.set(false);
    }
  }

  private setFile(file: File | null): void {
    this.errorMessage.set('');
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx'].includes(extension ?? '')) {
      this.selectedFile.set(null);
      this.errorMessage.set('Choose a .csv or .xlsx file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.selectedFile.set(null);
      this.errorMessage.set('The file must be smaller than 10 MB.');
      return;
    }

    this.selectedFile.set(file);
  }
}
