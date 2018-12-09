import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from './../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TransferStateService {
  constructor(private readonly transferState: TransferState) {}

  transfer<T>(key: string, source: Observable<T>) {
    const stateKey = makeStateKey<T>(key);

    let result: Observable<T>;

    if (this.transferState.hasKey(stateKey)) {
      const value = this.transferState.get<T>(stateKey, undefined);
      this.transferState.remove(stateKey);

      result = of(value);
    } else {
      result = source.pipe(
        tap(value => {
          if (environment.node) {
            this.transferState.onSerialize(stateKey, () => value);
          }
        })
      );
    }

    return result;
  }
}
