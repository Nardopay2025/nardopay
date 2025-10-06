import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface MerchantNotificationProps {
  merchantName: string
  customerName: string
  customerEmail: string
  amount: string
  currency: string
  productName: string
  reference: string
  paymentMethod: string
  businessName: string
}

export const MerchantNotification = ({
  merchantName,
  customerName,
  customerEmail,
  amount,
  currency,
  productName,
  reference,
  paymentMethod,
  businessName,
}: MerchantNotificationProps) => (
  <Html>
    <Head />
    <Preview>🎉 New payment of {currency} {amount} received!</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Text style={logo}>NardoPay</Text>
        </Section>

        {/* Success Banner */}
        <Section style={successBanner}>
          <Text style={successIcon}>✓</Text>
          <Heading style={successTitle}>Payment Received!</Heading>
          <Text style={successSubtitle}>
            {currency} {amount}
          </Text>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Text style={greeting}>Hi {merchantName},</Text>
          
          <Text style={paragraph}>
            Great news! You have received a new payment through {businessName}.
          </Text>

          {/* Payment Details Card */}
          <Section style={card}>
            <Text style={cardTitle}>Payment Details</Text>
            <Hr style={divider} />
            
            <Section style={detailRow}>
              <Text style={label}>Amount</Text>
              <Text style={value}>{currency} {amount}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Product</Text>
              <Text style={value}>{productName}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Payment Method</Text>
              <Text style={value}>{paymentMethod}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Reference</Text>
              <Text style={valueSmall}>{reference}</Text>
            </Section>
          </Section>

          {/* Customer Info Card */}
          <Section style={card}>
            <Text style={cardTitle}>Customer Information</Text>
            <Hr style={divider} />
            
            <Section style={detailRow}>
              <Text style={label}>Name</Text>
              <Text style={value}>{customerName}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Email</Text>
              <Text style={value}>{customerEmail}</Text>
            </Section>
          </Section>

          <Text style={paragraph}>
            The funds will be available in your NardoPay balance and ready for withdrawal.
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            This is an automated notification from NardoPay
          </Text>
          <Text style={footerText}>
            © 2025 NardoPay. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default MerchantNotification

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#0EA5E9',
  padding: '20px',
  textAlign: 'center' as const,
}

const logo = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
}

const successBanner = {
  backgroundColor: '#10B981',
  padding: '30px 20px',
  textAlign: 'center' as const,
}

const successIcon = {
  color: '#ffffff',
  fontSize: '48px',
  fontWeight: 'bold',
  margin: '0 0 10px',
}

const successTitle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 5px',
}

const successSubtitle = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0',
}

const content = {
  padding: '30px 40px',
}

const greeting = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '16px',
}

const paragraph = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '20px',
}

const card = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
}

const cardTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
}

const divider = {
  borderColor: '#e5e7eb',
  margin: '0 0 16px',
}

const detailRow = {
  marginBottom: '12px',
}

const label = {
  color: '#6b7280',
  fontSize: '13px',
  fontWeight: '500',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
}

const value = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0',
}

const valueSmall = {
  color: '#1f2937',
  fontSize: '13px',
  margin: '0',
  wordBreak: 'break-all' as const,
}

const footer = {
  backgroundColor: '#f9fafb',
  padding: '30px 40px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '4px 0',
}
