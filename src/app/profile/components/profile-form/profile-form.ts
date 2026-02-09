import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormField, createMetadataKey, form, metadata } from '@angular/forms/signals';
import { createFriend } from '../../helpers';
import { Profile } from '../../types';

@Component({
  selector: 'app-profile-form',
  imports: [FormField, DecimalPipe],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileForm {
  readonly data = model.required<Profile>();

  protected readonly friendsCountKey = createMetadataKey<number>();

  protected readonly form = form(this.data, (path) => {
    metadata(path.friends, this.friendsCountKey, ({ value }) => value().length);
  });

  protected addFriend(): void {
    this.form.friends().value.update((items) => [...items, createFriend()]);
  }

  protected removeFriend(index: number): void {
    this.form.friends().value.update((items) => items.filter((_item, i) => i !== index));
  }

  protected moveFriend(index: number, offset: number): void {
    this.form
      .friends()
      .value.update((items) =>
        items.map((item, i) =>
          i === index ? items[index + offset] : i === index + offset ? items[index] : item,
        ),
      );
  }
}
