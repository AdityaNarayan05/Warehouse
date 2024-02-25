// Importing the CSS file for styling
import './App.css';

// Importing ChakraProvider from Chakra UI
import { ChakraProvider } from '@chakra-ui/react';

// Importing the Table component
import Table from './component/TableView';

// App component
function App() {
  return (
    // Wrapping the entire application with ChakraProvider for Chakra UI
    <ChakraProvider>
      {/* Rendering the Table component */}
      <Table />
    </ChakraProvider>
  );
}

// Exporting the App component as the default export
export default App;