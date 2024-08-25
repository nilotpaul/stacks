import { trpc } from './lib/trpc';

const App = () => {
  const { data: test, isLoading } = trpc.tests.hello.useQuery(undefined);

  if (isLoading) return 'Loading...';

  return (
    <div>
      <div>
        <h1>Hono + tRPC + Vite</h1>
      </div>{' '}
      {test?.toString()}
    </div>
  );
};

export default App;
