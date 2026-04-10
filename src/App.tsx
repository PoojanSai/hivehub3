import { AppProvider } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <AppProvider>
      <Layout />
      <Toaster position="top-right" />

    </AppProvider>
  );
}
