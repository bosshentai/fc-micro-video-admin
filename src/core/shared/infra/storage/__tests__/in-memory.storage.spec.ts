import { InMemoryStorage } from '../in-memory.storage';

describe('InMemoryStorage Unit Tests', () => {
  let storage: InMemoryStorage;

  beforeEach(() => {
    storage = new InMemoryStorage();
  });

  describe('store', () => {
    it('should store data in the storage', async () => {
      const data = Buffer.from('test data');
      const id = 'test-id';
      const mime_type = 'text/plain';

      await storage.store({ data, mime_type, id });

      const storedData = storage['storage'].get(id);
      expect(storedData).toEqual({ data, mime_type });
    });
  });

  describe('get', () => {
    it('should return the stored data', async () => {
      const data = Buffer.from('test data');
      const id = 'test-id';
      const mime_type = 'text/plain';

      await storage.store({ data, mime_type, id });

      const storedData = await storage.get(id);
      expect(storedData).toEqual({ data, mime_type });
    });
  });
});
