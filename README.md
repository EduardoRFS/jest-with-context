## Usage, beautiful with prettier

```typescript
// your.spec.ts
import { createContext } from 'jest-with-context';

const withContext = createContext({ foo: 0, whatever: 1 });

// just a describe wrapper, YourContext & { test }
withContext('test a api called whatever', ({ test, foo }) => {
  test('foo', ({ whatever }) => {
    expect(foo).toBe(0);
    expect(whatever).toBe(1);
  });
});
```

## Usage, weird with prettier

```typescript
// your.spec.ts
import { withContext } from '../src';

// just a describe wrapper, YourContext & { test }
withContext(
  'test a api called whatever',
  { foo: 0, whatever: 1 },
  ({ test, foo }) => {
    test('foo', ({ whatever }) => {
      expect(foo).toBe(0);
      expect(whatever).toBe(1);
    });
  }
);
```

## Lifecycle

```typescript
import { withContext } from '../src';

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

// if you know what you're doing
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
```
