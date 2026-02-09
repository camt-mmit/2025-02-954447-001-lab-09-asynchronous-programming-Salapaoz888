import { Component, input, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { DynamicSection } from '../../types';

@Component({
  selector: 'app-dynamic-section-form',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
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
            Number {{ j + 1 }}
            <input
              type="number"
              [ngModel]="num"
              (ngModelChange)="updateNumber(i, j, $event)"
            />

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

    /* สไตล์สำหรับปุ่มที่ถูก Disable */
    button:disabled { background-color: #ccc; cursor: not-allowed; color: #666; border-color: #999; }

    .result-row { margin-top: 10px; border-top: 1px solid #ccc; padding-top: 5px; }
  `]
})
export class DynamicSectionFormComponent {
  readonly data = input<DynamicSection>([]);
  readonly model = signal<number[][]>([]);

  constructor() {
    effect(() => {
      const initData = this.data();
      // ถ้าไม่มีข้อมูล ให้เริ่มด้วย [[0]] (1 Section, 1 Number)
      if (!initData || initData.length === 0) {
        this.model.set([[0]]);
      } else {
        // Map ข้อมูล โดยถ้า Section ไหนว่างเปล่า ให้เติม [0] เข้าไป
        this.model.set(initData.map(sec => sec.length > 0 ? [...sec] : [0]));
      }
    });
  }

  addSection() {
    // จุดที่แก้: เพิ่ม Section ใหม่พร้อมตัวเลขเริ่มต้น 1 ตัว [0]
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

        // จุดที่แก้: ห้ามลบถ้าเหลือตัวเลขเดียว
        if (sec.length <= 1) return sec;

        return sec.filter((_, j) => j !== numberIndex);
      })
    );
  }

  updateNumber(sectionIndex: number, numberIndex: number, value: '') {
    const numericValue = value === '' || value === null ? 0 : Number(value);
    this.model.update(sections =>
      sections.map((sec, i) =>
        i === sectionIndex
          ? sec.map((n, j) => j === numberIndex ? numericValue : n)
          : sec
      )
    );
  }

  sum(numbers: number[]): number {
    return numbers.reduce((a, b) => {
      const val = Number(b);
      return a + (isNaN(val) ? 0 : val);
    }, 0);
  }
}
