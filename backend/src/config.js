// Added so the provider IP address can be easily changed. (For Windows the docker containers aren't running in localhost
// as they do on Mac and Ubuntu)
module.exports = {
    testrpcAddress: 'http://192.168.99.100:8545',
    // testrpcAddress : 'http://localhost:8545',
    postgresAddress: '192.168.99.100',
    postgresPort: '5432'

};