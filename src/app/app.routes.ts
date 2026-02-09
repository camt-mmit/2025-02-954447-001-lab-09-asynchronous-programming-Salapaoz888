import { Routes } from '@angular/router';
import { AssignmentRootComponent } from './assignment/pages/assignment-root/assignment-root.component';
import { DynamicSectionViewPageComponent } from './assignment/pages/dynamic-section-view-page/dynamic-section-view-page.component';
import { DynamicSectionFormPageComponent } from './assignment/pages/dynamic-section-form-page/dynamic-section-form-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },



  { path: 'profile', loadChildren: () => import('./profile/routes') },
{
    path: 'assignment',
    component: AssignmentRootComponent,
    children: [
      // ถ้าเข้ามาที่ /assignment เฉยๆ ให้เด้งไปหน้า view
      { path: '', redirectTo: 'view', pathMatch: 'full' },

      // เส้นทางสำหรับหน้าแสดงผล (localhost:4200/assignment/view)
      { path: 'view', component: DynamicSectionViewPageComponent },

      // เส้นทางสำหรับหน้าฟอร์ม (localhost:4200/assignment/form)
      { path: 'form', component: DynamicSectionFormPageComponent },
    ],
  },
  { path: '', redirectTo: 'assignment', pathMatch: 'full' }
];
