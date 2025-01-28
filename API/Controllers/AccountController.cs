using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;
        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
        {
            _context = context;
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

            var userBasket = await RetrieveBasket(loginDto.Username);
            var anonBasket = await RetrieveBasket(Request.Cookies["buyerId"]);

            // merge baskets
            // 如果 anonBasket 不为 null（匿名用户的购物车有商品）
            if (anonBasket != null)
            {
                // 如果登录用户已有购物车，将匿名用户购物车的商品合并到登录用户的购物车中
                if (userBasket != null) _context.Baskets.Remove(userBasket);
                anonBasket.BuyerId = user.UserName;
                Response.Cookies.Delete("buyerId");  // 从browser中删除匿名用户的 buyerId Cookie
                await _context.SaveChangesAsync();
            }

            return new UserDto // when user exists and the password is correct, returns the user-object
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket.MapBasketToDto()
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

        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            // 在将匿名用户的购物车与登录用户的购物车合并或绑定后，删除数据库中与匿名用户（buyerId）相关联的购物车
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }

            return await _context.Baskets
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(basket => basket.BuyerId == buyerId);
        }
    }
}