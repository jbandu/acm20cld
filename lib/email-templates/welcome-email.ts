interface User {
  name: string;
  email: string;
  id: string;
}

export function generateWelcomeEmail(user: User, loginToken: string): { subject: string; html: string; text: string } {
  const loginUrl = `${process.env.NEXT_PUBLIC_URL}/auth/token/${loginToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); padding: 40px; text-center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px; max-width: 600px; margin: 0 auto; }
          .button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .benefits { background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .signature { margin-top: 40px; padding-top: 20px; border-top: 2px solid #E5E7EB; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Welcome to ACM 2.0</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Your AI Research Partner</p>
        </div>

        <div class="content">
          <p>Hi ${user.name},</p>

          <p>I'm excited to welcome you to ACM 2.0 - your new AI-powered research intelligence platform.</p>

          <div class="benefits">
            <h3>What ACM 2.0 Does for You:</h3>
            <ul>
              <li><strong>Multi-Source Search:</strong> Query 40M+ papers across OpenAlex, PubMed, and more</li>
              <li><strong>AI Analysis:</strong> Get intelligent summaries from Claude, GPT-4, and other LLMs</li>
              <li><strong>Time Savings:</strong> Turn 3-hour literature reviews into 30-second queries</li>
            </ul>
          </div>

          <h3>Quick Start (4 steps, 2 minutes):</h3>
          <ol>
            <li>Click the button below to access your account</li>
            <li>Ask your first research question</li>
            <li>Review AI-analyzed results</li>
            <li>Explore suggested follow-up questions</li>
          </ol>

          <div style="text-align: center;">
            <a href="${loginUrl}" class="button">Access ACM 2.0</a>
          </div>

          <div class="signature">
            <p>Let's accelerate cancer research together.</p>
            <p><strong>Madhavan Nallani</strong><br>CEO, ACM Biolabs</p>
            <p style="font-size: 14px; color: #6B7280; margin-top: 20px;">P.S. We're in beta - your feedback will directly shape the platform.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Welcome to ACM 2.0, ${user.name}!

I'm excited to welcome you to ACM 2.0 - your new AI-powered research intelligence platform.

What ACM 2.0 Does for You:
• Multi-Source Search: Query 40M+ papers across OpenAlex, PubMed, and more
• AI Analysis: Get intelligent summaries from Claude, GPT-4, and other LLMs
• Time Savings: Turn 3-hour literature reviews into 30-second queries

Quick Start:
1. Click this link to access your account: ${loginUrl}
2. Ask your first research question
3. Review AI-analyzed results
4. Explore suggested follow-up questions

Let's accelerate cancer research together.

Madhavan Nallani
CEO, ACM Biolabs

P.S. We're in beta - your feedback will directly shape the platform.
  `;

  return {
    subject: "Welcome to ACM 2.0 - Your New AI Research Partner",
    html,
    text,
  };
}

export function generateReminderEmail(user: User, newPapersCount: number, fieldName: string): { subject: string; html: string; text: string } {
  return {
    subject: `Haven't seen you on ACM 2.0! ${newPapersCount} new ${fieldName} papers`,
    html: `<p>Hi ${user.name},</p><p>While you were away, ${newPapersCount} new papers were published in ${fieldName}.</p><p><a href="${process.env.NEXT_PUBLIC_URL}/researcher">Catch up in 30 seconds →</a></p>`,
    text: `Hi ${user.name}, while you were away, ${newPapersCount} new papers were published in ${fieldName}. Catch up: ${process.env.NEXT_PUBLIC_URL}/researcher`,
  };
}

export async function sendWelcomeEmail(user: User) {
  // TODO: Implement with your email service (SendGrid, AWS SES, etc.)
  console.log("Would send welcome email to:", user.email);
}

export async function sendReminderEmail(user: User) {
  // TODO: Implement reminder logic
  console.log("Would send reminder to:", user.email);
}
