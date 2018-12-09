import { Observable } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

export function takeToArray(count: number) {
  return <T>(source: Observable<T>) =>
    source.pipe(
      take(count),
      toArray()
    );
}
