import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { 
    Flex, 
    Skeleton, 
    Stack, 
    useColorModeValue as mode,
} from '@chakra-ui/react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      display: false,
    },
  },
};

const labels = ['Oct 17', 'Oct 24', 'Oct 31', 'Nov 07', 'Nov 14', 'Nov 21', 'Nov 28'];

export const cumulativeReturnsData = {
  labels,
  datasets: [
    {
        label: 'Cumulative Returns Dataset',
        data: [369, 143, 720, 225, 62, 872, 331, 680, -7, 226],
        borderColor: 'rgb(159,122,234)',
        backgroundColor: 'rgba(159,122,234, 0.5)',
        tension: 0.1,
    },
  ],
};

export const weeklyReturnsData = {
    labels,
    datasets: [
      {
          label: 'Weekly Returns Data',
          data: [95, 70, 55, 69, 7, 61, -57, 63, -47, 35],
          borderColor: 'rgb(159,122,234)',
          backgroundColor: 'rgba(159,122,234, 0.5)',
          tension: 0.1,
      },
    ],
};

export const ReturnsGraph = () => {
  return (
    <Stack py={2} spacing={8}>
        <Flex>
            <Line
                options={options} 
                data={cumulativeReturnsData}
                height={55}
                fallbackContent={<Skeleton height={55} width={'full'} />}
            />
        </Flex>

        <Flex>
            <Bar 
                options={options} 
                data={weeklyReturnsData}
                height={55}
                fallbackContent={<Skeleton height={55} width={'full'} />}
            />
        </Flex>
    </Stack>
  )
}
