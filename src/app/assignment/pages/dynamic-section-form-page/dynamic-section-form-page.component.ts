import { Component, inject, resource, effect, viewChild } from '@angular/core';
import { DynamicSectionDataStorage } from '../../services/dynamic-section-data.storage';
import { DynamicSectionFormComponent } from '../../components/dynamic-section-form/dynamic-section-form.component';

@Component({
  selector: 'app-dynamic-section-form-page',
  standalone: true,
  imports: [DynamicSectionFormComponent],
  template: `
    <h3>Form Page </h3>

    <app-dynamic-section-form
      [data]="dataResource.value() ?? []"
    />

    
  `
})
export class DynamicSectionFormPageComponent {
  private readonly storage = inject(DynamicSectionDataStorage);

  // อ้างอิงถึง Component ลูก
  readonly formComponent = viewChild(DynamicSectionFormComponent);

  readonly dataResource = resource({
    loader: () => this.storage.get(),
  });

  constructor() {
    // สร้าง Effect เพื่อทำ Auto-save
    effect(() => {
      // ดึงข้อมูลปัจจุบันจาก Model ของลูก
      // effect นี้จะทำงานทุกครั้งที่ signal 'model' ในลูกมีการเปลี่ยนแปลง
      const currentData = this.formComponent()?.model();

      if (currentData) {
        // บันทึกข้อมูลลง Storage ทันที
        this.storage.set(currentData);
        // หมายเหตุ: การใช้ console.log ช่วยเช็กว่าบันทึกจริงไหม
        console.log('Auto-saved:', currentData);
      }
    });
  }
}
