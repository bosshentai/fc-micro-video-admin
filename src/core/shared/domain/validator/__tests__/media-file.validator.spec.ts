import {
  InvalidMediaFileMimeTypeError,
  InvalidMediaFileSizeError,
  MediaFileValidator,
} from '../media-file.validator';

describe('MediaFileValidator Unit Tests', () => {
  const validator = new MediaFileValidator(1024 * 1024, [
    'image/jpeg',
    'image/png',
  ]);

  it('should throw an error if the file size is too large', () => {
    const data = Buffer.alloc(1024 * 1024 + 1);
    expect(() =>
      validator.validate({
        raw_name: 'test.png',
        mime_type: 'image/png',
        size: data.byteLength,
      }),
    ).toThrow(
      new InvalidMediaFileSizeError(data.byteLength, validator['max_size']),
    );
  });

  it('should throw and error if the file mime type is not valid', () => {
    const data = Buffer.alloc(1024);

    expect(() =>
      validator.validate({
        raw_name: 'test.text',
        mime_type: 'text/plain',
        size: data.byteLength,
      }),
    ).toThrow(
      new InvalidMediaFileMimeTypeError(
        'text/plain',
        validator['valid_mime_type'],
      ),
    );
  });

  it('should return a valid file name', () => {
    const data = Buffer.alloc(1024);
    const { name } = validator.validate({
      raw_name: 'test.png',
      mime_type: 'image/png',
      size: data.byteLength,
    });

    expect(name).toMatch(/\.png$/);
    expect(name).toHaveLength(68);
  });
});
