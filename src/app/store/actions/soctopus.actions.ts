import { Action } from '@ngrx/store';

import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { SoctopusChangeTabParams } from 'src/app/models/soctopus.models';

export class SetCurrentTab implements Action {
  readonly type = SoctopusActionTypes.CHANGE_TAB;
  constructor(public payload: SoctopusChangeTabParams){
  }
}


export type All =
  | SetCurrentTab;
