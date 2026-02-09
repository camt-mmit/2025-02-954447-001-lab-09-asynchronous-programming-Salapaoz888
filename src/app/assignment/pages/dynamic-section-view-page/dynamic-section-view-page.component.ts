import { Component, inject, resource } from '@angular/core';
import { DynamicSectionDataStorage } from '../../services/dynamic-section-data.storage';
import { DynamicSectionViewComponent } from '../../components/dynamic-section-view/dynamic-section-view.component';

@Component({
  selector: 'app-dynamic-section-view-page',
  standalone: true,
  imports: [DynamicSectionViewComponent],
  template: `
    @if (dataResource.value()) {
      <app-dynamic-section-view [sections]="dataResource.value()!" />
    } @else {
      <p>Loading or No Data...</p>
    }
  `
})
export class DynamicSectionViewPageComponent {
  private readonly storage = inject(DynamicSectionDataStorage);

  readonly dataResource = resource({
    loader: () => this.storage.get(),
  });
}
