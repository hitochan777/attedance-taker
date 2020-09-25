using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace AttendanceTaking
{
	public class StaticWebAppsAuth
	{
		private class ClientPrincipal
		{
			public string IdentityProvider { get; set; }
			public string UserId { get; set; }
			public string UserDetails { get; set; }
			public IEnumerable<string> UserRoles { get; set; }
		}

		public static ClaimsPrincipal GetClaimsPrincipal(HttpRequest req, ILogger log)
		{
			var header = req.Headers["x-ms-client-principal"];
			log.LogInformation(header);
			var data = header[0];
			var decoded = Convert.FromBase64String(data);
			var json = System.Text.ASCIIEncoding.ASCII.GetString(decoded);
			var principal = JsonSerializer.Deserialize<ClientPrincipal>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

			principal.UserRoles = principal.UserRoles.Except(new string[] { "anonymous" }, StringComparer.CurrentCultureIgnoreCase);

			if (!principal.UserRoles.Any())
			{
				return new ClaimsPrincipal();
			}

			var identity = new ClaimsIdentity(principal.IdentityProvider);
			identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, principal.UserId));
			identity.AddClaim(new Claim(ClaimTypes.Name, principal.UserDetails));
			identity.AddClaims(principal.UserRoles.Select(r => new Claim(ClaimTypes.Role, r)));
			return new ClaimsPrincipal(identity);
		}
	}
}
