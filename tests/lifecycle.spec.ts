import { withContext } from '../src';

withContext('before each', { foo: 0 }, ({ test, beforeEach }) => {
  let fooInternal = 0;
  beforeEach(() => {
    fooInternal++;
    return { foo: fooInternal };
  });
  test('foo 1', ({ foo }) => {
    expect(foo).toBe(1);
  });
  test('foo 2', ({ foo }) => {
    expect(foo).toBe(2);
  });
});

withContext('after each', { foo: 0 }, ({ test, afterEach }) => {
  let fooInternal = 0;
  afterEach(() => {
    fooInternal++;
    return { foo: fooInternal };
  });
  test('foo 0', ({ foo }) => {
    expect(foo).toBe(0);
  });
  test('foo 1', ({ foo }) => {
    expect(foo).toBe(1);
  });
});

withContext<{ foo: number }>(
  'before each without context',
  ({ test, beforeEach }) => {
    beforeEach((state = { foo: 0 }) => {
      return { foo: state.foo + 1 };
    });
    test('foo 1', ({ foo }) => {
      expect(foo).toBe(1);
    });
    test('foo 2', ({ foo }) => {
      expect(foo).toBe(2);
    });
  }
);
