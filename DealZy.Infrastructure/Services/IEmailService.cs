namespace DealZy.Infrastructure.Services;

public interface IEmailService
{
    Task SendEmailConfirmationAsync(string toEmail, string userName, string confirmationLink);
}
