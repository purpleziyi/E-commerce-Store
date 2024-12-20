using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        // UserManager<User> & IConfiguration are dependencies which are injected as parameters into the constructor 
        // and stored in private readonly member variables
        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;

        // Injecting dependencies through the constructor - inject configuration as a service 
        public TokenService(UserManager<User> userManager, IConfiguration config)  
        {
            _userManager = userManager;
            _config = config;
        }

        public async Task<string> GenerateToken(User user)  
        {
            // claims will be stored in the payload
            var claims = new List<Claim> // Stores a set of Claim objects (a collection of user identity info)
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenOptions = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions); 
        }
    }
}