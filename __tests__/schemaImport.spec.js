import fs from 'fs';
import { expect } from 'chai';

const { fetchSchema, readSchema, saveSchema } = global.process.app;

describe('Schema import', function () {
    beforeEach(() => {
        if (fs.existsSync(global.process.env.SCHEMA_PATH)) {
            fs.unlinkSync(global.process.env.SCHEMA_PATH);
        }
    });

    it('Should fetch schema', function (done) {
        fetchSchema(process.env.GRAPHQL_URL).then(response => {
            expect(typeof response).to.equal('object');
            expect(typeof response.queries).to.equal('object');
            expect(typeof response.mutations).to.equal('object');
            expect(typeof response.objects).to.equal('object');
            expect(typeof response.inputObjects).to.equal('object');
            done();
        });
    });

    it('Should save schema file', function (done) {
        fetchSchema(process.env.GRAPHQL_URL).then(response => {
            saveSchema(response, global.process.env.SCHEMA_PATH).then(response => {
                expect(fs.existsSync(global.process.env.SCHEMA_PATH)).to.be.true;
                done();
            });
        });
    });

    it('Should read schema file', function (done) {
        fetchSchema(process.env.GRAPHQL_URL).then(response => {
            saveSchema(response, global.process.env.SCHEMA_PATH).then(response => {
                readSchema(global.process.env.SCHEMA_PATH).then(response => {
                    expect(typeof response).to.equal('object');
                    expect(typeof response.queries).to.equal('object');
                    expect(typeof response.mutations).to.equal('object');
                    expect(typeof response.objects).to.equal('object');
                    expect(typeof response.inputObjects).to.equal('object');
                    done();
                });
            });
        });
    });
});
