import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DynamicSection } from '../../types';

@Component({
  selector: 'app-dynamic-section-view',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    @for (section of sections(); track $index) {
      <div class="section-container">
        <h3>Section {{ $index + 1 }}</h3>
        <div class="grid-container">
          @for (num of section; track $index) {
            <div class="row">
             Number {{ $index + 1 }}
              <span>{{ num | number }}</span>
            </div>
          }
          <div class="row result">
            Result
            <strong>{{ sum(section) | number }}</strong>
          </div>
        </div>
      </div>
    } @empty {
      <p>No data</p>
    }
  `,
  styles: [`
    .section-container { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
    .grid-container { display: grid; gap: 5px; }
    .row { display: flex; justify-content: space-between; width: 200px; }
    .result { border-top: 1px solid #000; padding-top: 5px; margin-top: 5px; }
  `]
})
export class DynamicSectionViewComponent {
  readonly sections = input.required<DynamicSection>();

  sum(numbers: readonly number[]): number {
    return numbers.reduce((a, b) => a + b, 0);
  }
}
