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

interface WithdrawalStatusProps {
  merchantName: string
  amount: string
  currency: string
  status: 'completed' | 'failed'
  accountType: string
  accountDetails: string
  reference: string
  failureReason?: string
}

export const WithdrawalStatus = ({
  merchantName,
  amount,
  currency,
  status,
  accountType,
  accountDetails,
  reference,
  failureReason,
}: WithdrawalStatusProps) => (
  <Html>
    <Head />
    <Preview>
      {status === 'completed' 
        ? `Withdrawal of ${currency} ${amount} completed successfully` 
        : `Withdrawal of ${currency} ${amount} failed`
      }
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logo}>NardoPay</Text>
        </Section>

        <Section style={status === 'completed' ? successBanner : failureBanner}>
          <Text style={statusIcon}>{status === 'completed' ? '✓' : '✗'}</Text>
          <Heading style={statusTitle}>
            {status === 'completed' ? 'Withdrawal Complete!' : 'Withdrawal Failed'}
          </Heading>
          <Text style={statusSubtitle}>
            {currency} {amount}
          </Text>
        </Section>

        <Section style={content}>
          <Text style={greeting}>Hi {merchantName},</Text>
          
          <Text style={paragraph}>
            {status === 'completed' 
              ? 'Your withdrawal has been successfully processed and the funds have been sent to your account.'
              : 'Unfortunately, your withdrawal could not be processed at this time.'
            }
          </Text>

          <Section style={card}>
            <Text style={cardTitle}>Withdrawal Details</Text>
            <Hr style={divider} />
            
            <Section style={detailRow}>
              <Text style={label}>Amount</Text>
              <Text style={value}>{currency} {amount}</Text>
            </Section>
            
            <Section style={detailRow}>
              <Text style={label}>Status</Text>
              <Text style={status === 'completed' ? valueSuccess : valueFailed}>
                {status === 'completed' ? 'Completed' : 'Failed'}
              </Text>
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

            {status === 'failed' && failureReason && (
              <Section style={detailRow}>
                <Text style={label}>Reason</Text>
                <Text style={valueFailed}>{failureReason}</Text>
              </Section>
            )}
          </Section>

          {status === 'completed' ? (
            <Text style={paragraph}>
              The funds should appear in your account within 1-2 business days depending on your financial institution.
            </Text>
          ) : (
            <Text style={paragraph}>
              Your balance has been refunded. Please check your account details and try again, or contact support if you continue to experience issues.
            </Text>
          )}
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

export default WithdrawalStatus

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

const failureBanner = {
  backgroundColor: '#EF4444',
  padding: '30px 20px',
  textAlign: 'center' as const,
}

const statusIcon = {
  color: '#ffffff',
  fontSize: '48px',
  fontWeight: 'bold',
  margin: '0 0 10px',
}

const statusTitle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 5px',
}

const statusSubtitle = {
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

const valueSuccess = {
  color: '#10B981',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
}

const valueFailed = {
  color: '#EF4444',
  fontSize: '16px',
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
