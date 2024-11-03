import { fCurrency } from "../format-number";

interface passwordEmailTemplateProps {
  password: string;
  customerName: string;
  customerId: string;
  reservationId: string;
  createdAt: Date;
  checkInDate: Date;
  checkOutDate: Date;
  price: number;
}

export const createPasswordEmailTemplate = ({
  password,
  customerName,
  customerId,
  reservationId,
  createdAt,
  checkInDate,
  checkOutDate,
  price,
}: passwordEmailTemplateProps) => {
  const html = `<html lang="rs">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rezervacija kreirana ✅🎉</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <tr>
                <td style="padding: 20px; text-align: center;">
                    <h2 style="color: #333333;">Poštovani korisniče,</h2>
                    <h3 style="color: #333333;">Rezervacija je uspešno kreirana ✅🎉</h3>
                    <p style="color: #555555; font-size: 16px;">
                        Vaša soba čeka na vas sa ovom lozinkom 🤫
                    </p>
                    <p style="color: #fda92d; font-size: 24px; font-weight: bold; text-align: center; margin-top: 20px;">
                        ${password}
                    </p>
                    <p style="color: #555555; font-size: 14px; margin-top: 40px;">
                        Molimo vas da čuvate ovu šifru na sigurnom mestu i ne delite je s drugima.
                    </p>

                    <!-- Tabela sa dodatnim informacijama -->
                    <table width="100%" style="margin-top: 20px; font-size: 14px; color: #555555; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border-top: 1px solid #ddd; text-align: left;">Ime i prezime:</td>
                            <td style="padding: 8px; border-top: 1px solid #ddd; text-align: right;">${customerName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-top: 1px solid #ddd; text-align: left;">ID korisnika:</td>
                            <td style="padding: 8px; border-top: 1px solid #ddd; text-align: right;">${customerId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-top: 1px solid #ddd; text-align: left;">ID rezervacije:</td>
                            <td style="padding: 8px; border-top: 1px solid #ddd; text-align: right;">${reservationId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-top: 1px solid #ddd; text-align: left;">Datum kreiranja:</td>
                            <td style="padding: 8px; border-top: 1px solid #ddd; text-align: right;">${createdAt.toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-top: 1px solid #ddd; text-align: left;">Datum prijave:</td>
                            <td style="padding: 8px; border-top: 1px solid #ddd; text-align: right;">${checkInDate.toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-top: 1px solid #ddd; text-align: left;">Datum odjave:</td>
                            <td style="padding: 8px; border-top: 1px solid #ddd; text-align: right;">${checkOutDate.toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-top: 1px solid #ddd; text-align: left;">Cena:</td>
                            <td style="padding: 8px; border-top: 1px solid #ddd; text-align: right;">${fCurrency(price)}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>`;

  return html;
};

export const createCanceledReservationEmailTemplate = () => {
  const html = `<html lang="rs">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rezervacija Odbijena ❌🙁</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        
            <tr>
                <td style="padding: 20px; text-align: center;">
                    <h2 style="color: #333333;">Rezervacija Odbijena ❌🙁</h2>
                    <p style="color: #555555; font-size: 16px;">
                        Žao nam je što ovog puta nismo u mogućnosti da prihvatimo vašu rezervaciju.
                    </p>
                    <p style="color: #555555; font-size: 16px; margin-top: 10px;">
                        Radujemo se prilici da vas ugostimo u nekoj budućoj saradnji i zahvaljujemo vam na razumevanju. 
                    </p>
                    <p style="color: #555555; font-size: 16px; margin-top: 10px;">
                        Ako imate dodatna pitanja ili želite da saznate više, slobodno nam se obratite.
                    </p>
                    <p style="color: #555555; font-size: 14px; margin-top: 40px;">
                        Do sledeće prilike, srdačno vas pozdravljamo!
                    </p>
                </td>
            </tr>
        </table>
    </body>
  </html>`;

  return html;
};
