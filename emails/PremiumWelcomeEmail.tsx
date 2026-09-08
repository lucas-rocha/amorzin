import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";

export default function PremiumWelcomeEmail({ dashboardUrl }: { dashboardUrl: string }) {
  return (
    <Html>
      <Head />
      <Preview>Bem-vindo ao Amorzin Premium ✨</Preview>
      <Body style={{ backgroundColor: "#FFFCFA", fontFamily: "sans-serif", padding: "40px 0" }}>
        <Container
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            padding: "40px 32px",
            maxWidth: 480,
            border: "1px solid #f0dee0",
          }}
        >
          <Text style={{ fontSize: 24, textAlign: "center", margin: 0 }}>✨💛</Text>
          <Heading style={{ fontSize: 22, color: "#35131F", textAlign: "center", margin: "16px 0" }}>
            Sua conta Premium está ativa!
          </Heading>
          <Text style={{ fontSize: 14, color: "#8F747C", textAlign: "center", lineHeight: 1.6 }}>
            Agora você pode criar quantos Amorzins quiser, sem pagar de novo por cada um.
          </Text>
          <Section style={{ textAlign: "center", margin: "28px 0" }}>
            <Button
              href={dashboardUrl}
              style={{
                background: "linear-gradient(135deg, #E6395B, #9F1835)",
                color: "#ffffff",
                borderRadius: 999,
                padding: "14px 32px",
                fontSize: 14,
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Ir pro meu painel
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}