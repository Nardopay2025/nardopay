import React from 'npm:react@18.3.1'
import { Resend } from 'https://esm.sh/resend@4.0.0'
import { renderAsync } from 'https://esm.sh/@react-email/components@0.0.22'
import { MerchantNotification } from './_templates/merchant-notification.tsx'
import { CustomerReceipt } from './_templates/customer-receipt.tsx'
import { WithdrawalInitiated } from './_templates/withdrawal-initiated.tsx'
import { WithdrawalStatus } from './_templates/withdrawal-status.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 })
  }

  try {
    const payload = await req.json()
    const { type } = payload

    console.log('Sending email:', { type })

    let subject = ''
    let html = ''
    let to = payload.to

    if (type === 'merchant-notification') {
      const {
        merchantEmail,
        merchantName,
        customerEmail,
        customerName,
        amount,
        currency,
        productName,
        reference,
        paymentMethod,
        businessName,
      } = payload

      subject = `New Payment Received - ${currency} ${amount}`
      html = await renderAsync(
        React.createElement(MerchantNotification, {
          merchantName,
          customerName,
          customerEmail,
          amount,
          currency,
          productName,
          reference,
          paymentMethod,
          businessName,
        })
      )
      to = merchantEmail
    } else if (type === 'customer-receipt') {
      const {
        customerEmail,
        customerName,
        amount,
        currency,
        productName,
        reference,
        paymentMethod,
        businessName,
      } = payload

      subject = `Payment Receipt - ${businessName}`
      html = await renderAsync(
        React.createElement(CustomerReceipt, {
          customerName,
          amount,
          currency,
          productName,
          reference,
          paymentMethod,
          businessName,
        })
      )
      to = customerEmail
    } else if (type === 'withdrawal-initiated') {
      const {
        merchantName,
        amount,
        currency,
        feeAmount,
        netAmount,
        accountType,
        accountDetails,
        reference,
      } = payload

      subject = `Withdrawal Processing - ${currency} ${netAmount}`
      html = await renderAsync(
        React.createElement(WithdrawalInitiated, {
          merchantName,
          amount,
          currency,
          feeAmount,
          netAmount,
          accountType,
          accountDetails,
          reference,
        })
      )
    } else if (type === 'withdrawal-status') {
      const {
        merchantName,
        amount,
        currency,
        status,
        accountType,
        accountDetails,
        reference,
        failureReason,
      } = payload

      subject = status === 'completed' 
        ? `✓ Withdrawal Complete - ${currency} ${amount}`
        : `✗ Withdrawal Failed - ${currency} ${amount}`
      
      html = await renderAsync(
        React.createElement(WithdrawalStatus, {
          merchantName,
          amount,
          currency,
          status,
          accountType,
          accountDetails,
          reference,
          failureReason,
        })
      )
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid email type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = await resend.emails.send({
      from: 'NardoPay <service@nardopay.com>',
      to: [to],
      subject,
      html,
    })

    if (result.error) {
      console.error('Error sending email:', result.error)
      throw new Error(result.error.message)
    }

    console.log('Email sent successfully')

    return new Response(
      JSON.stringify({ success: true }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  } catch (error: any) {
    console.error('Error in send-payment-emails function:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})
