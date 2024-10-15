"use client";

import { m } from "framer-motion";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { RouterLink } from "src/routes/components";

import { SimpleLayout } from "src/layouts/simple";
import { PageNotFoundIllustration } from "src/assets/illustrations";

import { varBounce, MotionContainer } from "src/components/animate";

// ----------------------------------------------------------------------

export function NotFoundView() {
  return (
    <SimpleLayout content={{ compact: true }}>
      <Container component={MotionContainer}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Izvinjavamo se, stranica nije pronađena!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: "text.secondary" }}>
            Nažalost, nismo uspeli da pronađemo stranicu koju tražite. Možda ste
            pogrešno uneli URL? Proverite još jednom unos kako biste bili
            sigurni da je sve ispravno napisano.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button
          component={RouterLink}
          href="/"
          size="large"
          variant="contained"
        >
          Go to home
        </Button>
      </Container>
    </SimpleLayout>
  );
}
