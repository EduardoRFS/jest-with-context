import { createContext } from '../src';

const withContext = createContext({ foo: 0, whatever: 1 });

withContext('test a api called whatever', ({ test, foo }) => {
  test('foo', ({ whatever }) => {
    expect(foo).toBe(0);
    expect(whatever).toBe(1);
  });
});
