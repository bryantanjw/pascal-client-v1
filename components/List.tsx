import React, { useEffect, useState } from 'react';
import {
    Stack, HStack, useColorMode, useColorModeValue, Image,
} from '@chakra-ui/react';
import styles from '../styles/Home.module.css'

function MarketCard({ market }) {
    const { title, closing_date, liquidity, marketId } = market;
    const [timerString, setTimerString] = useState('');

    const iconColor = useColorModeValue('invert(0%)', 'invert(100%)')

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
          <a href={`/trade/${marketId}`} className={styles.card}>
            <Stack spacing={3}>
                {/* Set market's category icon */}
                <Image filter={iconColor} src={`/${market.category}.png`} alt={market.category} width={25} height={25}/>
                
                <Stack spacing={0}>
                    <h2>{market.title}</h2>
                    <h3>on {dt.toLocaleString('default', { month: 'long' })} {dt.getDate()}</h3>
                </Stack>
                    <p>Find in-depth information about Next.js features and API.</p>
                    
                <HStack opacity={"70%"} mt={4}>
                    <Image filter={iconColor} src={'/recurrence.png'} width={17} height={17} alt="recurrence" />
                    <h4>{market.recurrence}</h4>
                </HStack>
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
        <div className={styles.grid}>
            {markets.map((market: any) => (
                <Stack key={market.marketId}>
                    <MarketCard market={market} />
                </Stack>
            ))}
        </div>
    );
};
  
export default List;