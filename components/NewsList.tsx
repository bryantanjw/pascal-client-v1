import React, { useEffect, useState, Suspense } from 'react';
import {
  Box,
  Heading,
  Image,
  Text,
  Stack,
  Flex,
  Skeleton, SkeletonText,
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

// TODO: change client-side to server-side and add caching
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
                
                    <Flex>
                        <Image height={'100px'} width={'150px'}
                            borderRadius="md"
                            src={imageUrl}
                            alt={title}
                            objectFit="cover"
                            fallback={<Skeleton width={'150px'} height={'100px'} />}
                        />
                    </Flex>
                
                    <Stack
                        display="flex"
                        flex="1"
                        flexDirection="column"
                        px={2}
                        ml={4}>
                        <Suspense fallback={<SkeletonText width={'full'}/>}>
                            <HStack spacing={3}>
                                <Heading fontSize={'md'}>{publication}</Heading>
                                <Text fontSize={'sm'} fontWeight={'semibold'} color='gray'>{datePublished}</Text>
                            </HStack>
                        </Suspense>

                        <Suspense fallback={<SkeletonText width={'full'} />}>
                            <Text fontSize={'md'} marginTop="1">
                                {title}
                            </Text>
                        </Suspense>
                    </Stack>

            </Box>
        </Link>
    )
}

// TODO: add loading skeleton when fetching news data
export const NewsList = ({ market }) => {
    const [newsData, setNewsData] = useState<any[]>([])
    
    useEffect(() => {
        // Fetch news data from GNews API
        fetchNewsData(market.props.search_term, market.props.market_opened_date)
        .then(data => {
            setNewsData(data.articles)
            console.log("News Data", data.articles)
        })
    }, [market.props.search_term, market.props.market_opened_date])

    function timeElapsed(time) {
        const now = new Date()
        const publishedTime = new Date(time)
        const timeDiff = (now.getTime() - publishedTime.getTime()) / (1000 * 60) // minutes

        if (timeDiff >= 60 && timeDiff < 1440) {
            return `${Math.floor(timeDiff / 60)} hours`
        } else if (timeDiff >= 1440) {
            return `${Math.floor(timeDiff / (60 * 24))} days`
        }

        return `${Math.floor(timeDiff)} minutes`
    }

    return (
        <Stack paddingTop={16}>
            <Flex justify={'space-between'}>
                <Heading fontSize={'2xl'} paddingBottom={2}>In the news</Heading>
                <Tooltip label='This news feed is served by Google News.' 
                    fontSize='sm' padding={3}
                    hasArrow arrowSize={15} placement='left'
                    >
                    <InfoOutlineIcon px={2} w={9} h={9} />
                </Tooltip>
            </Flex>

            {newsData.length > 0 
                ? (newsData.map((news, index) => (
                    <NewsListItem key={index} 
                        publication={news.source.name}
                        // Get time elapsed since each news published
                        datePublished={`${timeElapsed(news.publishedAt)} ago`}
                        imageUrl={news?.urlToImage} 
                        title={news.title}
                        url={news.url}
                    />
                ))) 
                : (<Text fontSize={'md'}>No news article found 😕</Text>)
            }
        </Stack>
    )
}

export default NewsList