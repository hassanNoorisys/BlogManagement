import { beforeEach, describe, expect, jest } from '@jest/globals';

const mockSendOTPEmail = jest.fn();
const mockReaderModel = {
  findOne: jest.fn()
};

jest.unstable_mockModule('../../src/utils/sendEmail.js', () => ({
  sendOTPEmail: mockSendOTPEmail
}));

jest.unstable_mockModule('../../src/models/reader.model.js', () => ({
  default: mockReaderModel
}));

const { registerReaderService, loginReaderService } = await import('../../src/services/reader.service.js');

// register reader service test suit
describe('Register Reader service', () => {
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
    mockReaderModel.findOne.mockResolvedValue({});

    await expect(registerReaderService(mockData)).rejects.toThrow(
      'User is already registered with this email'
    );

    expect(mockReaderModel.findOne).toHaveBeenCalledWith({
      readerEmail: mockData.readerEmail
    });
  });
});


// login reader service test suit
describe('Login Reader service', () => {

  const mockData = {
    readerEmail: 'test@example.com',
    readerPassword: '12345',
  };

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Should throw an error if user is not present', async () => {

    mockReaderModel.findOne.mockResolvedValue(null)

    await expect(loginReaderService(mockData)).rejects.toThrow('User is not present')

    expect(mockReaderModel.findOne).toHaveBeenCalledWith({ readerEmail: mockData.readerEmail })
  })
})


