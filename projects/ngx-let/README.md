# ngx-let

[![npm version](https://badge.fury.io/js/%40ngx-utilities%2Fngx-let.svg)](https://www.npmjs.com/package/@ngx-utilities/ngx-let)

The `*ngxLet` directive allows you unwrap an observable using `async` without hiding the DOM element
if the observable emits a falsy value. You can do this using `ng-template` and `*ngTemplateOutlet`
by setting the context on the outlet, but the `*ngxLet` directive hides that implementation complexity.

## Installation

To install this library, run:

`npm install @ngx-utilities/ngx-let --save` -or- `yarn add @ngx-utilities/ngx-let`

and then import and export `NgxLetModule` in your Angular `SharedModule`:

```typescript
// shared.module.ts

import { NgxLetModule } from '@ngx-utilities/ngx-let';

@NgModule({
  imports: [
    NgxLetModule
  ],
  exports: [
    NgxLetModule
  ]
})
export class SharedModule { }
```

## Example use-case

Say you are writing your site's layout and you want to show whether the user is logged in or not in
both the header and the footer.

```html
<header>
  ... header content
  You {{ loggedIn | async ? 'are' : 'are not'}} logged in.
  ... more header content
</header>

<main>
  <router-outlet></router-outlet>
</main>

<footer>
  ... footer content
  You {{ loggedIn | async ? 'are' : 'are not'}} logged in.
  ... more footer content
</footer>
```

That seems easy enough. But you are creating two subscriptions to the `loggedIn` observable.
Duplicate subscriptions lead to obscure bugs and possible perfomance issues, so it's better to
subscribe only once. We can subscribe only once using `*ngIf`:

```html
<ng-container *ngIf="loggedIn | async; let loggedIn">
  <header>
    ... header content
    You {{ loggedIn ? 'are' : 'are not'}} logged in.
    ... more header content
  </header>

  <main>
    <router-outlet></router-outlet>
  </main>

  <footer>
    ... footer content
    You {{ loggedIn ? 'are' : 'are not'}} logged in.
    ... more footer content
  </footer>
</ng-container>
```

Uh oh. Now the page is black for users who aren't logged in! Let's fix it using `ng-template`.

```html
<ng-container *ngTemplateOutlet="layoutTemplate; context: { loggedIn: loggedIn | async }">
</ng-container>

<ng-template #layoutTemplate let-loggedIn="loggedIn">
  <header>
    ... header content
    You {{ loggedIn ? 'are' : 'are not'}} logged in.
    ... more header content
  </header>

  <main>
    <router-outlet></router-outlet>
  </main>

  <footer>
    ... footer content
    You {{ loggedIn ? 'are' : 'are not'}} logged in.
    ... more footer content
  </footer>
</ng-template>
```

The `*ngTemplateOutlet` directive is super useful for content projection, but using it for this
particular use-case seems messy. Enter `*ngxLet`:

```html
<ng-container *ngxLet="loggedIn | async; let loggedIn">
  <header>
    ... header content
    You {{ loggedIn ? 'are' : 'are not'}} logged in.
    ... more header content
  </header>

  <main>

  </main>

  <footer>
    ... footer content
    You {{ loggedIn ? 'are' : 'are not'}} logged in.
    ... more footer content
  </footer>
</ng-container>
```

## License

MIT © [Kevin Phelps](https://kevinphelps.me)
