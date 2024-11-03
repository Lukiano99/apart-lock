import PageNotFoundIllustration from "@/assets/illustrations/page-not-found-illustration";
import { MotionContainer, varBounce } from "@/components/animate";
import { SimpleLayout } from "@/layouts/simple";
import { RouterLink } from "@/routes/components";
import { Button, Container, Typography } from "@mui/material";
import { m } from "framer-motion";

const CanceledReservation = () => {
  return (
    <Container
      component={MotionContainer}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        py: 5,
      }}
    >
      <m.div variants={varBounce().in}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Nažalost, rezervacija je odbijena
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: "text.secondary" }}>
          Žao nam je što ovog puta nismo u mogućnosti da prihvatimo vašu
          rezervaciju. Radujemo se prilici da vas ugostimo u nekoj budućoj
          saradnji i zahvaljujemo vam na razumevanju. Ako imate dodatna pitanja
          ili želite da saznate više, slobodno nam se obratite. Do sledeće
          prilike, srdačno vas pozdravljamo!
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <PageNotFoundIllustration sx={{ my: { xs: 5, sm: 10 } }} />
      </m.div>

      <Button component={RouterLink} href="/" size="large" variant="contained">
        Nazad na apartmane
      </Button>
    </Container>
  );
};

export default CanceledReservation;
