using System.Security.Claims;
using System.Text.Json;
using Application.Common.Abstractions;

namespace WebApi.Services;

public class CurrentUser : ICurrentUser
{
    private readonly IHttpContextAccessor _http;

    public CurrentUser(IHttpContextAccessor http)
    {
        _http = http;
    }

    private HttpContext? Ctx => _http.HttpContext;
    private ClaimsPrincipal? Principal => Ctx?.User;

    public bool IsAuthenticated => Principal?.Identity?.IsAuthenticated == true;

    public Guid UserId
    {
        get
        {
            if (!IsAuthenticated) throw new UnauthorizedAccessException();

            if (Ctx?.Items.TryGetValue("AppUserId", out var val) == true && val is Guid id)
                return id;

            throw new InvalidOperationException("AppUserId not resolved. CurrentUserMiddleware is missing or placed wrong.");
        }
    }

    public string? UserName =>
        Principal?.FindFirstValue("preferred_username") ?? Principal?.Identity?.Name;

    public string? Email =>
        Principal?.FindFirstValue(ClaimTypes.Email) ?? Principal?.FindFirstValue("email");

    public IReadOnlyCollection<string> Roles => GetRealmRoles();

    public bool IsInRole(string role) =>
        Roles.Any(r => string.Equals(r, role, StringComparison.OrdinalIgnoreCase));

    private IReadOnlyCollection<string> GetRealmRoles()
    {
        var claim = Principal?.FindFirst("realm_access")?.Value;
        if (string.IsNullOrWhiteSpace(claim)) return Array.Empty<string>();

        try
        {
            using var doc = JsonDocument.Parse(claim);
            if (!doc.RootElement.TryGetProperty("roles", out var rolesEl) || rolesEl.ValueKind != JsonValueKind.Array)
                return Array.Empty<string>();

            return rolesEl.EnumerateArray()
                .Where(x => x.ValueKind == JsonValueKind.String)
                .Select(x => x.GetString()!)
                .ToArray();
        }
        catch
        {
            return Array.Empty<string>();
        }
    }
}