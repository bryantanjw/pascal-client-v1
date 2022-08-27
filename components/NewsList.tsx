import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Link,
  Image,
  Text,
  Stack,
  Flex,
  Skeleton,
  Divider,
  HStack,
} from '@chakra-ui/react';
import { fetchNewsData } from 'lib/api'

interface NewsListItemProp {
    publication: string,
    title: string,
    imageUrl: string
    datePublished: string,
    url?: string,
}

const NewsListItem = (props: NewsListItemProp) => {
    const { publication, title, imageUrl, datePublished, url } = props

    return (
        <Box borderWidth={'1px'} p={5} rounded={'lg'}
            marginTop={{ base: '1', sm: '5' }}
            display="flex"
            justifyContent="space-between">
            <Stack
                display="flex"
                flex="1"
                flexDirection="column"
                marginTop={{ base: '3', sm: '0' }}>
                <HStack spacing={3}>
                    <Heading fontSize={'md'}>{publication}</Heading>
                    <Text fontSize={'sm'} fontWeight={'semibold'} color='gray'>{datePublished}</Text>
                </HStack>
                <Text fontSize={'md'} marginTop="1">
                    <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
                    {title}
                    </Link>
                </Text>
            </Stack>

            <Flex>
                <Image height={'100px'} width={'150px'}
                    borderRadius="md"
                    src={imageUrl}
                    alt="some good alt text"
                    objectFit="contain"
                    fallback={<Skeleton />}
                />
            </Flex>
        </Box>
    )
}

export const NewsList = ({ market }) => {
    const [newsData, setNewsData] = useState<any[]>([])
    
    // Fetch news data from Bing Search API
    useEffect(() => {
        fetchNewsData(market.props.bing_search)
        .then(data => {
            setNewsData(data.value)
            console.log("News Data", data.value)
        })
    }, [market.props.bing_search])

    return (
        <>
        {newsData.map((news, index) => (
            <NewsListItem key={index} publication={news.provider[0].name} datePublished={news.datePublished}
                imageUrl={news.image.thumbnail.contentUrl} title={news.name} />
        ))}
        </>
    )
}

export default NewsList