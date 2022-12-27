import {
    Stack,
    Box,
    Highlight,
    useColorModeValue as mode,
    Text,
    Link,
    useHighlight,
} from '@chakra-ui/react'

const MarketResolution = ({ market }) => {
    const dt = new Date(market.closing_date)
    const day = dt.getDate().toString()
    const month = dt.toLocaleString('default', { month: 'long' })
    const year = dt.getFullYear().toString()

    const chunks = useHighlight({
        text: `${market.resolution_comment} is above ${market.target_value} 
            on ${month} ${day}, ${year}, 
            then the market resolves to Yes.`,
        query: ['then the market resolves to Yes', market.target_value, day, month, year]
    })

    return (
        <Stack spacing={3} direction={'column'} width={{ 'base': '80%', 'md': 'full' }}>
            <Box borderColor={mode('purple.200', 'purple.900')} bg={mode('purple.100', 'purple.800')} mt={3} 
                borderWidth={1} rounded={'md'} p={4}
                >
                {/* Custom highlight texts */}
                {chunks.map(({ match, text }) => {
                    if (!match) return text
                    return text === 'then the market resolves to Yes' ? (
                    <Text key={text} display={'inline'} color={mode('purple.500', 'purple.100')} fontWeight={'bold'}>
                        {text}
                    </Text>
                    ) : (
                    <Text key={text} display={'inline'} fontWeight={'bold'}>
                        {text}
                    </Text>
                    ) 
                })}
            </Box>

            <Box borderColor={mode('teal.100', 'teal.900')} bg={mode('teal.50', 'teal.800')} 
            borderWidth={1} rounded={'md'} p={4}
            >
            <Highlight query={'the market resolves to No'} styles={{ textColor: mode('teal', 'teal.100'), fontWeight: 'bold' }}>
                Else, the market resolves to No.
            </Highlight>
            </Box>
            
            <Text fontSize={'sm'} textColor={mode('gray.600', 'gray.300')} py={1}>
                This market uses&nbsp;
                <Link href={market.resolution_url} isExternal textDecoration={'underline'}> 
                    {market.resolution_source} 
                </Link> 
                &nbsp;as the final arbitrator.
            </Text>
        </Stack>
    )
}

export default MarketResolution