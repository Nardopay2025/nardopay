import React from 'npm:react@18.3.1'
import { Resend } from 'https://esm.sh/resend@4.0.0'
import { renderAsync } from 'https://esm.sh/@react-email/components@0.0.22'
import { ConfirmationEmail } from './_templates/confirmation-email.tsx'
import { MagicLinkEmail } from './_templates/magic-link-email.tsx'
import { PasswordResetEmail } from './_templates/password-reset-email.tsx'
import { EmailChangeEmail } from './_templates/email-change-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 })
  }

  try {
    const payload = await req.json()
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = payload as {
      user: {
        email: string
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
      }
    }

    console.log('Processing email:', { email_action_type, email: user.email })

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    let html = ''
    let subject = ''

    // Choose template based on email type
    switch (email_action_type) {
      case 'signup':
        html = await renderAsync(
          React.createElement(ConfirmationEmail, {
            supabase_url: supabaseUrl,
            token_hash,
            redirect_to,
            email_action_type,
          })
        )
        subject = 'Confirm your NardoPay account'
        break

      case 'magiclink':
        html = await renderAsync(
          React.createElement(MagicLinkEmail, {
            supabase_url: supabaseUrl,
            token,
            token_hash,
            redirect_to,
            email_action_type,
          })
        )
        subject = 'Your NardoPay magic link'
        break

      case 'recovery':
        html = await renderAsync(
          React.createElement(PasswordResetEmail, {
            supabase_url: supabaseUrl,
            token_hash,
            redirect_to,
            email_action_type,
          })
        )
        subject = 'Reset your NardoPay password'
        break

      case 'email_change':
        html = await renderAsync(
          React.createElement(EmailChangeEmail, {
            supabase_url: supabaseUrl,
            token_hash,
            redirect_to,
            email_action_type,
          })
        )
        subject = 'Confirm your email change'
        break

      default:
        throw new Error(`Unknown email action type: ${email_action_type}`)
    }

    const { error } = await resend.emails.send({
      from: 'NardoPay <onboarding@resend.dev>',
      to: [user.email],
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully:', { email_action_type, email: user.email })

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Error in send-auth-email function:', error)
    return new Response(
      JSON.stringify({
        error: {
          http_code: error.code,
          message: error.message,
        },
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
