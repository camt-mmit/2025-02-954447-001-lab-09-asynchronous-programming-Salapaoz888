import { Component, input, signal, effect } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form,FormField } from '@angular/forms/signals';
import { DynamicSection } from '../../types';

@Component({
  selector: 'app-dynamic-section-form',
  standalone: true,
  imports: [FormField, DecimalPipe],
  templateUrl: './dynamic-section-form.html',
  styleUrl: './dynamic-section-form.scss'
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
