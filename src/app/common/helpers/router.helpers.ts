import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { merge, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export function getMergedRouteParams(router: Router) {
  return mapRouterStateSnapshots(router, getMergedRouteParamsSnapshot);
}

export function getMergedRouteParamsSnapshot(snapshot: ActivatedRouteSnapshot | RouterStateSnapshot) {
  let params: { [key: string]: any } = {};
  let route = snapshot.root;
  do {
    params = { ...params, ...route.params };
    route = route.firstChild;
  } while (route);

  return params;
}

export function getMergedRouteData(router: Router) {
  return mapRouterStateSnapshots(router, getMergedRouteDataSnapshot);
}

export function getMergedRouteDataSnapshot(snapshot: ActivatedRouteSnapshot | RouterStateSnapshot) {
  let data: { [key: string]: any } = {};
  let route = snapshot.root;
  do {
    data = { ...data, ...route.data };
    route = route.firstChild;
  } while (route);

  return data;
}

export function mapRouterStateSnapshots<T>(router: Router, selector: (snapshot: RouterStateSnapshot) => T) {
  const currentRoute = of(router.routerState.snapshot);

  const futureRoutes = router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => router.routerState.snapshot)
  );

  return merge(currentRoute, futureRoutes).pipe(map(snapshot => selector(snapshot)));
}
