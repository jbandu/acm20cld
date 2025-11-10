import nodemailer from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

let emailConfig: EmailConfig | null = null;

// Initialize email configuration
function getEmailConfig(): EmailConfig | null {
  if (emailConfig) return emailConfig;

  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || "noreply@acm.com";

  if (!host || !port || !user || !pass) {
    console.warn("Email configuration is incomplete. Email notifications will be disabled.");
    return null;
  }

  emailConfig = {
    host,
    port: parseInt(port),
    secure: port === "465",
    auth: { user, pass },
    from,
  };

  return emailConfig;
}

/**
 * Send query completion notification email
 */
export async function sendQueryCompletionEmail(data: {
  to: string;
  userName: string;
  queryId: string;
  queryText: string;
  resultsCount: number;
  status: string;
}) {
  const config = getEmailConfig();

  if (!config) {
    console.log("Email notifications disabled - skipping email");
    return { success: false, message: "Email not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const queryUrl = `${baseUrl}/researcher/query/${data.queryId}`;

    const statusEmoji = data.status === "COMPLETED" ? "✅" : "❌";
    const statusText = data.status === "COMPLETED" ? "completed successfully" : "failed";

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      background: #f9fafb;
      padding: 30px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .query-box {
      background: white;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .stats {
      display: flex;
      gap: 20px;
      margin: 20px 0;
    }
    .stat {
      flex: 1;
      text-align: center;
      padding: 15px;
      background: white;
      border-radius: 8px;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #667eea;
    }
    .stat-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0;">ACM Research Platform</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Your research query ${statusText}</p>
  </div>

  <div class="content">
    <h2>${statusEmoji} Query ${data.status === "COMPLETED" ? "Completed" : "Failed"}</h2>

    <p>Hello ${data.userName},</p>

    <p>Your research query has ${statusText}.</p>

    <div class="query-box">
      <strong>Your Query:</strong>
      <p>${data.queryText}</p>
    </div>

    ${
      data.status === "COMPLETED"
        ? `
    <div class="stats">
      <div class="stat">
        <div class="stat-value">${data.resultsCount}</div>
        <div class="stat-label">Results Found</div>
      </div>
    </div>

    <p>Click the button below to view your results:</p>

    <a href="${queryUrl}" class="button">View Results</a>
    `
        : `
    <p>Unfortunately, your query could not be completed. Please try again or contact support if the problem persists.</p>

    <a href="${queryUrl}" class="button">View Details</a>
    `
    }

    <div class="footer">
      <p>This is an automated notification from ACM Research Platform</p>
      <p>To manage your notification preferences, visit your account settings</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const result = await transporter.sendMail({
      from: config.from,
      to: data.to,
      subject: `${statusEmoji} Research Query ${data.status === "COMPLETED" ? "Completed" : "Failed"} - ACM Research Platform`,
      html,
    });

    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

/**
 * Send weekly digest email
 */
export async function sendWeeklyDigestEmail(data: {
  to: string;
  userName: string;
  queriesCount: number;
  topFindings: Array<{
    title: string;
    source: string;
    relevance: number;
  }>;
}) {
  const config = getEmailConfig();

  if (!config) {
    console.log("Email notifications disabled - skipping email");
    return { success: false, message: "Email not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      background: #f9fafb;
      padding: 30px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .finding {
      background: white;
      padding: 15px;
      margin: 10px 0;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 Weekly Research Digest</h1>
  </div>
  <div class="content">
    <p>Hello ${data.userName},</p>
    <p>Here's your research activity summary for the week:</p>
    <p><strong>Queries this week:</strong> ${data.queriesCount}</p>

    ${
      data.topFindings.length > 0
        ? `
    <h3>Top Findings</h3>
    ${data.topFindings
      .map(
        (finding) => `
    <div class="finding">
      <strong>${finding.title}</strong>
      <p>Source: ${finding.source} | Relevance: ${(finding.relevance * 100).toFixed(0)}%</p>
    </div>
    `
      )
      .join("")}
    `
        : ""
    }

    <a href="${baseUrl}/researcher/history" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">View All Queries</a>
  </div>
</body>
</html>
    `.trim();

    const result = await transporter.sendMail({
      from: config.from,
      to: data.to,
      subject: "📊 Your Weekly Research Digest - ACM Research Platform",
      html,
    });

    console.log("Weekly digest email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending weekly digest:", error);
    return { success: false, error };
  }
}
