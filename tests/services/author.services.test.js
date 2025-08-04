import { beforeEach, describe, expect, jest } from '@jest/globals';

const mockSendWelcomeEmail = jest.fn()
const mockAuthorModel = {

    findOne: jest.fn(),
    save: jest.fn()
}

jest.unstable_mockModule('../../src/utils/sendEmail.js', () => ({ sendWelcomeEmail: mockSendWelcomeEmail }))

jest.unstable_mockModule('../../src/models/author.model.js', () => ({ default: mockAuthorModel }))

jest.unstable_mockModule('bcryptjs', () => ({ default: { compare: jest.fn() } }))

jest.unstable_mockModule('jsonwebtoken', () => ({ default: { sign: jest.fn() } }))

const { registerAuthorService, loginAuthorService } = await import('../../src/services/author.service.js')
const bcryptMock = await import('bcryptjs')
const jwtMock = await import('jsonwebtoken')

describe('Register Author Service', () => {

    const mockData = {
        authorEmail: 'test@example.com',
        authorPassword: '12345',
        authorName: 'test',
        authorAvatar: 'test.png',
        role: 'Author',
        bio: 'A description about author',
    }

    beforeEach(() => {

        jest.clearAllMocks()
        process.env.EMAIL_USER = 'no-reply@example.com';
    })

    it('Should throw an error if author already exists', async () => {

        mockAuthorModel.findOne.mockResolvedValue({});

        await expect(registerAuthorService(mockData)).rejects.toThrow('User is already registered with this email')

        expect(mockAuthorModel.findOne).toHaveBeenCalledWith({
            authorEmail: mockData.authorEmail
        })
    })

    // it('Should register the author successfully', async () => {

    //     // mockAuthorModel.findOne.mockResolvedValue(null); 

    //     // const mockSave = jest.fn().mockResolvedValue(true);

    //     // mockAuthorModel.mockImplementation(() => ({
    //     //     ...mockData,
    //     //     save: mockSave
    //     // }));

    //     mockSendWelcomeEmail.mockResolvedValue(true);

    //     const result = await registerAuthorService(mockData);

    //     expect(authorModel.findOne).toHaveBeenCalledWith({
    //         authorEmail: mockData.authorEmail
    //     });

    //     expect(mockSendWelcomeEmail).toHaveBeenCalledWith(
    //         process.env.EMAIL_USER,
    //         mockData.authorEmail,
    //         'You’re now an Author! Start Blogging ✍️',
    //         mockData.authorName
    //     );

    //     expect(mockSave).toHaveBeenCalled();
    //     expect(result).toEqual({ email: mockData.authorEmail });
    // });
})

describe('Login Author Service', () => {

    const mockData = {

        authorEmail: 'test@example.com',
        authorPassword: '12345'
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Should throw an error if author is not present', async () => {
        mockAuthorModel.findOne.mockResolvedValue(null)

        await expect(loginAuthorService(mockData)).rejects.toThrow('User is not present')

        expect(mockAuthorModel.findOne).toHaveBeenCalledWith({ authorEmail: mockData.authorEmail })
    })

    it('Should throw an error if invalid passsword', async () => {

        mockAuthorModel.findOne.mockResolvedValue({
            _id: '123',
            authorEmail: mockData.authorEmail,
            authorPassword: 'hashed_password',
            role: 'Author'
        })

        bcryptMock.default.compare.mockResolvedValue(false)

        await expect(loginAuthorService(mockData)).rejects.toThrow('Invalid Creentials')

        expect(mockAuthorModel.findOne).toHaveBeenCalledWith({ authorEmail: mockData.authorEmail })

        expect(bcryptMock.default.compare).toHaveBeenCalledWith(mockData.authorPassword, 'hashed_password')
    })

    it('Should login successfully and return a token if credentials are valid', async () => {

        const fakeUser = {

            _id: '123',
            authorEmail: mockData.authorEmail,
            authorPassword: 'hashed_password',
            role: 'Author'
        }

        mockAuthorModel.findOne.mockResolvedValue(fakeUser);

        bcryptMock.default.compare.mockResolvedValue(true);

        jwtMock.default.sign.mockReturnValue('fake-jwt-token');

        const token = await loginAuthorService(mockData);

        expect(mockAuthorModel.findOne).toHaveBeenCalledWith({ authorEmail: mockData.authorEmail });
        expect(bcryptMock.default.compare).toHaveBeenCalledWith(mockData.authorPassword, fakeUser.authorPassword);
        expect(jwtMock.default.sign).toHaveBeenCalledWith(
            { id: fakeUser._id, role: fakeUser.role },
            process.env.SECRET_KEY,
            { expiresIn: '10d' }
        );
        expect(token).toBe('fake-jwt-token');

    });
})