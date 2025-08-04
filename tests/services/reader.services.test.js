import { jest } from '@jest/globals';

const mockSendOTPEmail = jest.fn();
const mockReaderModel = {
  findOne: jest.fn(),
  save: jest.fn()
};

jest.unstable_mockModule('../../src/utils/sendEmail.js', () => ({
  sendOTPEmail: mockSendOTPEmail
}));

jest.unstable_mockModule('../../src/models/reader.model.js', () => ({
  default: mockReaderModel
}));

const { registerReaderService } = await import('../../src/services/reader.service.js');

describe('registerReaderService', () => {
  const mockData = {
    readerEmail: 'test@example.com',
    readerPassword: '12345',
    readerName: 'test',
    readerAvatar: 'test.png'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EMAIL_USER = 'no-reply@example.com';
  });

  it('Should throw an error if user already exists', async () => {
    mockReaderModel.findOne.mockResolvedValue({}); // simulate user exists

    await expect(registerReaderService(mockData)).rejects.toThrow(
      'User is already registered with this email'
    );

    expect(mockReaderModel.findOne).toHaveBeenCalledWith({
      readerEmail: mockData.readerEmail
    });
  });
});
