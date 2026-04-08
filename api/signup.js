export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, name } = req.body; 

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'SetupTV <support@setuptv.online>', // Когда привяжешь домен, измени на support@setuptv.online
        to: [email],
        subject: 'Регистрация в SetupTV',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Здравствуйте, ${name || 'пользователь'}!</h2>
            <p>Спасибо за регистрацию на нашем сайте.</p>
            <p>Скоро вам будет доступен ваш личный кабинет. Как только вы пройдете проверку, вам откроются все функции личного кабинета!</p>
            <p style="background-color: #fff3cd; padding: 10px; border-left: 5px solid #ffecb5;">
              <strong>Обращаем ваше внимание:</strong> это ваш личный кабинет, не передавайте ваш логин и пароль третьим лицам.
            </p>
            <hr />
            <p>По всем вопросам: <strong>setuptv@mail.ee</strong></p>
          </div>
        `,
      }),
    });

    if (response.ok) {
      return res.status(200).json({ message: 'Email sent successfully' });
    } else {
      const error = await response.json();
      return res.status(400).json(error);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
