import React, { useEffect, useState } from 'react';
import {
    Box, Button, Divider, Heading, Stack, VStack, HStack, Text,
    Input, InputGroup, InputLeftElement,
    Menu, MenuButton, MenuItem, MenuList, LinkOverlay, LinkBox,
} from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';
import { SearchIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import styles from '../styles/Home.module.css'
import Image from 'next/image';

// TODO: make component functional
const FilterToggle = () => {
    return ( 
    <Menu>
        <MenuButton width={'280px'} as={Button} boxShadow={'sm'}
            rightIcon={<FaChevronDown />} bg={'gray.20'} textAlign={'left'} fontWeight={400}
            px={4} py={2} transition='all 0.6s' borderRadius='md' borderWidth='1px' textColor={'gray.500'} fontSize={'xs'}
            _hover={{ borderColor: 'gray.400' }}
            _expanded={{ borderColor: 'gray.400' }}
            _focus={{ borderColor: 'gray.400' }}>
            Highest liquidity
        </MenuButton>
        <MenuList px={2} py={5} boxShadow={'md'}>
            <MenuItem py={2}>Total volume</MenuItem>
            <MenuItem py={2}>Highest liquidity</MenuItem>
            <MenuItem py={2}>Newest</MenuItem>
            <MenuItem py={2}>Closing soon</MenuItem>
        </MenuList>
    </Menu>
    );
}

function ProductCard({ product }) {
    const { description, odds, closing_date, liquidity, slug } = product;
    const [timerString, setTimerString] = useState('');

    // Get duration until market closing date
    useEffect(() => {
        const interval = setInterval(() => {
            const delta = (new Date(closing_date)).valueOf() - (new Date()).valueOf();
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

    const dt = new Date(product.closing_date)

    return (
          <a href="https://nextjs.org/docs" className={styles.card}>
            <Image src={`/${product.category}.png`} width={30} height={30} alt="Financials" />
            <h2>{product.description}</h2>
            <h3>on {dt.toLocaleString('default', { month: 'long' })} {dt.getDate()}</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>
    );
};

const List = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`/api/fetchProducts`)
        .then(response => response.json())
        .then(data => {
            setProducts(data);
            console.log("Products", data);
        });
    }, []);

    return (
        <div className={styles.grid}>
            {products.map((product: any) => (
                <Stack key={product.id}>
                    <ProductCard product={product} />
                </Stack>
            ))}
        </div>
    );
};
  
export default List;