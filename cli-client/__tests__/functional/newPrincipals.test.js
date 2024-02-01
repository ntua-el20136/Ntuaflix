const shell = require('shelljs');
const { clearToken } = require('../../src/utils/tokenStorage');

describe('/newprincipals command', () => {
    it('successfully uploads a file', (done) => {
        shell.exec('se2321 newprincipals -f /Users/harrypapadakis/Documents/7th_semester/software_engineering/truncated_data/truncated_title.principals.tsv', {silent: true}, (code, stdout, stderr) => {
            expect(code).toBe(0);
            expect(stderr).toBe('');
            expect(stdout).toContain('File uploaded successfully');
            done();
        });
    }, 10000);

    it('handles non-existent file', (done) => {
        shell.exec('se2321 newprincipals -f /Users/harrypapadakis/Documents/7th_semester/software_engineering/truncated_data/foo.tsv', {silent: true}, (code, stdout, stderr) => {
            expect(code).toBe(1);
            expect(stderr).toContain('File not found');
            expect(stdout).toBe('');
            done();
        });
    });

    it('handles invalid format file', (done) => {
        shell.exec('se2321 newprincipals -f /Users/harrypapadakis/Documents/7th_semester/software_engineering/SRS.pages', {silent: true}, (code, stdout, stderr) => {
            expect(code).toBe(1);
            expect(stderr).toContain('Failed to upload');
            expect(stdout).toBe('');
            done();
        });
    });

    it('handles invalid token', (done) => {
        clearToken();
        shell.exec('se2321 newprincipals -f /Users/harrypapadakis/Documents/7th_semester/software_engineering/truncated_data/truncated_title.principals.tsv', {silent: true}, (code, stdout, stderr) => {
            expect(code).toBe(1);
            expect(stderr).toContain('Failed to upload');
            expect(stdout).toBe('');
            done();
        });
    });

    it('handles not admin user', (done) => {
        shell.exec('se2321 login -u bothos12 -p nick123', { silent: true }, (code, stdout, stderr) => {
            expect(code).toBe(0);
            expect(stderr).toBe('');
            expect(stdout).toContain('Welcome to NTUAFLIX!');
            expect(stdout).toContain('Your ID is: 22');
            shell.exec('se2321 newprincipals -f /Users/harrypapadakis/Documents/7th_semester/software_engineering/truncated_data/truncated_title.principals.tsv', {silent: true}, (code, stdout, stderr) => {
                expect(code).toBe(1);
                expect(stderr).toContain('Failed to upload');
                expect(stdout).toBe('');
                done();
            });
        });
    });
});