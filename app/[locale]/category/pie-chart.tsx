'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import {
  Chart as ChartJS,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(PieController, ArcElement, Tooltip, Legend)

export function PieChart({
  buckets,
  height = 400,
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

    const tealPalette = [
      'rgba(13, 148, 136, 0.8)',
      'rgba(20, 184, 166, 0.8)',
      'rgba(94, 234, 212, 0.8)',
      'rgba(153, 246, 228, 0.8)',
      'rgba(204, 251, 241, 0.8)',
      'rgba(13, 148, 136, 0.5)',
      'rgba(20, 184, 166, 0.5)',
      'rgba(94, 234, 212, 0.5)',
      'rgba(15, 118, 110, 0.8)',
      'rgba(17, 94, 89, 0.8)',
    ]

    const backgroundColors = data.map((_, i) => tealPalette[i % tealPalette.length])

    chartRef.current = new ChartJS(canvasRef.current, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            label: t('items'),
            backgroundColor: backgroundColors,
            borderColor: '#ffffff',
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
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
