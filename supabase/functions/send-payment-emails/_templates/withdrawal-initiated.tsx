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
} from 'https://esm.sh/@react-email/components@0.0.22'
import * as React from 'https://esm.sh/react@18.3.1'

interface WithdrawalInitiatedProps {
  merchantName: string
  amount: string
  currency: string
  feeAmount: string
  netAmount: string
  accountType: string
  accountDetails: string
  reference: string
}

export const WithdrawalInitiated = ({
  merchantName,
  amount,
  currency,
  feeAmount,
  netAmount,
  accountType,
  accountDetails,
  reference,
}: WithdrawalInitiatedProps) => (
  <Html>
    <Head />
    <Preview>Withdrawal of {currency} {amount} is being processed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logo}>NardoPay</Text>
        </Section>

        <Section style={infoBanner}>
          <Text style={infoIcon}>⏳</Text>
          <Heading style={infoTitle}>Withdrawal Initiated</Heading>
          <Text style={infoSubtitle}>
            {currency} {netAmount}
          </Text>
        </Section>

        <Section style={content}>
          <Text style={greeting}>Hi {merchantName},</Text>
          
          <Text style={paragraph}>
            Your withdrawal request has been received and is being processed.
          </Text>

          <Section style={card}>
            <Text style={cardTitle}>Withdrawal Details</Text>
            <Hr style={divider} />
            
            <Section style={detailRow}>
              <Text style={label}>Withdrawal Amount</Text>
              <Text style={value}>{currency} {amount}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Processing Fee</Text>
              <Text style={value}>{currency} {feeAmount}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Amount to Receive</Text>
              <Text style={valueHighlight}>{currency} {netAmount}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Destination</Text>
              <Text style={value}>{accountType}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Account</Text>
              <Text style={value}>{accountDetails}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Reference</Text>
              <Text style={valueSmall}>{reference}</Text>
            </Section>
          </Section>

          <Text style={paragraph}>
            Your funds are typically processed within 1-2 business days. You'll receive another email once the transfer is complete.
          </Text>
        </Section>

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

export default WithdrawalInitiated

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

const infoBanner = {
  backgroundColor: '#F59E0B',
  padding: '30px 20px',
  textAlign: 'center' as const,
}

const infoIcon = {
  color: '#ffffff',
  fontSize: '48px',
  margin: '0 0 10px',
}

const infoTitle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 5px',
}

const infoSubtitle = {
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

const valueHighlight = {
  color: '#0EA5E9',
  fontSize: '18px',
  fontWeight: '600',
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
