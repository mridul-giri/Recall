# Recall

Recall is a Telegram Bot that helps you save and manage your links, images, videos, and documents efficiently. It also comes with a web dashboard for managing your saved content from the browser.

---

## Telegram Bot Commands

| Command    | Description                                                |
| ---------- | ---------------------------------------------------------- |
| `/start`   | Start the bot and create your account.                     |
| `/connect` | Connect your Telegram account to the Recall web dashboard. |

### Saving Content

Once the bot is running, simply send any of the following directly in chat — no commands needed:

- **Links** — Send a URL to save it.
- **Images** — Send a photo to save it.
- **Videos** — Send a video to save it.
- **Documents** — Send a file/document to save it.

---

## Connecting Telegram & Web

You can use Recall from **Telegram**, the **Web dashboard**, or **both**. To use both platforms with the same account, you need to connect them.

> [!CAUTION]
> **Do NOT create separate accounts on Telegram and Web.**
> Starting on both platforms independently will create two separate accounts with their own data. Always start on one platform and connect the other from there.

### How to Connect

1. **Start on one platform first** — either use `/start` on the Telegram bot, or sign up on the web dashboard.
2. **Connect the other platform:**
   - **From Telegram → Web:** Use the `/connect` command in the bot. It will send you a link — open it in your browser to connect your web account.
   - **From Web → Telegram:** Use the connect option on the web dashboard to link your Telegram account.

### Already Created Separate Accounts?

If you accidentally created accounts on both platforms separately:

1. **Delete your account from the web dashboard** (go to your profile and delete the account).
2. **Go back to Telegram** and use the `/connect` command.
3. This will create a properly linked account across both platforms.