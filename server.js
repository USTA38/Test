const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Middleware für statische Dateien
app.use(express.static(path.join(__dirname)));

// Multer für FormData Verarbeitung
const upload = multer();

// Nodemailer Konfiguration
const transporter = nodemailer.createTransport({
    service: 'gmail', // oder 'smtp.gmail.com'
    auth: {
        user: 'IHRE_EMAIL@gmail.com', // Hier Ihre E-Mail-Adresse eintragen
        pass: 'IHR_PASSWORT' // Hier Ihr Passwort eintragen
    }
});

// E-Mail Templates
const adminEmailTemplate = (formData) => `
Neue Kontaktanfrage von der Website:

Name: ${formData.firstname} ${formData.lastname}
E-Mail: ${formData.email}
Telefon: ${formData.phone}

Nachricht:
${formData.message}
`;

const userEmailTemplate = `
Vielen Dank für deine Anfrage! Wir haben sie erhalten und freuen uns, bald mit dir zu sprechen. Diese Nachricht wurde automatisch verschickt.
`;

// Route für das Kontaktformular
app.post('/kontakt', upload.none(), async (req, res) => {
    try {
        const { firstname, lastname, email, phone, message } = req.body;

        // E-Mail an den Administrator
        await transporter.sendMail({
            from: 'IHRE_EMAIL@gmail.com', // Absender-E-Mail
            to: 'emre.uzunmod@gmail.com', // Ihre E-Mail-Adresse
            subject: 'Neue Kontaktanfrage von der Website',
            text: adminEmailTemplate(req.body)
        });

        // Automatische Antwort an den Benutzer
        await transporter.sendMail({
            from: 'IHRE_EMAIL@gmail.com', // Absender-E-Mail
            to: email, // E-Mail des Benutzers
            bcc: 'emre.uzunmod@gmail.com', // Kopie an Sie
            subject: 'Vielen Dank für Ihre Anfrage',
            text: userEmailTemplate
        });

        res.status(200).json({ message: 'E-Mail erfolgreich gesendet' });
    } catch (error) {
        console.error('Fehler beim E-Mail-Versand:', error);
        res.status(500).json({ error: 'Fehler beim Senden der E-Mail' });
    }
});

// Starte den Server
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
}); 