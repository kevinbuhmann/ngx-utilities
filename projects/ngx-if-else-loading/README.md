# ngx-if-else-loading

[![npm version](https://badge.fury.io/js/%40ngx-utilities%2Fngx-if-else-loading.svg)](https://www.npmjs.com/package/@ngx-utilities/ngx-if-else-loading)

The `*ngxIfElseLoading` directive is a drop-in replacement for `*ngIf` that shows a loading
animation while the condition is falsy (i.e. while content is loading).

## Installation

To install this library, run:

`npm install @ngx-utilities/ngx-if-else-loading --save` -or- `yarn add @ngx-utilities/ngx-if-else-loading`

and then import and export `NgxIfElseLoadingModule` in your Angular `SharedModule`:

```typescript
// shared.module.ts

import { NgxIfElseLoadingModule } from '@ngx-utilities/ngx-if-else-loading';

@NgModule({
  imports: [
    NgxIfElseLoadingModule
  ],
  exports: [
    NgxIfElseLoadingModule
  ]
})
export class SharedModule { }
```

### With a custom loading spinner

You can provide a custom loading component. It can be anything you want, it just has to accept
a `message` input. If your custom loading component is named `MyLoadingComponent`, the setup will
look like this:

```typescript
// shared.module.ts

@NgModule({
  imports: [
    NgxIfElseLoadingModule.withCustomLoadingComponent(MyLoadingComponent)
  ],
  declarations: [
    MyLoadingComponent
  ],
  entryComponents: [
    MyLoadingComponent
  ]
  exports: [
    NgxIfElseLoadingModule
  ]
})
export class SharedModule { }
```

## Usage

```html
<ng-container *ngxIfElseLoading="items | async; let items">
  ...content
</ng-container>
```

### With a custom message

```html
<ng-container *ngxIfElseLoading="items | async; let items; withMessage 'Loading items...'">
  ...content
</ng-container>
```

## License

MIT © [Kevin Phelps](https://kevinphelps.me)
