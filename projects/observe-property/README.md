# observe-property

[![npm version](https://badge.fury.io/js/%40ngx-utilities%2Fobserve-property.svg)](https://www.npmjs.com/package/@ngx-utilities/observe-property)

The `ObserveProperty` decorator allows you create a changes observable for any class propery. This
is especially useful for Angular `@Input()` properties.

## Installation

To install this library, run:

`npm install @ngx-utilities/observe-property --save` -or- `yarn add @ngx-utilities/observe-property`

## Usage

```typescript
import { ObserveProperty } from '@ngx-utilities/observe-property';

class Person {
  firstName: string;
  lastName: string;

  @ObserveProperty('firstName') readonly firstNameChanges: Observable<string>;
  @ObserveProperty('lastName') readonly lastNameChanges: Observable<string>;
}
```

## License

MIT © [Kevin Phelps](https://kevinphelps.me)
