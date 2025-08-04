export default {

    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.js'],
    transform: {
        '^.+\\.[jt]s?$': 'babel-jest'
    },
};
