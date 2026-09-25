import { Routes } from '@angular/router';
import { DrawPage } from './draw-page';
import { ImportPage } from './import-page';

export const routes: Routes = [
	{ path: '', component: DrawPage },
	{ path: 'import', component: ImportPage },
	{ path: '**', redirectTo: '' },
];
