const BOT_NAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;
if (!BOT_NAME) {
  throw new Error('NEXT_PUBLIC_TELEGRAM_BOT_NAME muhit o\'zgaruvchisi sozlanmagan');
}

export function initTelegramLoginWidget(containerId) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    if (!BOT_NAME) {
      throw new Error('Bot username topilmadi. Administrator bilan bog\'laning.');
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', BOT_NAME.toLowerCase());
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-auth-url', 'http://127.0.0.1:3000/dashboard');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-lang', 'uz');
    return script;
  } catch (error) {
    console.error('Telegram widget yaratishda xatolik:', error);
    throw new Error('Telegram widget yaratib bo\'lmadi');
  }
}

export function isTelegramAuthorized() {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const authData = {
    id: params.get('id'),
    first_name: params.get('first_name'),
    last_name: params.get('last_name'),
    username: params.get('username'),
    photo_url: params.get('photo_url'),
    auth_date: params.get('auth_date'),
    hash: params.get('hash')
  };

  return Object.values(authData).some(Boolean) ? authData : null;
}

export async function verifyTelegramAuth(authData) {
  // In a real app, you would verify the hash on the server side
  return {
    success: true,
    user: {
      id: authData.id,
      firstName: authData.first_name,
      lastName: authData.last_name,
      username: authData.username,
      photoUrl: authData.photo_url
    }
  };
}

// Added the missing connectToTelegram function
export function connectToTelegram() {
  // Example implementation: Initialize the widget
  if (typeof window === 'undefined') return;
  const container = document.getElementById('telegram-connect');
  if (container) {
    const widget = initTelegramLoginWidget('telegram-widget');
    container.appendChild(widget);
  }
}
