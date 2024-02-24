import './App.css'
import { ChakraProvider } from '@chakra-ui/react'
import Table from './components/TableComponent'

function App() {
  return (
    <ChakraProvider>
      <Table/>
    </ChakraProvider>
  )
}

export default App
