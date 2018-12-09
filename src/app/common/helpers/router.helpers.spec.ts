import { NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';

import { getMergedRouteData, getMergedRouteDataSnapshot, getMergedRouteParams, getMergedRouteParamsSnapshot } from './router.helpers';
import { takeToArray } from './rxjs-operators';

describe('router helpers', () => {
  describe('getMergedRouteParamsSnapshot', () => {
    it('should merge params from nested routes', () => {
      const snapshot = {
        root: {
          params: { id: 5 },
          firstChild: {
            params: { name: 'toy' }
          }
        }
      };

      expect(getMergedRouteParamsSnapshot(snapshot as any)).toEqual({ id: 5, name: 'toy' });
    });

    it('should override properties with values from nested routes', () => {
      const snapshot = {
        root: {
          params: { id: 5 },
          firstChild: {
            params: { id: 15 }
          }
        }
      };

      expect(getMergedRouteParamsSnapshot(snapshot as any)).toEqual({ id: 15 });
    });
  });

  describe('getMergedRouteDataSnapshot', () => {
    it('should merge data from nested routes', () => {
      const snapshot = {
        root: {
          data: { itemPage: true },
          firstChild: {
            data: { showChat: true }
          }
        }
      };

      expect(getMergedRouteDataSnapshot(snapshot as any)).toEqual({ itemPage: true, showChat: true });
    });

    it('should override properties with values from nested routes', () => {
      const snapshot = {
        root: {
          data: {
            showChat: false
          },
          firstChild: {
            data: {
              showChat: true
            }
          }
        }
      };

      expect(getMergedRouteDataSnapshot(snapshot as any)).toEqual({ showChat: true });
    });
  });

  describe('getMergedRouteParams', () => {
    it('should emit the current route params and changes', async () => {
      const snapshot1 = {
        root: {
          params: { id: 5 },
          firstChild: {
            params: { name: 'toy' }
          }
        }
      };

      const snapshot2 = {
        root: {
          params: { id: 6 },
          firstChild: {
            params: { name: 'tool' }
          }
        }
      };

      const mockRouter = {
        routerState: { snapshot: snapshot1 },
        events: new Observable<NavigationEnd>(observer => {
          mockRouter.routerState.snapshot = snapshot2;
          observer.next(new NavigationEnd(1, '', ''));
        })
      };

      const routeParamsStream = await getMergedRouteParams(mockRouter as any)
        .pipe(takeToArray(2))
        .toPromise();

      expect(routeParamsStream).toEqual([{ id: 5, name: 'toy' }, { id: 6, name: 'tool' }]);
    });
  });

  describe('getMergedRouteData', () => {
    it('should emit the current route data and changes', async () => {
      const snapshot1 = {
        root: {
          data: { itemPage: true },
          firstChild: {
            data: { showChat: false }
          }
        }
      };

      const snapshot2 = {
        root: {
          data: { itemPage: false },
          firstChild: {
            data: { showChat: true }
          }
        }
      };

      const mockRouter = {
        routerState: { snapshot: snapshot1 },
        events: new Observable<NavigationEnd>(observer => {
          mockRouter.routerState.snapshot = snapshot2;
          observer.next(new NavigationEnd(1, '', ''));
        })
      };

      const routeParamsStream = await getMergedRouteData(mockRouter as any)
        .pipe(takeToArray(2))
        .toPromise();

      expect(routeParamsStream).toEqual([{ itemPage: true, showChat: false }, { itemPage: false, showChat: true }]);
    });
  });
});
