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
export async function getStaticPaths() {
  const allEvents= getEvents();
  return {
    // Get the paths to pre-render based on products at build time
    paths: allEvents.map((event: any) => `/trade/${event.eventId}`),
    fallback: false,
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  const response = await fetch(`${baseURL}/api/fetchEventData`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
  });
  console.log(response)
  const event = await response.json()
  
  return { props: { event } }
}

export default function Slug({ event }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  
  return router.isFallback ? (
    <h1>Loading...</h1>
  ) : (
    <MarketView market={event} />
  )
}