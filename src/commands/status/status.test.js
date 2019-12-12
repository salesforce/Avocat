const status = require('./status');

describe('status command', () => {
  describe('given no pending contracts', () => {
    it('returns a no pending changes message', () => {
      const outcome = status();
      expect(outcome).toStrictEqual({ message: 'No pending changes.' });
    });
  });
});
