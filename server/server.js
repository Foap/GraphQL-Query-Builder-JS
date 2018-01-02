
import Express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './schema';

const app = new Express();
app.set('x-powered-by', false);
const dev = process.env.NODE_ENV === 'development';

app.use('*', graphqlHTTP({
    schema,
    graphiql: dev,
}));

app.listen(3101, error => {
    if (error) console.error(error);
    console.info(`Server running on http://localhost:${3101}`);
});

export default app;
