import React, { useEffect, useState } from 'react'
import {
    Flex, 
    Stack, HStack, 
    SimpleGrid, 
    useColorModeValue, 
    Image, Text, Heading,
    Box,
    useCheckboxGroup
} from '@chakra-ui/react'
import styles from '../styles/Home.module.css'
import { FilterToggle } from './FilterToggle'

const categories = ['Financials', 'Economics', 'Crypto', 'Climate']

// TODO: 1. add createevent button/modal for admin
// 2. dynamic closing date of event
function EventCard({ event }) {
    // const [timerString, setTimerString] = useState('');

    const iconColor = useColorModeValue('invert(0%)', 'invert(100%)')

    const statStyle = {
        align: 'center',
        direction: 'row',
        filter: 'invert(50%)'
    }
    
    const dt = new Date(event.closing_date)

    return (
          <a href={`/events/${event.eventId}`}>
            <Stack spacing={4} p={5}
                borderColor={useColorModeValue('#eaeaea', '#696969')} borderWidth={1}
                _hover={{borderColor: useColorModeValue('gray.400', 'white')}}
                className={styles.card}>
                {/* Set event's category icon */}
                <Image filter={iconColor} src={`/${event.category}.svg`} alt={event.category} width={25} height={25}/>
                
                <Stack spacing={1}>
                    <Heading size={'md'}>{event.title}</Heading>
                    <h3>on {dt.toLocaleString('default', { month: 'long' })} {dt.getDate()}</h3>
                </Stack>
                
                <Flex fontWeight={'semibold'} justify={'space-between'}>
                    <Text>&gt; {event.target_value}</Text>
                    <Stack direction={'row'} spacing={3}>
                        <Text color={'pink.500'}>Yes {event.probability[0].yes} ⓒ</Text>
                        <Text color={'teal.500'}>No {event.probability[0].no} ⓒ</Text>
                    </Stack>
                </Flex>

                <hr />

                <Stack pt={2} spacing={4} direction={'row'}>                
                    <HStack sx={statStyle}>
                        <Image filter={iconColor} src={'/liquidity.png'} width={17} height={17} alt="recurrence" />
                        <h4>{event.liquidity}</h4>
                    </HStack>
                    <HStack sx={statStyle}>
                        <Image filter={iconColor} src={'/recurrence.png'} width={17} height={17} alt="recurrence" />
                        <h4>{event.recurrence}</h4>
                    </HStack>
                </Stack>
            </Stack>
          </a>
    );
};

// TODO: add filter and search
const List = () => {
    const [events, setEvents] = useState([]);
    
    // FilterToggle state management is be ignored for the time being
    const { value, getCheckboxProps } = useCheckboxGroup({ defaultValue: [] })
    console.log('Selection', value)
    useEffect(() => {
        fetch(`/api/fetchEvents`)
        .then(response => response.json())
        .then(data => {
            setEvents(data);
            console.log("events", data);
        });
    }, [60]);

    const filteredEvents = events.filter(({ category }) => value.includes(category))

    return (
        <Box>
            <HStack py={5}>
                {categories.map((category, index) => (
                    <Stack key={index}>
                        <FilterToggle
                            {...getCheckboxProps({ value: category })}
                            iconUrl={`./${category}.svg`}
                            title={category}
                        />
                    </Stack>
                ))}
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                {filteredEvents.length != 0 ?
                    (filteredEvents.map((event: any) => (
                        <Stack key={event.eventId}>
                            <EventCard event={event} />
                        </Stack>
                    )))
                    : (events.map((event: any) => (
                        <Stack key={event.eventId}>
                            <EventCard event={event} />
                        </Stack>
                    )))
                }
            </SimpleGrid>
      </Box>
    );
};
  
export default List;