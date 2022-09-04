import type { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import MarketView from 'components/MarketView';
import { fetchEventData } from 'lib/api';
import { baseURL } from 'config';
import events from "../api/events.json";

function getEvents() {
  const allEvents = events.map((event) => {

    const { ...props } = event;
    return props
  });

  return allEvents;
}

// This gets called at build time
export const getStaticPaths = async () => {
  const allEvents= getEvents();
  return {
    // Get the paths to pre-render based on products at build time
    paths: allEvents.map((event: any) => `/trade/${event.eventId}`),
    fallback: false,
  }
}

// should not call an internal API route inside getStaticProps
export const getStaticProps = async ({ params: { slug } }) => {
  const event = events.filter((item) => item.eventId === slug)[0]
  console.log("Event", event)
  const { ...props } = event
  return { props: { props } }
}

export default function Slug({ props }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  
  return router.isFallback ? (
    <h1>Loading...</h1>
  ) : (
    <MarketView market={props} />
  )
}