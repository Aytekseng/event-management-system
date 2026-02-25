using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;

namespace WebApi.Services;

public class KeycloakRolesClaimsTransformation : IClaimsTransformation
{
    public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        if (principal.Identity is not ClaimsIdentity identity || !identity.IsAuthenticated)
            return Task.FromResult(principal);
            
        if (identity.Claims.Any(c => c.Type == ClaimTypes.Role))
            return Task.FromResult(principal);

        var realmAccess = identity.FindFirst("realm_access")?.Value;
        if (string.IsNullOrWhiteSpace(realmAccess))
            return Task.FromResult(principal);

        try
        {
            using var doc = JsonDocument.Parse(realmAccess);
            if (!doc.RootElement.TryGetProperty("roles", out var rolesEl) || rolesEl.ValueKind != JsonValueKind.Array)
                return Task.FromResult(principal);

            foreach (var r in rolesEl.EnumerateArray())
            {
                if (r.ValueKind == JsonValueKind.String)
                    identity.AddClaim(new Claim(ClaimTypes.Role, r.GetString()!));
            }
        }
        catch
        {
            // ignore
        }

        return Task.FromResult(principal);
    }
}