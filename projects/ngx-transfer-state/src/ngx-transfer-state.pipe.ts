import { isPlatformServer } from '@angular/common';
import { Inject, Pipe, PipeTransform, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';

@Pipe({
  name: 'ngxTransferState'
})
export class NgxTransferStatePipe implements PipeTransform {
  constructor(@Inject(PLATFORM_ID) private readonly platformId: string, private readonly transferState: TransferState) {}

  transform<T>(source: Observable<T>, key: string) {
    const stateKey = makeStateKey(key);

    if (isPlatformServer(this.platformId)) {
      return source.pipe(
        tap(value => {
          this.transferState.onSerialize(stateKey, () => value);
        })
      );
    } else {
      return source.pipe(startWith(this.transferState.get(stateKey, null)));
    }
  }
}
