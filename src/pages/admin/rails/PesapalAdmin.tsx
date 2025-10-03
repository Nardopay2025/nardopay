import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function PesapalAdmin() {
  const navigate = useNavigate()
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [status, setStatus] = useState<'checking'|'ok'|'needs_setup'|'error'>('checking')
  const [running, setRunning] = useState(false)

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return navigate('/login')
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      const isAdmin = profile?.role === 'admin'
      setAllowed(isAdmin)
      if (!isAdmin) return

      // Health check
      const { data, error } = await supabase.functions.invoke('pesapal-submit-order', { body: { test: true } })
      if (error) {
        if (error.message?.includes('Missing') || error.message?.includes('configuration')) setStatus('needs_setup')
        else setStatus('error')
      } else {
        setStatus(data?.configured ? 'ok' : 'needs_setup')
      }
    }
    run()
  }, [navigate])

  const registerIPN = async () => {
    setRunning(true)
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pesapal-ipn`
      const { data, error } = await supabase.functions.invoke('pesapal-register-ipn', { body: { ipnUrl: url } })
      if (error) throw error
      // Admin then adds returned ipn_id to Supabase function secret: PESAPAL_IPN_ID
      setStatus('ok')
    } catch (e: any) {
      setStatus('error')
    } finally {
      setRunning(false)
    }
  }

  if (allowed === null) return null
  if (!allowed) return <div className="p-8">Unauthorized</div>

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Pesapal</h2>
          {status === 'checking' && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Checking…</div>}
          {status === 'ok' && <div className="flex items-center gap-2 text-green-600"><CheckCircle2 className="h-4 w-4" /> Configured</div>}
          {status === 'needs_setup' && <div className="flex items-center gap-2 text-amber-600"><AlertCircle className="h-4 w-4" /> Needs setup</div>}
          {status === 'error' && <div className="flex items-center gap-2 text-red-600"><AlertCircle className="h-4 w-4" /> Error</div>}
        </div>
        <p className="text-sm text-muted-foreground">Register IPN and verify environment secrets. No secrets are shown here.</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={registerIPN} disabled={running}>
            {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Register IPN
          </Button>
          <Button variant="outline" onClick={() => window.open('/PESAPAL_SETUP.md','_blank')}>View Setup Guide</Button>
        </div>
      </Card>
    </div>
  )
}


