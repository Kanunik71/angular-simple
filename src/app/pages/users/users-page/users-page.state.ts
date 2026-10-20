import { Injectable, inject } from '@angular/core';

import { ComponentState } from '../../../core/state/component.state';
import { UsersState } from '../users.state';

@Injectable()
export class UsersPageState {
  private readonly users = inject(UsersState);

  readonly state = new ComponentState();

  constructor() {
    this.state.add(this.users.listLoad);
  }
}
