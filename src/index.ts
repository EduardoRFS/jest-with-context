type ItCallback<T extends object> = (context: T) => void | Promise<void>;
interface ContextIt<T extends object> {
  (name: string, fn?: ItCallback<T>, timeout?: number): void;
  only: ContextIt<T>;
  skip: ContextIt<T>;
  todo: ContextIt<T>;
  concurrent: ContextIt<T>;
}
type DescribeCallback<T extends object> = (
  context: T & { test: ContextIt<T> }
) => void;

export const withContext = <T extends object>(
  name: string,
  context: T,
  cb: DescribeCallback<T>
) => {
  const types = ['only', 'skip', 'todo', 'concurrent'] as const;
  const createTest = (type?: typeof types[number]): ContextIt<T> => {
    const testFn = type ? test[type] : test;
    return ((name, fn, timeout) => {
      testFn(name, fn && (() => fn(context)), timeout);
    }) as ContextIt<T>;
  };

  const [only, skip, todo, concurrent] = types.map(createTest);
  const tests = { only, skip, todo, concurrent };
  const contextTest = Object.assign(createTest(), tests);

  return describe(name, () => cb({ ...context, test: contextTest }));
};
export const createContext = <T extends object>(context: T) => (
  name: string,
  cb: DescribeCallback<T>
) => withContext(name, context, cb);
