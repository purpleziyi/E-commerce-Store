using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        public AccountController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }
        
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(LoginDto loginDto)
        {
            // check whether this user exists in the DB
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            // check whther user exists or the pwd matches the pwd in the DB
            if( user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized();  //  HTTP status code 401

            return user; // when user exists and the password is correct, returns the user-object
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto) // this method does not return user-object，just allow user to login
        {
            var user = new User{UserName = registerDto.Username, Email =registerDto.Email};
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user, "Member");

            return StatusCode(201); // seccuessful request            
        }
    }
}