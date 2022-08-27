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
    url: string,
}

const NewsListItem = (props: NewsListItemProp) => {
    const { publication, title, imageUrl, datePublished, url } = props

    // TODO: 1. Embed links

    return (
        <Link href={url} isExternal>
        <Box borderWidth={'1px'} p={5} rounded={'lg'}
            marginTop={{ base: '1', sm: '3' }}
            display="flex"
            justifyContent="space-between">
            <Stack
                display="flex"
                flex="1"
                flexDirection="column" marginRight={'25px'}>
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
                    objectFit="cover"
                    fallback={<Skeleton />}
                />
            </Flex>
        </Box>
        </Link>
    )
}

export const NewsList = ({ market }) => {
    const [newsData, setNewsData] = useState<any[]>([])
    
    useEffect(() => {
        // Fetch news data from Bing Search API
        fetchNewsData(market.props.bing_search)
        .then(data => {
            setNewsData(data.value)
            console.log("News Data", data.value)
        })
    }, [market.props.bing_search])

    return (
        <>
        {newsData.map((news, index) => (
            <NewsListItem key={index} 
                publication={news.provider[0].name}
                // Get time elapsed since each news published
                datePublished={`${Math.round(Math.abs((new Date()).valueOf() - (new Date(news.datePublished)).valueOf()) / 36e5)}hr ago`}
                imageUrl={news.image.thumbnail.contentUrl} 
                title={news.name}
                url={news.url}
            />
        ))}
        </>
    )
}

export default NewsList