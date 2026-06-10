using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Resend;

namespace DealZy.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IResend _resend;
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IResend resend, IConfiguration configuration, ILogger<EmailService> logger)
    {
        _resend = resend;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendEmailConfirmationAsync(string toEmail, string userName, string confirmationLink)
    {
        var from = _configuration["Email:From"]!;
        var message = new EmailMessage
        {
            From = from,
            Subject = "Подтверждение email — Dealzy"
        };
        message.To.Add(toEmail);
        message.HtmlBody = $"""
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
              <h2>Добро пожаловать на Dealzy, {userName}!</h2>
              <p>Подтвердите вашу почту, чтобы начать пользоваться сайтом.</p>
              <a href="{confirmationLink}"
                 style="display:inline-block;padding:12px 24px;background:#2563EB;color:#fff;
                        border-radius:6px;text-decoration:none;font-weight:600">
                Подтвердить email
              </a>
              <p style="color:#9E9E9E;font-size:12px;margin-top:24px">
                Если вы не регистрировались на Dealzy — просто проигнорируйте это письмо.
              </p>
            </div>
            """;

        await _resend.EmailSendAsync(message);
        _logger.LogInformation("Confirmation email sent to {Email}", toEmail);
    }
}
