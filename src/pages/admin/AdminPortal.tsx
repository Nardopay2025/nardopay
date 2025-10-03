import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminPortal() {
  const navigate = useNavigate()
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return navigate('/login')
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      setAllowed(profile?.role === 'admin')
    }
    run()
  }, [navigate])

  if (allowed === null) return null
  if (!allowed) return <div className="p-8">Unauthorized</div>

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Rails Configuration</h2>
        <p className="text-sm text-muted-foreground">Manage provider credentials, IPN/Callback URLs, and health checks.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Button variant="outline" onClick={() => navigate('/admin/rails/pesapal')}>Pesapal</Button>
          <Button variant="outline" onClick={() => navigate('/admin/rails/paystack')}>Paystack</Button>
          <Button variant="outline" onClick={() => navigate('/admin/rails/flutterwave')}>Flutterwave</Button>
          <Button variant="outline" onClick={() => navigate('/admin/rails/mtnmomo')}>MTN MoMo</Button>
        </div>
      </Card>
    </div>
  )
}


