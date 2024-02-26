import {
    // Chakra UI components
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
    Box,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    useDisclosure,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';

import axios from 'axios';
import { useEffect, useState } from 'react';

function TableComponent() {
    // State variables
    const [tableHeaders, setTableHeaders] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [avatarName, setAvatarName] = useState('');
    const [performanceScore, setPerformanceScore] = useState(0);
    const [isSyncing, setSyncing] = useState(false);
    const [isSaving, setSaving] = useState(false);

    // Function to fetch data from the server
    const fetchData = async () => {
        try {
            setSyncing(true);
            const response = await axios.get('/sheet');
            const headers = response.data[0].rowData;
            // console.log(headers);
            // console.log("headers");
            // console.log(response);
            const hello = response.data.slice(1);
            // console.log(typeof(hello));
            // console.log(hello);
            const rows = hello.map((row) => (
                <Tr key={row.rowNumber}>
                    {row.rowData.map((cell, index) => (
                        <Td key={index}>{cell}</Td>
                    ))}
                </Tr>
            ));

            setTableHeaders(headers);
            setTableRows(rows);
            setSyncing(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Function to handle posting data to the server
    const handlePostData = async () => {
        try {
            if (avatarName !== '') {
                setSaving(true);
                const response = await axios.post('/addRow', {
                    avatarName,
                    performanceScore,
                });

                console.log('Response:', response.data);
                fetchData();
                onClose();
                setSaving(false);
            }
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    // Event handler for adding a new row
    const handleAddRow = () => {
        handlePostData();
    };

    // Event handler for sync button click
    const handleButtonClick = () => {
        fetchData();
    };

    // useEffect to fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Event handler for avatar name input change
    const handleAvatarNameChange = (e) => {
        setAvatarName(e.target.value);
    };

    // Event handler for performance score input change
    const handlePerformanceScoreChange = (value) => {
        setPerformanceScore(value);
    };

    return (
        <>
            {/* Header */}
            <Box w="80%" textAlign="center" m="auto">
                <Text mt="30px" fontSize="40px" fontWeight="bold">Wherehouse.io</Text>
                <Text fontSize="20px" fontWeight="bold">Internship Assignment - SDE FullStack</Text>
            </Box>

            {/* Table and Buttons */}
            <TableContainer w="80%" m="auto" mt="20px" border="2px solid #E2E8F0" borderRadius="4px">
                <Table variant="simple" size="sm">
                    <Thead>
                        <Tr>
                            {tableHeaders.map((header, index) => (
                                <Th key={index}>{header}</Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>{tableRows}</Tbody>
                </Table>

                {/* Action Buttons */}
                <Box display="flex" justifyContent="center">
                    <Button colorScheme="teal" onClick={handleButtonClick} m="10px" px="30px" isLoading={isSyncing}>
                        Sync
                    </Button>
                    <Button onClick={onOpen} colorScheme="teal" m="10px" px="30px">Add Row</Button>

                    {/* Modal for adding a new row */}
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Add New Entry</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                {/* Form for Avatar Name and Performance Score */}
                                <FormControl isRequired>
                                    <FormLabel>Avatar Name</FormLabel>
                                    <Input placeholder='Avatar Name' value={avatarName} onChange={handleAvatarNameChange} />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Performance Score</FormLabel>
                                    <NumberInput defaultValue={0} min={0} max={10} value={performanceScore} onChange={handlePerformanceScoreChange}>
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>
                            </ModalBody>

                            {/* Modal Footer with Save and Cancel buttons */}
                            <ModalFooter>
                                <Button colorScheme='teal' mr={3} onClick={handleAddRow} isLoading={isSaving}>
                                    Save
                                </Button>
                                <Button onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Box>
            </TableContainer>
        </>
    );
}

export default TableComponent;
