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
