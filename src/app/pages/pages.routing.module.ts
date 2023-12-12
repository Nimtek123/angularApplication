import { Routes } from '@angular/router';
import { AppDashboardComponent } from './dashboard/dashboard.component';
import { AppVideoplayerComponent } from './videoplayer/videoplayer.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: AppDashboardComponent,
    data: {
      title: 'Starter Page',
    },
  },
  {
    path: 'videoplayer',
    component: AppVideoplayerComponent,
    data: {
      title: 'Video Player Page',
    },
  },
];
