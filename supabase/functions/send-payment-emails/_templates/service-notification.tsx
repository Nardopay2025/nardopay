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

interface ServiceNotificationProps {
  message: string
}

export const ServiceNotification = ({
  message,
}: ServiceNotificationProps) => (
  <Html>
    <Head />
    <Preview>NardoPay Service Availability Update</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Text style={logo}>NardoPay</Text>
        </Section>

        {/* Info Banner */}
        <Section style={infoBanner}>
          <Text style={infoIcon}>ℹ️</Text>
          <Heading style={infoTitle}>Service Availability</Heading>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Text style={greeting}>Hello,</Text>
          
          <Text style={paragraph}>
            {message}
          </Text>

          <Text style={paragraph}>
            We're working hard to expand our services to more countries. Thank you for your interest in NardoPay!
          </Text>

          <Text style={paragraph}>
            If you have any questions or would like to learn more about our services, please don't hesitate to reach out to our support team.
          </Text>

          <Section style={buttonContainer}>
            <Link href="https://nardopay.com/contact" style={button}>
              Contact Support
            </Link>
          </Section>
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

export default ServiceNotification

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
  fontWeight: 'bold',
  margin: '0 0 10px',
}

const infoTitle = {
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

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '30px',
  marginBottom: '20px',
}

const button = {
  backgroundColor: '#0EA5E9',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '12px 24px',
  display: 'inline-block',
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

