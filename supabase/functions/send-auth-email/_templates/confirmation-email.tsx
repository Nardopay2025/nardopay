import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'https://esm.sh/@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ConfirmationEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
}

export const ConfirmationEmail = ({
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
}: ConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirm your NardoPay account - Get started accepting payments globally</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with brand */}
        <Section style={header}>
          <Section style={logoContainer}>
            <Text style={logo}>N</Text>
          </Section>
          <Heading style={brandName}>NardoPay</Heading>
          <Text style={tagline}>Accept Payments Globally</Text>
        </Section>
        
        {/* Main content */}
        <Section style={content}>
          <Heading style={h1}>Welcome to NardoPay! 🎉</Heading>
          
          <Text style={paragraph}>
            Thank you for creating your account. We're thrilled to have you join our global payment platform!
          </Text>
          
          <Text style={paragraph}>
            You're just one step away from accepting payments from customers worldwide. Please verify your email address to activate your account:
          </Text>
          
          <Section style={buttonContainer}>
            <Button
              style={button}
              href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
            >
              Verify Email Address
            </Button>
          </Section>
          
          <Text style={securityNote}>
            🔒 This link will expire in 24 hours for security purposes.
          </Text>
          
          {/* Features highlight */}
          <Section style={featuresSection}>
            <Text style={featuresTitle}>What you can do with NardoPay:</Text>
            <Text style={feature}>✓ Accept payments in multiple currencies</Text>
            <Text style={feature}>✓ Create custom payment links instantly</Text>
            <Text style={feature}>✓ Track your transactions in real-time</Text>
            <Text style={feature}>✓ Withdraw funds to your local bank account</Text>
          </Section>
          
          <Section style={divider} />
          
          <Text style={alternativeText}>
            If the button doesn't work, copy and paste this link into your browser:
          </Text>
          
          <Text style={linkText}>
            {`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
          </Text>
        </Section>
        
        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            If you didn't create a NardoPay account, please ignore this email or contact our support team.
          </Text>
          
          <Text style={footerCopyright}>
            © 2025 NardoPay. All rights reserved.
          </Text>
          
          <Text style={footerLinks}>
            <Link href="https://nardopay.com/privacy" style={footerLink}>Privacy Policy</Link>
            {' · '}
            <Link href="https://nardopay.com/terms" style={footerLink}>Terms of Service</Link>
            {' · '}
            <Link href="https://nardopay.com/contact" style={footerLink}>Contact Us</Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ConfirmationEmail

const main = {
  backgroundColor: '#0a0f1e',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '20px 0',
}

const container = {
  backgroundColor: '#1a1f35',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(6, 182, 212, 0.2)',
}

const header = {
  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  padding: '40px 20px',
  textAlign: 'center' as const,
}

const logoContainer = {
  margin: '0 auto 16px',
  width: '64px',
  height: '64px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(10px)',
}

const logo = {
  color: '#ffffff',
  fontSize: '36px',
  fontWeight: '700',
  margin: '0',
  lineHeight: '64px',
  textAlign: 'center' as const,
}

const brandName = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
}

const tagline = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '14px',
  fontWeight: '400',
  margin: '0',
  textAlign: 'center' as const,
}

const content = {
  padding: '40px 32px',
}

const h1 = {
  color: '#ffffff',
  fontSize: '26px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
}

const paragraph = {
  color: '#cbd5e1',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#06b6d4',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 48px',
  boxShadow: '0 4px 12px rgba(6, 182, 212, 0.4)',
  transition: 'all 0.3s ease',
}

const securityNote = {
  color: '#94a3b8',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '16px 0 32px 0',
}

const featuresSection = {
  backgroundColor: 'rgba(6, 182, 212, 0.1)',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 0',
  border: '1px solid rgba(6, 182, 212, 0.2)',
}

const featuresTitle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 16px 0',
}

const feature = {
  color: '#cbd5e1',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '8px 0',
}

const divider = {
  borderTop: '1px solid rgba(203, 213, 225, 0.2)',
  margin: '32px 0',
}

const alternativeText = {
  color: '#94a3b8',
  fontSize: '14px',
  margin: '24px 0 12px 0',
  textAlign: 'center' as const,
}

const linkText = {
  color: '#06b6d4',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '0 0 24px 0',
  wordBreak: 'break-all' as const,
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
  backgroundColor: 'rgba(6, 182, 212, 0.1)',
  borderRadius: '6px',
  border: '1px solid rgba(6, 182, 212, 0.2)',
}

const footer = {
  backgroundColor: 'rgba(15, 23, 42, 0.5)',
  padding: '32px 32px 24px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 16px 0',
}

const footerCopyright = {
  color: '#64748b',
  fontSize: '13px',
  margin: '0 0 12px 0',
}

const footerLinks = {
  color: '#94a3b8',
  fontSize: '13px',
  margin: '0',
}

const footerLink = {
  color: '#06b6d4',
  textDecoration: 'none',
}
