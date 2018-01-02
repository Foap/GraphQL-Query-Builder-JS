import { GraphQLList, GraphQLID, GraphQLString, GraphQLNonNull } from 'graphql';
import { internet, random } from 'faker';
import isEmail from 'validator/lib/isEmail';

import { UserType, UserInputType } from './usersTypes';

const userQueries = {
    users: {
        type: new GraphQLList(UserType),
        args: {
            id: {
                type: GraphQLID
            },
            email: {
                type: GraphQLString
            }
        },
        resolve: async (rootValue, { id, email }) => {
            return await new Promise(resolve =>
                setTimeout(() => {
                    if (id || email) {
                        let results = new Array(1).fill(undefined);
                        resolve(results.map(result => ({
                            id: id || random.uuid(),
                            email: email || internet.email(),
                        })));
                    } else {
                        resolve(new Array(10).fill(undefined).map(() => ({
                            id: random.uuid(),
                            email: internet.email(),
                        })));
                    }
                }, 100),
            );
        },
    },
};

const userMutations = {
    createUser: {
        type: UserType,
        args: {
            input: {
                type: new GraphQLNonNull(UserInputType),
            },
        },
        resolve: async (rootValue, { input }) => {
            if (!isEmail(input.email)) {
                throw new Error('Email is not in valid format');
            }
            const result = await new Promise((resolve) => {
                setTimeout(() =>
                    resolve(Object.assign(input, {
                        id: random.uuid(),
                    })), 100);
            });
            return result;
        },
    },
};

export { userQueries, userMutations };
