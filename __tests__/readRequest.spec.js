import fs from 'fs';
import { expect } from 'chai';

const { fetchSchema, ReadRequestSchema, Query } = require(__dirname + '/../../index.js');

fetchSchema(process.env.GRAPHQL_URL).then(schema => {

    describe('Read request', function () {
        it('Should create readSchema object', function () {
            const requestSchema = new ReadRequestSchema(schema, 'testRequest');
            expect(typeof requestSchema).to.equal('object');
            expect(typeof requestSchema.toString).to.equal('function');
            expect(typeof requestSchema.getVariables).to.equal('function');
            expect(typeof requestSchema.name).to.equal('string');
            expect(typeof requestSchema.objects).to.equal('object');
        });

        it('Should create string query', function () {
            const requestSchema = new ReadRequestSchema(schema, 'testRequest', [
                new Query(schema, 'users', {}, [
                    'id',
                    'email'
                ])
            ]);

            const stringOutput = requestSchema
                .toString()
                //Remove doubled spaces
                .replace(/  /g, ' ')
                .replace(/  /g, ' ');
            expect(stringOutput).to.equal('query testRequest { users { id email } }');
        });

        it('Should create multiple string query', function () {
            const requestSchema = new ReadRequestSchema(schema, 'testRequest', [
                new Query(schema, 'users', {}, [
                    'id',
                    'email'
                ]),
                new Query(schema, 'users', {}, [
                    'id',
                    'email'
                ])
            ]);

            const stringOutput = requestSchema
                .toString()
                //Remove doubled spaces
                .replace(/  /g, ' ')
                .replace(/  /g, ' ');
            expect(stringOutput).to.equal('query testRequest { users { id email } users { id email } }');
        });

        it('Should create string query with variables', function () {
            const requestSchema = new ReadRequestSchema(schema, 'testRequest', [
                new Query(schema, 'users', { id: "db5d5d0d-24b1-407c-9bfc-b745f581fad0" }, [
                    'id',
                    'email'
                ])
            ]);

            const stringOutput = requestSchema
                .toString()
                //Remove doubled spaces
                .replace(/  /g, ' ')
                .replace(/  /g, ' ');
            expect(stringOutput).to.equal('query testRequest ( $id: ID ) { users ( id: $id ) { id email } }');
        });

        it('Should create string query with multiple variables', function () {
            const requestSchema = new ReadRequestSchema(schema, 'testRequest', [
                new Query(schema, 'users', { id: "db5d5d0d-24b1-407c-9bfc-b745f581fad0", email: "test@test.com" }, [
                    'id',
                    'email'
                ])
            ]);

            const stringOutput = requestSchema
                .toString()
                //Remove doubled spaces
                .replace(/  /g, ' ')
                .replace(/  /g, ' ');
            expect(stringOutput).to.equal('query testRequest ( $id: ID $email: String ) { users ( id: $id email: $email ) { id email } }');
        });

        it('Should create mutpiple string query with multiple variables', function () {
            const requestSchema = new ReadRequestSchema(schema, 'testRequest', [
                new Query(schema, 'users', { id: "db5d5d0d-24b1-407c-9bfc-b745f581fad0" }, [
                    'id',
                    'email'
                ]),
                new Query(schema, 'users', { email: "test@test.com" }, [
                    'id',
                    'email'
                ])
            ]);

            const stringOutput = requestSchema
                .toString()
                //Remove doubled spaces
                .replace(/  /g, ' ')
                .replace(/  /g, ' ');
            expect(stringOutput).to.equal('query testRequest ( $id: ID $email: String ) { users ( id: $id ) { id email } users ( email: $email ) { id email } }');
        });

        it('Should use nameAs arg name', function () {
            const requestSchema = new ReadRequestSchema(schema, 'testRequest', [
                new Query(schema, 'users', { id: "db5d5d0d-24b1-407c-9bfc-b745f581fad0", email: "test@test.com" }, [
                    'id',
                    'email'
                ], 'query1'),
                new Query(schema, 'users', { id: "db5d5d0d-24b1-407c-9bfc-b745f581fad0", email: "test@test.com" }, [
                    'id',
                    'email'
                ], 'query2')
            ]);

            const stringOutput = requestSchema
                .toString()
                //Remove doubled spaces
                .replace(/  /g, ' ')
                .replace(/  /g, ' ');
            expect(stringOutput).to.equal('query testRequest ( $query1__id: ID $query1__email: String $query2__id: ID $query2__email: String ) { query1: users ( id: $query1__id email: $query1__email ) { id email } query2: users ( id: $query2__id email: $query2__email ) { id email } }');
        });
    });
});


