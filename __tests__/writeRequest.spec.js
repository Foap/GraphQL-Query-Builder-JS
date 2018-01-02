import fs from 'fs';
import { expect } from 'chai';

const { fetchSchema, WriteRequestSchema, Mutation } = global.process.app;

fetchSchema(process.env.GRAPHQL_URL).then(schema => {

    describe('Write request', function () {
        it('Should create writeSchema object', function () {
            const requestSchema = new WriteRequestSchema(schema, 'testRequest');
            expect(typeof requestSchema).to.equal('object');
            expect(typeof requestSchema.toString).to.equal('function');
            expect(typeof requestSchema.getVariables).to.equal('function');
            expect(typeof requestSchema.name).to.equal('string');
            expect(typeof requestSchema.objects).to.equal('object');
        });

        it('Should create string mutation', function () {
            const requestSchema = new WriteRequestSchema(schema, 'testRequest', [
                new Mutation(schema, 'createUser', { input: { email: 'test@test.com' } }, ['id'])
            ]);

            const stringOutput = requestSchema
                .toString()
                //Remove doubled spaces
                .replace(/  /g, ' ')
                .replace(/  /g, ' ');
            expect(stringOutput).to.equal('mutation testRequest ( $email: String! ) { createUser ( input: { email: $email } ) { id } }');
        });

        it('Should create multiple string mutation and use nameAs as name', function () {
            const requestSchema = new WriteRequestSchema(schema, 'testRequest', [
                new Mutation(schema, 'createUser', { input: { email: 'test1@test.com' } }, ['id'], 'user1'),
                new Mutation(schema, 'createUser', { input: { email: 'test2@test.com' } }, ['id'], 'user2')
            ]);

            const stringOutput = requestSchema
                .toString()
                //Remove doubled spaces
                .replace(/  /g, ' ')
                .replace(/  /g, ' ');
            expect(stringOutput).to.equal('mutation testRequest ( $user1__email: String! $user2__email: String! ) { user1: createUser ( input: { email: $user1__email } ) { id }user2: createUser ( input: { email: $user2__email } ) { id } }');
        });
    });
});
