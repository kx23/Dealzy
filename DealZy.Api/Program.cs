using DealZy.Api.Converters;
using DealZy.Domain.Models;
using DealZy.Infrastructure.Data;
using DealZy.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Resend;
using System.Text;

namespace DealZy.Api;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var jwtSettings = builder.Configuration.GetSection("Jwt");
        var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddIdentity<User, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        builder.Services.AddMemoryCache();

        builder.Services.AddHttpClient<IGeocodingService, GeocodingService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(10);
            })
            .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
            {
                AutomaticDecompression = System.Net.DecompressionMethods.GZip | System.Net.DecompressionMethods.Deflate
            });

        builder.Services.AddScoped<IGeocodingService, GeocodingService>();

        builder.Services.AddOptions();
        builder.Services.AddHttpClient<ResendClient>();
        builder.Services.Configure<ResendClientOptions>(o =>
        {
            o.ApiToken = builder.Configuration["Email:ResendApiKey"] ?? "re_placeholder";
        });
        builder.Services.AddTransient<IResend, ResendClient>();
        builder.Services.AddScoped<IEmailService, EmailService>();

        builder.Services.AddControllers(options =>
        {
            options.InputFormatters.Insert(0, MyJPIF.GetJsonPatchInputFormatter());
        })
        .AddNewtonsoftJson(options =>
        {
            options.SerializerSettings.Converters.Add(new CreateAdBaseDtoConverter());
        });

        builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer           = true,
                    ValidateAudience         = true,
                    ValidateLifetime         = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer              = jwtSettings["Issuer"],
                    ValidAudience            = jwtSettings["Audience"],
                    IssuerSigningKey         = new SymmetricSecurityKey(key)
                };
            });

        builder.Services.AddOpenApi();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var frontendUrl = builder.Configuration["Frontend:Url"]!;
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
                policy.WithOrigins(frontendUrl)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
        });

        var app = builder.Build();

        using (var scope = app.Services.CreateScope())
        {
            var services      = scope.ServiceProvider;
            var context       = services.GetRequiredService<ApplicationDbContext>();
            var userManager   = services.GetRequiredService<UserManager<User>>();
            var configuration = services.GetRequiredService<IConfiguration>();

            await context.Database.MigrateAsync();
            await ApplicationDbContextSeed.SeedAsync(context, userManager, configuration);
        }

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        else
        {
            app.UseHttpsRedirection();
        }

        app.UseCors("AllowFrontend");
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}
