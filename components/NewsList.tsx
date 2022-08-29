import React, { useEffect, useState, Suspense } from 'react';
import {
  Box,
  Heading,
  Image,
  Text,
  Stack,
  Flex,
  Skeleton,
  Divider,
  HStack,
  Link,
  Tooltip,
} from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { fetchNewsData } from 'lib/api'

interface NewsListItemProp {
    publication: string,
    title: string,
    imageUrl?: string
    datePublished: string,
    url: string,
}

// TODO: fallback Skeleton is not working
const NewsListItem = (props: NewsListItemProp) => {
    const { publication, title, imageUrl, datePublished, url } = props

    return (
        <Link href={url} isExternal _hover={{ textDecoration: 'none' }}>
            <Box borderWidth={'1px'} p={5} rounded={'lg'}
                marginTop={1}
                display="flex"
                justifyContent="space-between"
                transition={'border-color 0.3s linear'}
                _hover={{ borderColor:'gray.400' }}>
                <Suspense fallback={<Skeleton />}>
                    <Stack
                        display="flex"
                        flex="1"
                        flexDirection="column" marginRight={'25px'}>
                        <HStack spacing={3}>
                            <Heading fontSize={'md'}>{publication}</Heading>
                            <Text fontSize={'sm'} fontWeight={'semibold'} color='gray'>{datePublished}</Text>
                        </HStack>
                        <Text fontSize={'md'} marginTop="1">
                            {title}
                        </Text>
                    </Stack>
                </Suspense>

                <Flex>
                    <Image height={'100px'} width={'150px'}
                        borderRadius="md"
                        src={imageUrl}
                        alt={title}
                        objectFit="cover"
                        fallback={<Skeleton />}
                    />
                </Flex>
            </Box>
        </Link>
    )
}

// TODO: add loading skeleton when fetching news data
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
        <Stack paddingTop={16}>
            <Flex justify={'space-between'}>
                <Heading fontSize={'2xl'} paddingBottom={2}>In the news</Heading>
                <Tooltip label='This news feed is served by Bing News.' 
                    fontSize='sm' padding={3}
                    hasArrow arrowSize={15} placement='left'
                    >
                    <InfoOutlineIcon px={2} w={9} h={9} />
                </Tooltip>
            </Flex>

            {newsData.map((news, index) => (
                <NewsListItem key={index} 
                    publication={news.provider[0].name.replace('on MSN.com', '')}
                    // Get time elapsed since each news published
                    datePublished={`${Math.round(Math.abs((new Date()).valueOf() - (new Date(news.datePublished)).valueOf()) / 36e5)}hr ago`}
                    imageUrl={news.image?.thumbnail.contentUrl} 
                    title={news.name}
                    url={news.url}
                />
            ))}
        </Stack>
    )
}

export default NewsList