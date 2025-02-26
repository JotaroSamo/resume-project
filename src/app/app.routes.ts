import { Routes } from '@angular/router';
import { ResumeComponent } from './component/resume/resume.component';
import { GameComponent } from './component/game/game.component';

export const routes: Routes = [
    { path: 'resume', component: ResumeComponent },
    { path: 'game', component: GameComponent  },
    { path: '', redirectTo: '/resume', pathMatch: 'full' }
]
