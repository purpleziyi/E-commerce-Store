using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<User> userManager, TokenService tokenService)
        {
            _tokenService = tokenService;
            _userManager = userManager;
        }
        
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            // check whether this user exists in the DB
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            // check whther user exists or the pwd matches the pwd in the DB
            if( user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized();  //  HTTP status code 401

            return new UserDto // when user exists and the password is correct, returns the user-object
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user)
            };
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

        [Authorize]  // add it above the method in the controller
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser() // no parameters here, we use token to get user-info from DB
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            // var userBasket = await RetrieveBasket(User.Identity.Name);

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                // Basket = userBasket?.MapBasketToDto()
            };
        }
    }
}