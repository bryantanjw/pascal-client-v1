import React, { useEffect, useState } from 'react';
import {
    Flex, Stack, HStack, SimpleGrid, useColorModeValue, Image, Text, Heading,
} from '@chakra-ui/react';
import styles from '../styles/Home.module.css'
import { SolanaLogo } from './solanaLogoMark';

function MarketCard({ market }) {
    const [timerString, setTimerString] = useState('');

    const iconColor = useColorModeValue('invert(0%)', 'invert(100%)')

    const statStyle = {
        align: 'center',
        direction: 'row',
        filter: 'invert(50%)'
    }

    // Get duration until market closing date
    useEffect(() => {
        const interval = setInterval(() => {
            const delta = (new Date(market.closing_date)).valueOf() - (new Date()).valueOf();
            const hours = Math.floor(delta / 3.6e6);
            const minutes = Math.floor((delta % 3.6e6) / 6e4);
        
            setTimerString(`${hours}h ${minutes}m remaining`);
        
            if (delta < 0) {
              console.log('Clearing interval...');
              clearInterval(interval);
            }
        }, 1000);

        // Anytime the component unmounts clean up the interval
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        }
    }, []);

    // TODO: Update closing date of market
    
    const dt = new Date(market.closing_date)

    return (
          <a href={`/trade/${market.marketId}`}>
            <Stack spacing={4} _hover={{borderColor: useColorModeValue('blue.500', 'blue.200')}} p={5} className={styles.card}>
                {/* Set market's category icon */}
                <Image filter={iconColor} src={`/${market.category}.png`} alt={market.category} width={25} height={25}/>
                
                <Stack spacing={1}>
                    <Heading size={'md'}>{market.title}</Heading>
                    <h3>on {dt.toLocaleString('default', { month: 'long' })} {dt.getDate()}</h3>
                </Stack>
                
                <Flex fontWeight={'semibold'} justify={'space-between'}>
                    <Text>&gt; {market.current_value}</Text>
                    <Stack direction={'row'} spacing={3}>
                        <Text color={'pink.500'}>Yes {market.probability[0].yes} ⓒ</Text>
                        <Text color={'teal.500'}>No {market.probability[0].no} ⓒ</Text>
                    </Stack>
                </Flex>

                <hr />

                <Stack pt={2} spacing={4} direction={'row'}>                
                    <HStack sx={statStyle}>
                        <Image filter={iconColor} src={'/liquidity.png'} width={17} height={17} alt="recurrence" />
                        <h4>{market.liquidity}</h4>
                    </HStack>
                    <HStack sx={statStyle}>
                        <Image filter={iconColor} src={'/recurrence.png'} width={17} height={17} alt="recurrence" />
                        <h4>{market.recurrence}</h4>
                    </HStack>
                </Stack>
            </Stack>
          </a>
    );
};

const List = () => {
    const [markets, setMarkets] = useState([]);

    useEffect(() => {
        fetch(`/api/fetchMarkets`)
        .then(response => response.json())
        .then(data => {
            setMarkets(data);
            console.log("Markets", data);
        });
    }, [60]);

    return (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={7}>
            {markets.map((market: any) => (
                <Stack key={market.marketId}>
                    <MarketCard market={market} />
                </Stack>
            ))}
        </SimpleGrid>
    );
};
  
export default List;