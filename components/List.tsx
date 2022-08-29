import React, { useEffect, useState } from 'react';
import {
    Flex, Stack, HStack, SimpleGrid, useColorModeValue, Image, Text, Heading, Box, Badge,
} from '@chakra-ui/react';
import styles from '../styles/Home.module.css'
import { SolanaLogo } from './solanaLogoMark'
import { HiBriefcase, HiCursorClick } from 'react-icons/hi'
import { ButtonRadioGroup } from './ToggleButtonGroup';

// TODO: add createevent button/modal for admin
function EventCard({ event }) {
    // const [timerString, setTimerString] = useState('');

    const iconColor = useColorModeValue('invert(0%)', 'invert(100%)')

    const statStyle = {
        align: 'center',
        direction: 'row',
        filter: 'invert(50%)'
    }

    // Get duration until event closing date
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         const delta = (new Date(event.closing_date)).valueOf() - (new Date()).valueOf();
    //         const hours = Math.floor(delta / 3.6e6);
    //         const minutes = Math.floor((delta % 3.6e6) / 6e4);
        
    //         setTimerString(`${hours}h ${minutes}m remaining`);
        
    //         if (delta < 0) {
    //           console.log('Clearing interval...');
    //           clearInterval(interval);
    //         }
    //     }, 1000);

    //     // Anytime the component unmounts clean up the interval
    //     return () => {
    //         if (interval) {
    //             clearInterval(interval);
    //         }
    //     }
    // }, []);

    // TODO: Update closing date of event
    
    const dt = new Date(event.closing_date)

    return (
          <a href={`/events/${event.eventId}`}>
            <Stack spacing={4} _hover={{borderColor: useColorModeValue('blue.500', 'blue.200')}} p={5} className={styles.card}>
                {/* Set event's category icon */}
                <Image filter={iconColor} src={`/${event.category}.png`} alt={event.category} width={25} height={25}/>
                
                <Stack spacing={1}>
                    <Heading size={'md'}>{event.title}</Heading>
                    <h3>on {dt.toLocaleString('default', { month: 'long' })} {dt.getDate()}</h3>
                </Stack>
                
                <Flex fontWeight={'semibold'} justify={'space-between'}>
                    <Text>&gt; {event.current_value}</Text>
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

    useEffect(() => {
        fetch(`/api/fetchEvents`)
        .then(response => response.json())
        .then(data => {
            setEvents(data);
            console.log("events", data);
        });
    }, [60]);

    return (
        <Box>
             <Box mb={4}>
                <ButtonRadioGroup
                    defaultValue="analytics"
                    options={[
                    {
                        label: 'Economics',
                        icon: <HiBriefcase />,
                        value: 'analytics',
                    },
                    {
                        label: 'Crypto',
                        icon: <HiCursorClick />,
                        value: 'intranet',
                    },
                    ]}
                />
            </Box>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={7}>
                {events.map((event: any) => (
                    <Stack key={event.eventId}>
                        <EventCard event={event} />
                    </Stack>
                ))}
            </SimpleGrid>
      </Box>
    );
};
  
export default List;