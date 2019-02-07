import { Observable, ReplaySubject } from 'rxjs';

interface Property {
  hasValue?: boolean;
  currentValue?: any;
  changesObservable?: Observable<any>;
  changesSubject?: ReplaySubject<any>;
}

export function ObserveProperty<T>(observedPropertyKey: keyof T) {
  const propertySymbol = Symbol();

  return (target: T, propertyKey: PropertyKey) => {
    Object.defineProperty(target, propertyKey, { get: getChangesObservable });
    Object.defineProperty(target, observedPropertyKey, { get: getValue, set: setValue });
  };

  function getProperty(instance: { [propertySymbol]: Property }) {
    const property = instance[propertySymbol] || (instance[propertySymbol] = {});

    if (property.hasValue === undefined) {
      property.hasValue = false;
    }

    if (property.changesSubject === undefined) {
      property.changesSubject = new ReplaySubject();
      property.changesObservable = property.changesSubject.asObservable();
    }

    return property;
  }

  function getChangesObservable(this: any) {
    return getProperty(this).changesObservable;
  }

  function getValue(this: any) {
    return getProperty(this).currentValue;
  }

  function setValue(this: any, value: any) {
    const property = getProperty(this);
    const oldValue = property.currentValue;
    const firstChange = !property.hasValue;

    property.hasValue = true;
    property.currentValue = value;

    if (firstChange || value !== oldValue) {
      property.changesSubject.next(value);
    }
  }
}
