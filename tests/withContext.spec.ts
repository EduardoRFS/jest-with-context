import { withContext } from '../src';

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
