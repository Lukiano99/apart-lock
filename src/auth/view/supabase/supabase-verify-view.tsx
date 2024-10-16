"use client";

import { paths } from "src/routes/paths";

import { EmailInboxIcon } from "src/assets/icons";

import { FormHead } from "../../components/form-head";
import { FormReturnLink } from "../../components/form-return-link";

// ----------------------------------------------------------------------

export function SupabaseVerifyView() {
  return (
    <>
      <FormHead
        icon={<EmailInboxIcon />}
        title="Proverite svoj email!"
        description={`Poslali smo vam 6-cifreni potvrdni kod putem emaila.\nUnesite kod u polje ispod kako biste verifikovali svoju email adresu.`}
      />

      <FormReturnLink href={paths.auth.supabase.signIn} sx={{ mt: 0 }} />
    </>
  );
}
