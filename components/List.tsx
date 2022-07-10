import React, { useEffect, useState } from 'react';
import {
    Box, Button, Divider, Heading, Stack, VStack, HStack, Text,
    Input, InputGroup, InputLeftElement,
    Menu, MenuButton, MenuItem, MenuList, LinkOverlay, LinkBox,
} from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Image from 'next/image';

function ProductCard({ product }) {
    const { title, closing_date, liquidity, questionId } = product;
    const [timerString, setTimerString] = useState('');

    // Get duration until market closing date
    useEffect(() => {
        const interval = setInterval(() => {
            const delta = (new Date(product.closing_date)).valueOf() - (new Date()).valueOf();
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
          <a href={`/trade/${questionId}`} className={styles.card}>
            <Image src={`/${product.category}.png`} width={25} height={25} alt={product.category} />
            <h2>{product.title}</h2>
            <h3>on {dt.toLocaleString('default', { month: 'long' })} {dt.getDate()}</h3>
            <p>Find in-depth information about Next.js features and API.</p>
            <HStack opacity={"70%"} mt={4}>
                <Image src={'/recurrence.png'} width={17} height={17} alt="recurrence" />
                <h4>{product.recurrence}</h4>
            </HStack>
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
    }, [60]);

    return (
        <div className={styles.grid}>
            {products.map((product: any) => (
                <Stack key={product.questionId}>
                    <ProductCard product={product} />
                </Stack>
            ))}
        </div>
    );
};
  
export default List;