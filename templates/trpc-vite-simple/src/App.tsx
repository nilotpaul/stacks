import { getRouteData, trpc } from './lib/kyrix';

const App = () => {
  const test = trpc.tests.get.useQuery(undefined, {
    initialData: getRouteData(),
  });

  if (test.isLoading) return 'Loading...';

  return (
    <div>
      <h1>tRPC + Vite</h1>

      {/* {test.data} */}
      {JSON.stringify(test.data)}
    </div>
  );
};

export default App;
