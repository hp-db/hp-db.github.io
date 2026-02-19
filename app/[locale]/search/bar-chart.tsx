'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import {
  Chart as ChartJS,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function BarChart({
  buckets,
  height = 200,
}: {
  buckets: { key: string; doc_count: number }[]
  height?: number
}) {
  const t = useTranslations()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<ChartJS | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const labels = buckets.map((b) => b.key)
    const data = buckets.map((b) => b.doc_count)

    chartRef.current = new ChartJS(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data,
            label: t('items'),
            backgroundColor: 'rgba(13, 148, 136, 0.5)',
            borderColor: 'rgba(13, 148, 136, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [buckets, t])

  return <canvas ref={canvasRef} style={{ height }} />
}
