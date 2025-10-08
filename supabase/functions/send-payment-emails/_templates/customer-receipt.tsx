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
} from 'https://esm.sh/@react-email/components@0.0.22'
import * as React from 'https://esm.sh/react@18.3.1'

interface CustomerReceiptProps {
  customerName: string
  amount: string
  currency: string
  productName: string
  reference: string
  paymentMethod: string
  businessName: string
}

export const CustomerReceipt = ({
  customerName,
  amount,
  currency,
  productName,
  reference,
  paymentMethod,
  businessName,
}: CustomerReceiptProps) => (
  <Html>
    <Head />
    <Preview>Your payment receipt from {businessName}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Text style={logo}>NardoPay</Text>
        </Section>

        {/* Success Banner */}
        <Section style={successBanner}>
          <Text style={successIcon}>✓</Text>
          <Heading style={successTitle}>Payment Successful</Heading>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Text style={greeting}>Hi {customerName},</Text>
          
          <Text style={paragraph}>
            Thank you for your payment! This email confirms that your transaction was completed successfully.
          </Text>

          {/* Receipt Card */}
          <Section style={receiptCard}>
            <Text style={receiptTitle}>Payment Receipt</Text>
            <Hr style={divider} />
            
            <Section style={receiptRow}>
              <Text style={receiptLabel}>Merchant</Text>
              <Text style={receiptValue}>{businessName}</Text>
            </Section>
            
            <Section style={receiptRow}>
              <Text style={receiptLabel}>Product/Service</Text>
              <Text style={receiptValue}>{productName}</Text>
            </Section>
            
            <Section style={receiptRow}>
              <Text style={receiptLabel}>Payment Method</Text>
              <Text style={receiptValue}>{paymentMethod}</Text>
            </Section>

            <Hr style={totalDivider} />
            
            <Section style={totalRow}>
              <Text style={totalLabel}>Total Paid</Text>
              <Text style={totalAmount}>{currency} {amount}</Text>
            </Section>

            <Hr style={divider} />
            
            <Section style={receiptRow}>
              <Text style={receiptLabel}>Transaction ID</Text>
              <Text style={referenceValue}>{reference}</Text>
            </Section>
          </Section>

          <Text style={paragraph}>
            Please keep this email as proof of your purchase. If you have any questions about this transaction, please contact {businessName}.
          </Text>

          {/* Help Section */}
          <Section style={helpCard}>
            <Text style={helpTitle}>Need Help?</Text>
            <Text style={helpText}>
              If you did not authorize this payment or have concerns, please contact the merchant immediately.
            </Text>
          </Section>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            This receipt was sent by NardoPay on behalf of {businessName}
          </Text>
          <Text style={footerText}>
            © 2025 NardoPay. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default CustomerReceipt

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

const receiptCard = {
  backgroundColor: '#ffffff',
  border: '2px solid #e5e7eb',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '24px',
}

const receiptTitle = {
  color: '#0EA5E9',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
  textAlign: 'center' as const,
}

const divider = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
}

const totalDivider = {
  borderColor: '#e5e7eb',
  borderWidth: '2px',
  margin: '20px 0',
}

const receiptRow = {
  marginBottom: '12px',
}

const receiptLabel = {
  color: '#6b7280',
  fontSize: '13px',
  fontWeight: '500',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
}

const receiptValue = {
  color: '#1f2937',
  fontSize: '16px',
  margin: '0',
}

const referenceValue = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '0',
  wordBreak: 'break-all' as const,
}

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
}

const totalLabel = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
}

const totalAmount = {
  color: '#0EA5E9',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
}

const helpCard = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fbbf24',
  borderRadius: '8px',
  padding: '16px',
  marginTop: '24px',
}

const helpTitle = {
  color: '#92400e',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px',
}

const helpText = {
  color: '#78350f',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0',
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
