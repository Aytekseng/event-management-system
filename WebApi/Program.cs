using Application.Common.Abstractions;
using Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApi.Middlewares;
using WebApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IAppDbContext>(sp => sp.GetRequiredService<AppDbContext>());
builder.Services.AddScoped<ICurrentUser, CurrentUser>();
builder.Services.AddScoped<Microsoft.AspNetCore.Authentication.IClaimsTransformation, KeycloakRolesClaimsTransformation>();
builder.Services.AddMediatR(typeof(Application.Features.Events.Commands.CreateEvent.CreateEventHandler).Assembly);
var authority = builder.Configuration["Keycloak:Authority"];
var audience = builder.Configuration["Keycloak:Audience"];
var requireHttps = bool.Parse(builder.Configuration["Keycloak:RequireHttpsMetadata"] ?? "false");
builder.Services.AddCors(options =>
{
    options.AddPolicy("web", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = authority;
        options.RequireHttpsMetadata = requireHttps;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if(app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.InjectJavascript("/swagger-auth.js");
    });
    app.UseMiddleware<WebApi.Middlewares.ExceptionMiddleware>();
}
app.UseStaticFiles();


app.UseCors("web");
app.UseAuthentication();
app.UseMiddleware<CurrentUserMiddleware>();
app.UseAuthorization();

app.UseHttpsRedirection();
app.MapControllers();


app.Run();
