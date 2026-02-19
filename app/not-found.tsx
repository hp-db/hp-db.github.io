import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-lg text-muted-foreground mb-6">Page not found</p>
              <Button asChild>
                <Link href="/en/">Go to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
