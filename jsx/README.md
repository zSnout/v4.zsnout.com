A custom JSX implementation designed for zSnout.

- [Basic Usage](#basic-usage)
  - [Creating JSX Components](#creating-jsx-components)
- [JavaScript API](#javascript-api)
  - [jsx(component: string, props: object, ...children: any[]): zQuery&lt;HTMLElement>](#jsxcomponent-string-props-object-children-any-zqueryhtmlelement)
  - [jsx(component: (props: object) => zQuery, props: object, ...children: any[]): zQuery&lt;HTMLElement>](#jsxcomponent-props-object--zquery-props-object-children-any-zqueryhtmlelement)
  - [$(selector: string): zQuery&lt;HTMLElement>](#selector-string-zqueryhtmlelement)
  - [$(query: zQuery&lt;T>): zQuery&lt;T>](#query-zqueryt-zqueryt)
  - [$&lt;T extends HTMLElement>(...els: T[]): zQuery&lt;T>](#t-extends-htmlelementels-t-zqueryt)
  - [zQuery&lt;T extends HTMLElement>](#zqueryt-extends-htmlelement)
    - [zQuery.each(callback: (el: T) => void): this](#zqueryeachcallback-el-t--void-this)
    - [zQuery.text(): string](#zquerytext-string)
    - [zQuery.text(content: string): this](#zquerytextcontent-string-this)
    - [zQuery.html(): string](#zqueryhtml-string)
    - [zQuery.html(content: string): this](#zqueryhtmlcontent-string-this)
    - [zQuery.render(): this](#zqueryrender-this)
    - [zQuery.elements(): T[]](#zqueryelements-t)
    - [zQuery.empty(): this](#zqueryempty-this)
    - [zQuery.append(...els: (HTMLElement | zQuery&lt;HTMLElement>)[]): this](#zqueryappendels-htmlelement--zqueryhtmlelement-this)
    - [zQuery.appendTo(item: zQuery&lt;HTMLElement> | HTMLElement | string): this](#zqueryappendtoitem-zqueryhtmlelement--htmlelement--string-this)
    - [zQuery.on(event: string, callback: (event: Event) => void, options?: AddEventListenerOptions): this](#zqueryonevent-string-callback-event-event--void-options-addeventlisteneroptions-this)
    - [zQuery.once(event: string, callback: (event: Event) => void, options?: AddEventListenerOptions): this](#zqueryonceevent-string-callback-event-event--void-options-addeventlisteneroptions-this)
    - [zQuery.off(event: string, callback: (event: Event) => void, options?: EventListenerOptions): this](#zqueryoffevent-string-callback-event-event--void-options-eventlisteneroptions-this)
    - [zQuery.parents(): zQuery&lt;HTMLElement>](#zqueryparents-zqueryhtmlelement)
    - [zQuery.parent(): zQuery&lt;HTMLElement>](#zqueryparent-zqueryhtmlelement)
    - [zQuery.where(selector: string): zQuery&lt;T>](#zquerywhereselector-string-zqueryt)
    - [zQuery.is(selector: string): boolean](#zqueryisselector-string-boolean)
    - [zQuery.className(): string](#zqueryclassname-string)
    - [zQuery.className(className: string): this](#zqueryclassnameclassname-string-this)
    - [zQuery.hasClass(className: string): boolean](#zqueryhasclassclassname-string-boolean)
    - [zQuery.addClass(className: string): this](#zqueryaddclassclassname-string-this)
    - [zQuery.removeClass(className: string): this](#zqueryremoveclassclassname-string-this)
    - [zQuery.hide(): this](#zqueryhide-this)
    - [zQuery.show(): this](#zqueryshow-this)
- [TypeScript API](#typescript-api)
  - [type JSX&lt;T extends keyof HTMLElements> = zQuery&lt;HTMLElements[T]>](#type-jsxt-extends-keyof-htmlelements--zqueryhtmlelementst)
  - [type JSX&lt;T extends HTMLElement> = zQuery&lt;T>](#type-jsxt-extends-htmlelement--zqueryt)
  - [type JSX&lt;T extends (props: any) => zQuery&lt;HTMLElement>> = T extends zQuery&lt;infer U> ? U : never](#type-jsxt-extends-props-any--zqueryhtmlelement--t-extends-zqueryinfer-u--u--never)
  - [namespace JSX](#namespace-jsx)
    - [type JSX.Element = zQuery&lt;globalThis.Element>](#type-jsxelement--zqueryglobalthiselement)
    - [type Boolish = boolean | "true" | "false"](#type-boolish--boolean--true--false)
    - [type CSSStyles = Omit&lt;CSSStyleDeclaration, "parentRule" | "length">](#type-cssstyles--omitcssstyledeclaration-parentrule--length)
    - [interface BaseAttributes](#interface-baseattributes)
    - [interface ElementAttributes](#interface-elementattributes)
    - [interface Attributes extends BaseAttributes](#interface-attributes-extends-baseattributes)
    - [type ElementChildrenAttribute = { children: {} }](#type-elementchildrenattribute---children--)
    - [type IntrinsicElements = JSX.BaseAttributes](#type-intrinsicelements--jsxbaseattributes)

# Basic Usage

This module includes a single client file `assets/jsx.ts` that adds `jsx` and `$` functions to the global scope, the former being the JSX implementation. It also adds a hidden class, `zQuery`, that is a custom implementation of jQuery designed for zSnout.

To use it, simply import it in your `index.ts` file using `import "@zsnout/jsx";`.

## Creating JSX Components

To write a simple JSX component, create a function beginning with a capital letter that returns a JSX element.
Note that internally, all JSX components are zQueries, so you must use those methods to manipulate the element.

```tsx
function HelloWorld() {
  return <div>Hello world!</div>;
}

function HelloWorld() {
  let div = <div />;

  div.text("Hello world!");
}

let component = <HelloWorld />;
```

Props are passed to the function in the first argument.
You may specify required and optional props.

```tsx
function HelloPerson({ name }: { name: string }) {
  return <div>Hello {name}!</div>;
}

let component = <HelloPerson name="John" />;
```

Children are passed to the function as a prop named `children`.
When no children are passed, this prop is undefined.
When one child is passed, this prop will be the value of that child.
If multiple children are passed, this prop will be an array of those children.

```tsx
function HelloPerson({ children }: { children: string }) {
  return <div>Hello {children}!</div>;
}

let component = <HelloPerson>Sheila</HelloPerson>;
let component2 = <HelloPerson children="Alberto" />;
```

# JavaScript API

## jsx(component: string, props: object, ...children: any[]): zQuery&lt;HTMLElement>

_More accurate type definitions are available in the definition files._

Creates a new HTML element and returns it as a zQuery.
Returns a zQuery containing the created JSX element.

- `component: string` - The HTML tag to create.
- `props: object` - Properties to add to the HTML tag.
- `children: any[]` - Children to append to the created tag.

## jsx(component: (props: object) => zQuery, props: object, ...children: any[]): zQuery&lt;HTMLElement>

_More accurate type definitions are available in the definition files._

Creates a new JSX component and returns it.
Returns a zQuery containing the created JSX element.

- `component: string` - The component to use.
- `props: object` - The props to pass to the component.
- `children: any[]` - The children to pass to the component.

## $(selector: string): zQuery&lt;HTMLElement>

_More accurate type definitions are available in the definition files._

Selects elements matching a CSS selector from the DOM.
Returns a zQuery containing elements matching the selector.

- `selector: string` - The CSS selector to use.

## $(query: zQuery&lt;T>): zQuery&lt;T>

_More accurate type definitions are available in the definition files._

Returns the given zQuery.

- `query: zQuery` - The zQuery to return.

## $&lt;T extends HTMLElement>(...els: T[]): zQuery&lt;T>

Creates a zQuery of the given elements.
Returns a zQuery containing the given elements.

- `els: T[]` - The elements to use.

## zQuery&lt;T extends HTMLElement>

A class used for DOM manipulation.

### zQuery.each(callback: (el: T) => void): this

Calls a function on each element in this zQuery.
Returns the current zQuery, to allow for chaining.

- `callback: (el: T) => void` - The function to call on each element.

### zQuery.text(): string

Gets the text content of the first element in this zQuery.

### zQuery.text(content: string): this

Sets the text content of all elements in this zQuery.
Returns the current zQuery, to allow for chaining.

- `content: string` - The text to fill elements with.

### zQuery.html(): string

Gets the inner HTML of the first element in this zQuery.

### zQuery.html(content: string): this

Sets the inner HTML of all elements in this zQuery.
Returns the current zQuery, to allow for chaining.

- `content: string` - The HTML content to fill elements with.

### zQuery.render(): this

Moves all elements in a zQuery into another element.
Returns the zQuery that elements were moved into.

- `query: zQuery<K>` - The zQuery to move the elements to.

### zQuery.elements(): T[]

Gets the elements of this zQuery.
Returns an array containing the elements of this zQuery.

### zQuery.empty(): this

Empties all elements in this zQuery.
Returns the current zQuery, to allow for chaining.

### zQuery.append(...els: (HTMLElement | zQuery&lt;HTMLElement>)[]): this

Appends elements to the first item in this zQuery.
Returns the current zQuery, to allow for chaining.

- `els: (HTMLElement | zQuery<HTMLElement>)[]` - The elements to append.

### zQuery.appendTo(item: zQuery&lt;HTMLElement> | HTMLElement | string): this

Appends items in this zQuery to another element.
Returns the current zQuery, to allow for chaining.

- `item: zQuery<HTMLElement> | HTMLElement | string` - The item to append to. Can be a selector, zQuery, or HTMLElement.

### zQuery.on(event: string, callback: (event: Event) => void, options?: AddEventListenerOptions): this

_More accurate type definitions are available in the definition files._

Adds an event listener to this zQuery.
Returns the current zQuery, to allow for chaining.

- `event: string` - The event to listen for.
- `callback: (event: Event) => void` - A callback that will be called when the event is triggered.
- `options?: AddEventListenerOptions` - Options to add to the event listener.

### zQuery.once(event: string, callback: (event: Event) => void, options?: AddEventListenerOptions): this

_More accurate type definitions are available in the definition files._

Adds a one-time event listener to this zQuery.
Returns the current zQuery, to allow for chaining.

- `event: string` - The event to listen for.
- `callback: (event: Event) => void` - A callback that will be called when the event is triggered.
- `options?: AddEventListenerOptions` - Options to add to the event listener.

### zQuery.off(event: string, callback: (event: Event) => void, options?: EventListenerOptions): this

Remove an event listener from this zQuery.
Returns the current zQuery, to allow for chaining.

- `event: string` - The event that was listened to.
- `callback: (event: Event) => void` - The callback attatched to the event listener.
- `options: EventListenerOptions` - Options to pass to the event listener.

### zQuery.parents(): zQuery&lt;HTMLElement>

Gets the parents of the first element in this zQuery.
Returns a zQuery containing the parents of the first element in the current zQuery.

### zQuery.parent(): zQuery&lt;HTMLElement>

Gets the parent of the first element in this zQuery.
Returns a zQuery containing the parent of the first element in the current zQuery.

### zQuery.where(selector: string): zQuery&lt;T>

_More accurate type definitions are available in the definition files._

Filters elements in this zQuery by a CSS selector.
Returns a zQuery containing elements matching the CSS selector.

- `selector: string` - The CSS selector to filter by.

### zQuery.is(selector: string): boolean

_More accurate type definitions are available in the definition files._

Checks if every element in this zQuery matches a selector.
Returns a boolean indicating whether all of the elements in this zQuery match the selector.

- `selector: string` - The CSS selector to match.

### zQuery.className(): string

Gets the classes on the first element in a zQuery.
Returns the class name of the first element in this zQuery.

### zQuery.className(className: string): this

Sets the class name of each element in this zQuery.
Returns the current zQuery, to allow for chaining.

- `className: string` - The class name to set each element to.

### zQuery.hasClass(className: string): boolean

Checks if every element in this zQuery has a class.
Returns a boolean indicating whether the class is present.

- `className: string` - The name of the class to check for.

### zQuery.addClass(className: string): this

Adds a class to each element in this zQuery.
Returns the current zQuery, to allow for chaining.

- `className: string` - The name of the class to add.

### zQuery.removeClass(className: string): this

Removes a class from each element in this zQuery.
Returns the current zQuery, to allow for chaining.

- `className: string` - The name of the class to remove.

### zQuery.hide(): this

Hides each element in this zQuery.
Returns the current zQuery, to allow for chaining.

### zQuery.show(): this

Shows each element in this zQuery.
Returns the current zQuery, to allow for chaining.

# TypeScript API

## type JSX&lt;T extends keyof HTMLElements> = zQuery&lt;HTMLElements[T]>

_More accurate type definitions are available in the definition files._
_In reality, this type alias uses complex `extends` clauses, not overloads._

Gets the result of creating a JSX element using a specific tag.

- `T: keyof HTMLElements` - The name of the tag to use.

## type JSX&lt;T extends HTMLElement> = zQuery&lt;T>

_More accurate type definitions are available in the definition files._
_In reality, this type alias uses complex `extends` clauses, not overloads._

Gets the result of creating a zQuery using a specific type of HTML element.

- `T: HTMLElement` - The element to use.

## type JSX&lt;T extends (props: any) => zQuery&lt;HTMLElement>> = T extends zQuery&lt;infer U> ? U : never

_More accurate type definitions are available in the definition files._
_In reality, this type alias uses complex `extends` clauses, not overloads._

Gets the result of creating a JSX element using a specific component.

- `T: keyof HTMLElements` - The name of the component to use.

## namespace JSX

The main JSX namespace.

### type JSX.Element = zQuery&lt;globalThis.Element>

The output of a JSX component or tag.

### type Boolish = boolean | "true" | "false"

Represents a boolean or a stringified boolean.

### type CSSStyles = Omit&lt;CSSStyleDeclaration, "parentRule" | "length">

Represents every CSS style that can be added using the style property.

### interface BaseAttributes

_More accurate type definitions are available in the definition files._

Base attributes that any JSX element (not component) can have.

### interface ElementAttributes

_More accurate type definitions are available in the definition files._

Attributes that specific types of JSX elements can have.

### interface Attributes extends BaseAttributes

_More accurate type definitions are available in the definition files._

All possible attributes a JSX element could have.
Essentially a union of the values of ElementAttributes and BaseAttributes.

### type ElementChildrenAttribute = { children: {} }

The key for children in the `props` attribute of a component.

### type IntrinsicElements = JSX.BaseAttributes

_More accurate type definitions are available in the definition files._

A list of all attributes that can be added to intrinsic elements.
