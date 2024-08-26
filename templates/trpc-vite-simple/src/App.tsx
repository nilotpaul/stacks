import { trpc } from './lib/trpcClient';

const App = () => {
  const test = trpc.tests.test.useQuery();

  if (test.isLoading) return 'Loading...';

  return (
    <div>
      <h1>tRPC + Vite</h1>

      {test.data}
    </div>
  );
};

export default App;
