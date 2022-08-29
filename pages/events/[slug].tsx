import type { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import EventView from 'components/EventView';
import { fetchEventData } from 'lib/api';
import events from "../api/events.json";

function getEvents() {
  const allEvents = events.map((event) => {

    const { ...props } = event;
    return props
  });

  return allEvents;
}

// This gets called at build time
export async function getStaticPaths() {
  const allEvents= getEvents();
  return {
    // Get the paths to pre-render based on products at build time
    paths: allEvents.map((event: any) => `/events/${event.eventId}`),
    fallback: false,
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the product questionId
  const event = await fetchEventData(params.slug);
  if (!event) {
    throw new Error(`Event with ID '${params!.eventId}' not found`);
  }
  // Past product data to the page via props
  return { props: { event } }
}

export default function Slug({ event }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  
  return router.isFallback ? (
    <h1>Loading...</h1>
  ) : (
    <EventView market={event} />
  )
}