import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface GameLinkEmailProps {
  link: string;
  loverName?: string;
}

export default function GameLinkEmail({ link, loverName }: GameLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Seu Amorzin está pronto — aqui está o link 💛</Preview>
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
          <Text style={{ fontSize: 24, textAlign: "center", margin: 0 }}>🏹💘</Text>
          <Heading style={{ fontSize: 22, color: "#35131F", textAlign: "center", margin: "16px 0" }}>
            Seu Amorzin está pronto!
          </Heading>
          <Text style={{ fontSize: 14, color: "#8F747C", textAlign: "center", lineHeight: 1.6 }}>
            {loverName
              ? `Prontinho pra você compartilhar com ${loverName}.`
              : "Prontinho pra você compartilhar."}
            {" "}Guarde esse link — ele é a forma de acessar (e reenviar, se precisar) seu jogo.
          </Text>
          <Section style={{ textAlign: "center", margin: "28px 0" }}>
            <Button
              href={link}
              style={{
                backgroundColor: "#E6395B",
                color: "#ffffff",
                borderRadius: 999,
                padding: "14px 32px",
                fontSize: 14,
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Ver meu Amorzin
            </Button>
          </Section>
          <Text style={{ fontSize: 11, color: "#A1888F", textAlign: "center", wordBreak: "break-all" }}>
            {link}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}