interface HTMLElements extends HTMLElementTagNameMap {}
interface HTMLEvents extends HTMLElementEventMap {}

/** A class used for DOM manipulation. */
class zQuery<T extends HTMLElement> extends Array<T> {
  /**
   * Creates a new zQuery instance.
   * @param els The elements to be added to the zQuery.
   * @returns The new zQuery instance.
   */
  constructor(...els: T[]) {
    super(...els);
  }

  /**
   * Calls a function on each element in this zQuery.
   * @param callback The function to call on each element.
   * @returns The current zQuery, to allow for chaining.
   */
  each(callback: (el: T) => void): zQuery<T> {
    this.forEach(callback);

    return this;
  }

  /**
   * Gets the text content of the first element in this zQuery.
   * @returns The text content of the first element in the current zQuery.
   */
  text(): string;

  /**
   * Sets the text content of all elements in this zQuery.
   * @param content The text to fill elements with.
   * @returns The current zQuery, to allow for chaining.
   */
  text(content: string): zQuery<T>;

  text(content?: string): string | zQuery<T> {
    if (!content) return this[0]?.textContent || "";
    else return this.each((el) => (el.textContent = content));
  }

  /**
   * Gets the inner HTML of the first element in this zQuery.
   * @returns The inner HTML of the first element in the current zQuery.
   */
  html(): string;

  /**
   * Sets the inner HTML of all elements in this zQuery.
   * @param content The HTML content to fill elements with.
   * @returns The current zQuery, to allow for chaining.
   */
  html(content: string): zQuery<T>;

  html(content?: string): string | zQuery<T> {
    if (!content) return this[0]?.innerHTML || "";
    else return this.each((el) => (el.innerHTML = content));
  }

  /**
   * Moves all elements in a zQuery into another element.
   * @param query The zQuery to move the elements to.
   * @returns The current zQuery, to allow for chaining.
   */
  render(): zQuery<T> {
    return this.appendTo(document.body);
  }

  /**
   * Gets the elements of this zQuery.
   * @returns An array containing the elements of this zQuery.
   */
  elements(): T[] {
    return [...this];
  }

  /**
   * Empties all elements in this zQuery.
   * @returns The current zQuery, to allow for chaining.
   */
  empty(): zQuery<T> {
    this.forEach((el) => (el.innerHTML = ""));

    return this;
  }

  /**
   * Appends elements to the first item in this zQuery.
   * @param els The elements to append.
   * @returns The current zQuery, to allow for chaining.
   */
  append(...els: (HTMLElement | zQuery<HTMLElement>)[]): zQuery<T> {
    if (this.length == 0) return this;

    for (let el of els) {
      if (el instanceof HTMLElement) this[0].appendChild(el);
      else for (let item of el) this[0].appendChild(item);
    }

    return this;
  }

  /**
   * Appends items in this zQuery to another element.
   * @param item The item to append to. Can be a selector, zQuery, or HTMLElement.
   * @returns The current zQuery, to allow for chaining.
   */
  appendTo(item: zQuery<HTMLElement> | HTMLElement | string): zQuery<T> {
    $(item as any).append(this);

    return this;
  }

  /**
   * Adds an event listener to this zQuery.
   * @param event The event to listen for.
   * @param callback A callback that will be called when the event is triggered.
   * @param options Options to add to the event listener.
   * @returns The current zQuery, to allow for chaining.
   */
  on<E extends keyof HTMLEvents>(
    event: E,
    callback: (event: HTMLEvents[E]) => void,
    options: Omit<AddEventListenerOptions, "once"> = {}
  ): zQuery<T> {
    this.forEach((el) => el.addEventListener(event, callback, options));

    return this;
  }

  /**
   * Adds a one-time event listener to this zQuery.
   * @param event The event to listen for.
   * @param callback A callback that will be called when the event is triggered.
   * @param options Options to add to the event listener.
   * @returns The current zQuery, to allow for chaining.
   */
  once<E extends keyof HTMLEvents>(
    event: E,
    callback: (event: HTMLEvents[E]) => void,
    options: Omit<AddEventListenerOptions, "once"> = {}
  ): zQuery<T> {
    this.forEach((el) =>
      el.addEventListener(event, callback, { ...options, once: true })
    );

    return this;
  }

  /**
   * Remove an event listener from this zQuery.
   * @param event The event that was listened to.
   * @param callback The callback attatched to the event listener.
   * @param options Options to pass to the event listener.
   * @returns The current zQuery, to allow for chaining.
   */
  off(
    event: keyof HTMLEvents,
    callback: () => void,
    options: EventListenerOptions = {}
  ): zQuery<T> {
    this.forEach((el) => el.removeEventListener(event, callback, options));

    return this;
  }

  /**
   * Gets the parents of the first element in this zQuery.
   * @returns A zQuery containing the parents of the first element in the current zQuery.
   */
  parents(): zQuery<HTMLElement> {
    let el: HTMLElement | null = this[0];
    if (!el) return new zQuery();

    let els = [el];
    while ((el = el.parentElement)) els.push(el);

    return new zQuery(...els);
  }

  /**
   * Gets the parent of the first element in this zQuery.
   * @returns A zQuery containing the parent of the first element in the current zQuery.
   */
  parent(): zQuery<HTMLElement> {
    if (this[0]?.parentElement) return new zQuery(this[0].parentElement);
    else return new zQuery();
  }

  /**
   * Filters elements in this zQuery by a CSS selector.
   * @param selector The CSS selector to filter by.
   * @returns A zQuery containing elements matching the CSS selector.
   */
  where<E extends keyof HTMLElements>(selector: E): zQuery<HTMLElements[E]>;
  where(selector: string): zQuery<T>;
  where(selector: string): zQuery<T> {
    return this.filter((el) => el.matches(selector)) as zQuery<T>;
  }

  /**
   * Checks if every element in this zQuery matches a selector.
   * @param selector The CSS selector to match.
   * @returns A boolean indicating whether all of the elements in this zQuery match the selector.
   */
  is<E extends keyof HTMLElements>(
    selector: E
  ): this is zQuery<HTMLElements[E]>;
  is(selector: string): boolean;
  is(selector: string): boolean {
    return this.every((el) => el.matches(selector));
  }

  /**
   * Gets the classes on the first element in a zQuery.
   * @returns The class name of the first element in this zQuery.
   */
  className(): string;

  /**
   * Sets the class name of each element in this zQuery.
   * @param className The class name to set each element to.
   * @returns The current zQuery, to allow for chaining.
   */
  className(className: string): zQuery<T>;

  className(className?: string): zQuery<T> | string {
    if (className) return this.each((el) => (el.className = className));
    else if (this.length) return this[0].className;
    else return "";
  }

  /**
   * Checks if every element in this zQuery has a class.
   * @param className The name of the class to check for.
   * @returns A boolean indicating whether the class is present.
   */
  hasClass(className: string): boolean {
    return this.every((el) => el.classList.contains(className));
  }

  /**
   * Adds a class to each element in this zQuery.
   * @param className The name of the class to add.
   * @returns The current zQuery, to allow for chaining.
   */
  addClass(className: string): zQuery<T> {
    return this.each((el) => el.classList.add(className));
  }

  /**
   * Removes a class from each element in this zQuery.
   * @param className The name of the class to remove.
   * @returns The current zQuery, to allow for chaining.
   */
  removeClass(className: string): zQuery<T> {
    return this.each((el) => el.classList.remove(className));
  }

  /**
   * Hides each element in this zQuery.
   * @returns The current zQuery, to allow for chaining.
   */
  hide(): zQuery<T> {
    return this.each((el) => (el.style.display = "none"));
  }

  /**
   * Shows each element in this zQuery.
   * @returns The current zQuery, to allow for chaining.
   */
  show(): zQuery<T> {
    return this.each((el) => (el.style.display = ""));
  }
}

function $<T extends keyof HTMLElements>(tag: T): zQuery<HTMLElements[T]>;
function $<T extends HTMLElement>(...els: T[]): zQuery<T>;
function $<T extends HTMLElement>(query: zQuery<T>): zQuery<T>;
function $<T extends HTMLElement>(selector: string): zQuery<T>;
function $<T extends HTMLElement>(
  ...items: (zQuery<T> | T | string)[]
): zQuery<T> {
  let elements: T[] = [];

  for (let item of items) {
    if (item instanceof zQuery) elements.push(...item);
    else if (typeof item == "string")
      elements.push(...(document.querySelectorAll(item) as any));
    else elements.push(item);
  }

  return new zQuery<T>(...elements);
}

function jsx<T extends keyof HTMLElements>(
  tag: T,
  props?: Partial<HTMLElements[T]> | null,
  ...children: any[]
): zQuery<HTMLElements[T]>;
function jsx<E extends HTMLElement, P extends { children: C }, C>(
  component: (props: P) => zQuery<E>,
  props?: P | null,
  ...children: C[]
): zQuery<E>;
function jsx<E extends HTMLElement, P extends {}>(
  component: (props: P) => zQuery<E>,
  props?: P | null
): zQuery<E>;
function jsx<E extends HTMLElement>(component: () => zQuery<E>): zQuery<E>;
function jsx(
  component: string | ((props: any) => zQuery<HTMLElement>),
  props?: { [x: string]: any } | null,
  ...children: any[]
): zQuery<HTMLElement> {
  if (props === null || props === undefined) props = {};

  if (typeof component == "string") {
    let element = document.createElement(component);

    for (let child of children) {
      if (child instanceof Element) element.appendChild(child);
      else if (Symbol.iterator in child)
        for (let el of child) element.appendChild(el);
      else element.appendChild(document.createTextNode(child));
    }

    addPropsToElement(props, element);

    return new zQuery(element);
  } else {
    if (children.length == 0) return component({ ...props });
    else if (children.length == 1)
      return component({ ...props, children: children[0] });
    else return component({ ...props, children });
  }
}

function accurateEntries<T extends {}>(object: T) {
  return Object.entries(object) as [keyof T, T[keyof T]][];
}

function addPropsToElement(props: JSX.Attributes, el: HTMLElement) {
  for (let [key, value] of accurateEntries(props)) {
    if (key == "style")
      for (let key in value) el.style[key as any] = value[key];
    else if (key.slice(0, 2) == "on") el.addEventListener(key.slice(2), value);
    else el.setAttribute(key, value);
  }
}

globalThis.$ = $;
globalThis.jsx = jsx;

declare global {
  /**
   * Gets the result of creating a JSX element using a specific component / tag.
   * @template T The name of the component / tag to use.
   */
  type JSX<
    T extends
      | keyof HTMLElements
      | HTMLElement
      | ((...args: any[]) => zQuery<HTMLElement>)
  > = zQuery<
    T extends keyof HTMLElements
      ? HTMLElements[T]
      : T extends HTMLElement
      ? T
      : T extends (...args: any[]) => zQuery<infer E>
      ? E
      : HTMLElement
  >;

  /** The main JSX namespace. */
  namespace JSX {
    /** The output of a JSX component or tag. */
    type Element = zQuery<globalThis.HTMLElement>;

    /** Represents a boolean or a stringified boolean. */
    type Boolish = boolean | "true" | "false";

    /** Represents every CSS style that can be added using the style property. */
    type CSSStyles = Omit<CSSStyleDeclaration, "parentRule" | "length">;

    /** Base attributes that any JSX element (not component) can have. */
    type BaseAttributes = {
      style?: { [K in keyof CSSStyles]?: CSSStyles[K] };
      class?: string;
      id?: string;
      children?: any;
      hidden?: Boolish;
      tabindex?: number;
      title?: string;
      translate?: "yes" | "no";
    } & { [K in keyof HTMLEvents as `on${K}`]?: (event: HTMLEvents[K]) => any };

    /** Attributes that specific types of JSX elements can have. */
    interface ElementAttributes {
      a: {
        href?: string;
      };

      input: {
        type?: string;
      };
    }

    /**
     * All possible attributes a JSX element could have.
     * Essentially a union of the values of ElementAttributes and BaseAttributes.
     */
    interface Attributes extends BaseAttributes {
      href?: string;
      type?: string;
    }

    /** The key for children in the `props` attribute of a component. */
    type ElementChildrenAttribute = { children: {} };

    /** A list of all attributes that can be added to intrinsic elements. */
    type IntrinsicElements = {
      [K in keyof HTMLElements]: K extends keyof JSX.ElementAttributes
        ? BaseAttributes & JSX.ElementAttributes[K]
        : BaseAttributes;
    };
  }

  /**
   * Selects elements that have a specific HTML tag name.
   * @param tag The HTML tag to match.
   * @returns A zQuery containing elements matching the tag type.
   */
  function $<T extends keyof HTMLElements>(tag: T): zQuery<HTMLElements[T]>;

  /**
   * Creates a zQuery of the given elements.
   * @param els The elements to use.
   * @returns A zQuery containing the given elements.
   */
  function $<T extends HTMLElement>(...els: T[]): zQuery<T>;

  /**
   * Returns the given zQuery.
   * @param query The zQuery to return.
   * @returns The given zQuery.
   */
  function $<T extends HTMLElement>(query: zQuery<T>): zQuery<T>;

  /**
   * Selects elements matching a CSS selector from the DOM.
   * @param selector The CSS selector to use.
   * @returns A zQuery containing elements matching the selector.
   */
  function $<T extends HTMLElement>(selector: string): zQuery<T>;

  /**
   * Creates a new HTML element and returns it as a zQuery.
   * @param tag The HTML tag to create.
   * @param props Properties to add to the HTML tag.
   * @param children Children to append to the created tag.
   * @returns A zQuery containing the created HTML element.
   */
  function jsx<T extends keyof HTMLElements>(
    tag: T,
    props?: Partial<HTMLElements[T]> | null,
    ...children: any[]
  ): zQuery<HTMLElements[T]>;

  /**
   * Creates a new JSX component and returns it.
   * @param component The component to use.
   * @param props The props to pass to the component.
   * @param children The children to pass to the component.
   * @returns A zQuery containing the created JSX element.
   */
  function jsx<E extends HTMLElement, P extends { children: C }, C>(
    component: (props: P) => zQuery<E>,
    props?: P | null,
    ...children: C[]
  ): zQuery<E>;

  /**
   * Creates a new JSX component and returns it.
   * @param component The component to use.
   * @param props The props to pass to the component.
   * @returns A zQuery containing the created JSX element.
   */
  function jsx<E extends HTMLElement, P extends {}>(
    component: (props: P) => zQuery<E>,
    props?: P | null
  ): zQuery<E>;

  /**
   * Creates a new JSX component and returns it.
   * @param component The component to use.
   * @returns A zQuery containing the created JSX element.
   */
  function jsx<E extends HTMLElement>(component: () => zQuery<E>): zQuery<E>;
}

export {};
