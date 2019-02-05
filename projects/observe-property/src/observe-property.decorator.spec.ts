import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { takeToArray } from './../../../src/app/common/helpers/rxjs-operators';
import { ObserveProperty } from './observe-property.decorator';

class Person {
  firstName: string;
  lastName: string;

  @ObserveProperty('firstName') readonly firstNameChanges: Observable<string>;
  @ObserveProperty('lastName') readonly lastNameChanges: Observable<string>;
}

describe('ObserveProperty', () => {
  describe('observed property', () => {
    it('should return undefined when not yet set', () => {
      const person = new Person();

      expect(person.firstName).toBeUndefined();
    });

    it('should allow you to get and set the property', () => {
      const person = new Person();
      person.firstName = 'Rose';

      expect(person.firstName).toBe('Rose');
    });

    it('should allow you to get and set multiple properties', () => {
      const person = new Person();
      person.firstName = 'Alejandra';
      person.lastName = 'Hepfer';

      expect(person.firstName).toBe('Alejandra');
      expect(person.lastName).toBe('Hepfer');
    });
  });

  describe('property changes observable', () => {
    it('should have a setter that returns an observable', async () => {
      const person = new Person();

      expect(person.firstNameChanges instanceof Observable).toBe(true);
      expect(person.lastNameChanges instanceof Observable).toBe(true);
    });

    it('should return the same observable when retrieved multiple times', async () => {
      const person = new Person();

      expect(person.firstNameChanges).toBe(person.firstNameChanges);
      expect(person.lastNameChanges).toBe(person.lastNameChanges);
    });

    it('should return the different observables for different properties', async () => {
      const person = new Person();

      expect(person.firstNameChanges).not.toBe(person.lastNameChanges);
    });

    it('should emit the current value', async () => {
      const person = new Person();
      person.firstName = 'Lulu';

      expect(await person.firstNameChanges.pipe(first()).toPromise()).toBe('Lulu');
    });

    it('should emit property changes', async () => {
      const person = new Person();

      const firstNameChangesPromise = person.firstNameChanges.pipe(first()).toPromise();

      person.firstName = 'Christa';

      expect(await firstNameChangesPromise).toEqual('Christa');
    });

    it('should emit property changes to multiple observers', async () => {
      const person = new Person();

      const firstNameChangesPromise1 = person.firstNameChanges.pipe(first()).toPromise();
      const firstNameChangesPromise2 = person.firstNameChanges.pipe(first()).toPromise();

      person.firstName = 'Christa';

      expect(await firstNameChangesPromise1).toEqual('Christa');
      expect(await firstNameChangesPromise2).toEqual('Christa');
    });

    it('should emit current property value and changes', async () => {
      const person = new Person();
      person.firstName = 'Hugo';

      const firstNameChangesPromise = person.firstNameChanges.pipe(takeToArray(2)).toPromise();

      person.firstName = 'Joseph';

      expect(await firstNameChangesPromise).toEqual(['Hugo', 'Joseph']);
    });

    it('should emit property value changes', async () => {
      const person = new Person();

      const firstNameChangesPromise = person.firstNameChanges.pipe(takeToArray(2)).toPromise();

      person.firstName = 'Juliana';
      person.firstName = 'Reese';

      expect(await firstNameChangesPromise).toEqual(['Juliana', 'Reese']);
    });

    it('should emit current property value and changes for multiple propertes', async () => {
      const person = new Person();
      person.firstName = 'Jena';
      person.lastName = 'Terry';

      const firstNameChangesPromise = person.firstNameChanges.pipe(takeToArray(2)).toPromise();
      const lastNameChangesPromise = person.lastNameChanges.pipe(takeToArray(2)).toPromise();

      person.firstName = 'Glynda';
      person.lastName = 'Hoffman';

      expect(await firstNameChangesPromise).toEqual(['Jena', 'Glynda']);
      expect(await lastNameChangesPromise).toEqual(['Terry', 'Hoffman']);
    });

    it('should not emit the same property value twice', async () => {
      const person = new Person();

      const firstNameChangesPromise = person.firstNameChanges.pipe(takeToArray(2)).toPromise();

      person.firstName = 'Christa';
      person.firstName = 'Christa';
      person.firstName = 'Glynda';

      expect(await firstNameChangesPromise).toEqual(['Christa', 'Glynda']);
    });
  });
});
