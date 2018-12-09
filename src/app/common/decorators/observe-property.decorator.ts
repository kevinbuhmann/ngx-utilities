import { Observable } from 'rxjs';

interface Property {
  hasValue?: boolean;
  currentValue?: any;
  changesObservable?: Observable<any>;
  emitValue?: (value: any) => void;
}

export function ObserveProperty<T>(observedPropertyKey: keyof T) {
  const propertySymbol = Symbol();

  return (target: T, propertyKey: PropertyKey) => {
    Object.defineProperty(target, propertyKey, { get: getChangesObservable });
    Object.defineProperty(target, observedPropertyKey, { get: getValue, set: setValue });
  };

  function getProperty(instance: { [propertySymbol]: Property }) {
    return instance[propertySymbol] || (instance[propertySymbol] = {});
  }

  function getChangesObservable(this: any) {
    const property = getProperty(this);

    if (property.changesObservable === undefined) {
      property.changesObservable = new Observable(observer => {
        if (property.hasValue) {
          observer.next(property.currentValue);
        }

        property.emitValue = value => {
          observer.next(value);
        };

        return () => {
          property.emitValue = undefined;
        };
      });
    }

    return property.changesObservable;
  }

  function getValue(this: any) {
    const property = getProperty(this);

    return property.hasValue ? property.currentValue : undefined;
  }

  function setValue(this: any, value: any) {
    const property = getProperty(this);

    property.hasValue = true;
    property.currentValue = value;

    if (property.emitValue) {
      property.emitValue(value);
    }
  }
}
