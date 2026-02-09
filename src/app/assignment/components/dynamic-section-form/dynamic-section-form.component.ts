import { Component, input, signal, effect } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form,FormField } from '@angular/forms/signals';
import { DynamicSection } from '../../types';

@Component({
  selector: 'app-dynamic-section-form',
  standalone: true,
  imports: [FormField, DecimalPipe],
  template: `
    <button (click)="addSection()">+ Section</button>

    @for (section of model(); track i; let i = $index) {
      <div class="section-box">
        <div class="section-header">
          <button (click)="addNumber(i)">+ Number</button>
          <span>Section {{ i + 1 }}</span>

          <button
            (click)="removeSection(i)"
            class="btn-danger"
            [disabled]="model().length <= 1"
          >
            Delete Section
          </button>
        </div>

        @for (num of section; track j; let j = $index) {
          <div class="input-row">
            <label>Number {{ j + 1 }}</label>

            @if (getControl(i, j); as control) {
               <input
                type="number"
                [formField]="control"
              />
            }

            <button
              (click)="removeNumber(i, j)"
              [disabled]="section.length <= 1"
            >
              x
            </button>
          </div>
        }

        <div class="result-row">
          Result
          <strong>{{ sum(section) | number }}</strong>
        </div>
      </div>
    }
  `,
  styles: [`
    .section-box { border: 1px solid #999; padding: 10px; margin: 10px 0; }
    .section-header { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; }
    .input-row { margin-bottom: 5px; }
    .btn-danger { background-color: red; color: white; }
    button:disabled { background-color: #ccc; cursor: not-allowed; color: #666; border-color: #999; }
    .result-row { margin-top: 10px; border-top: 1px solid #ccc; padding-top: 5px; }
  `]
})
export class DynamicSectionFormComponent {
  readonly data = input<DynamicSection>([]);
  readonly model = signal<number[][]>([]);


  protected readonly sectionForm = form(this.model);

  constructor() {
    effect(() => {
      const initData = this.data();
      if (!initData || initData.length === 0) {
        this.model.set([[0]]);
      } else {
        this.model.set(initData.map(sec => sec.length > 0 ? [...sec] : [0]));
      }
    });
  }


  getControl(i: number, j: number): any {
    return (this.sectionForm as any)?.[i]?.[j];
  }

  addSection() {
    this.model.update(sections => [...sections, [0]]);
  }

  removeSection(index: number) {
    this.model.update(sections => {
      if (sections.length <= 1) return sections;
      return sections.filter((_, i) => i !== index);
    });
  }

  addNumber(sectionIndex: number) {
    this.model.update(sections =>
      sections.map((sec, i) => i === sectionIndex ? [...sec, 0] : sec)
    );
  }

  removeNumber(sectionIndex: number, numberIndex: number) {
    this.model.update(sections =>
      sections.map((sec, i) => {
        if (i !== sectionIndex) return sec;
        if (sec.length <= 1) return sec;
        return sec.filter((_, j) => j !== numberIndex);
      })
    );
  }

  sum(numbers: number[]): number {
    return numbers.reduce((a, b) => {
      const val = Number(b);
      return a + (isNaN(val) ? 0 : val);
    }, 0);
  }
}
