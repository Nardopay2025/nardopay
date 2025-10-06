import React from 'npm:react@18.3.1'
import { Resend } from 'https://esm.sh/resend@4.0.0'
import { renderAsync } from 'https://esm.sh/@react-email/components@0.0.22'
import { MerchantNotification } from './_templates/merchant-notification.tsx'
import { CustomerReceipt } from './_templates/customer-receipt.tsx'

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

    console.log('Sending payment emails:', { merchantEmail, customerEmail, reference })

    // Send merchant notification
    const merchantHtml = await renderAsync(
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

    const merchantResult = await resend.emails.send({
      from: 'NardoPay <service@nardopay.com>',
      to: [merchantEmail],
      subject: `New Payment Received - ${currency} ${amount}`,
      html: merchantHtml,
    })

    if (merchantResult.error) {
      console.error('Error sending merchant email:', merchantResult.error)
    } else {
      console.log('Merchant email sent successfully')
    }

    // Send customer receipt
    const customerHtml = await renderAsync(
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

    const customerResult = await resend.emails.send({
      from: 'NardoPay <service@nardopay.com>',
      to: [customerEmail],
      subject: `Payment Receipt - ${businessName}`,
      html: customerHtml,
    })

    if (customerResult.error) {
      console.error('Error sending customer email:', customerResult.error)
    } else {
      console.log('Customer email sent successfully')
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        merchantEmailSent: !merchantResult.error,
        customerEmailSent: !customerResult.error,
      }), 
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
