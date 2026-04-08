export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, name, service } = req.body; 
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'SetupTV <support@setuptv.online>',
        to: [email],
        subject: 'Напоминание об оплате за год - SetupTV',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #1877f2;">Здравствуйте, ${name || 'клиент'}!</h2>
            <p>Напоминаем вам, что подходит срок оплаты за <b>следующий год</b> пользования услугами <b>IDA TV</b>.</p>
            <p><b>Ваша услуга:</b> ${service || 'Пакет каналов'}</p>
            <p>Чтобы доступ к трансляциям оставался активным на весь следующий год, просим вас произвести оплату в ближайшее время.</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <strong>Реквизиты для оплаты:</strong><br>
              Уточнить реквизиты или подтвердить оплату можно, ответив на это письмо.
            </div>
            <p>Если вы уже произвели оплату, пожалуйста, проигнорируйте это сообщение.</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #777;">С уважением, команда <b>SetupTV</b><br>
            Info E-mail: support@setuptv.online</p>
          </div>
        `,
      }),
    });

    if (response.ok) {
      return res.status(200).json({ message: 'Reminder sent' });
    } else {
      const error = await response.json();
      return res.status(400).json(error);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
