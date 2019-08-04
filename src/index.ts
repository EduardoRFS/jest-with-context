type ItCallback<T> = (context: T) => void | Promise<void>;
interface ContextIt<T> {
  (name: string, fn?: ItCallback<T>, timeout?: number): void;
  only: ContextIt<T>;
  skip: ContextIt<T>;
  todo: ContextIt<T>;
  concurrent: ContextIt<T>;
}
type Lifecycle<T> = (
  fn: (context: T) => void | Promise<void> | T | Promise<T>,
  timeout?: number
) => any;
type DescribeCallback<T> = (
  context: T & {
    test: ContextIt<T>;
    beforeAll: Lifecycle<T>;
    beforeEach: Lifecycle<T>;
    afterAll: Lifecycle<T>;
    afterEach: Lifecycle<T>;
  }
) => void;

const createContextIt = <T>(context: () => T) => {
  const types = ['only', 'skip', 'todo', 'concurrent'] as const;
  const createTest = (type?: typeof types[number]): ContextIt<T> => {
    const testFn = type ? test[type] : test;
    return ((name, fn, timeout) => {
      testFn(name, fn && (() => fn(context())), timeout);
    }) as ContextIt<T>;
  };

  const [only, skip, todo, concurrent] = types.map(createTest);
  return Object.assign(createTest(), { only, skip, todo, concurrent });
};
const createLifecycles = <T>(
  get: () => T,
  set: (context: T) => void
): Lifecycle<T>[] => {
  const types = [beforeAll, beforeEach, afterAll, afterEach] as const;
  return types.map(type => (fn, timeout) =>
    type(async () => {
      const context = get();
      const value = await fn(context);
      if (value) {
        set(value);
      }
    }, timeout)
  );
};

export const withContext = <T extends object>(
  name: string,
  context: T | DescribeCallback<T>,
  cb?: DescribeCallback<T>
) => {
  const callback = cb || (context as DescribeCallback<T>);

  let state: T = (typeof context !== 'function' ? context : undefined) as T;
  const set = (newContext: T) => (state = newContext);
  const get = () => state;

  const contextTest = createContextIt(get);
  const [beforeAll, beforeEach, afterAll, afterEach] = createLifecycles(
    get,
    set
  );

  return describe(name, () =>
    callback({
      ...state,
      test: contextTest,
      beforeAll,
      beforeEach,
      afterAll,
      afterEach,
    })
  );
};
export const createContext = <T extends object>(context: T) => (
  name: string,
  cb: DescribeCallback<T>
) => withContext(name, context, cb);
