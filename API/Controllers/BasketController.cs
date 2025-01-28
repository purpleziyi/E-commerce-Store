
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {

            Basket basket = await RetrieveBasket(GetBuyerId());

            if (basket == null) return NotFound();
            return basket.MapBasketToDto();
        }



        [HttpPost]  // api/basket?productId=1&quantity=2
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)        {
            
            var basket = await RetrieveBasket(GetBuyerId());  // get basket || create basket
            if (basket == null) basket = CreateBasket();            
            var product = await _context.Products.FindAsync(productId); // get product
            if (product == null) return BadRequest(new ProblemDetails { Title = "Product not found" });
            basket.AddItem(product, quantity); // add item (using method in Basket entity class)
            
            var result = await _context.SaveChangesAsync() > 0; // save changes, 判断save的内容是否大于0

            if (result) return CreatedAtRoute("GetBasket", basket.MapBasketToDto()); // "GetBasket"将我们的响应中添加一个location header

            return BadRequest(new ProblemDetails { Title = "Problem removing item from the basket" });
        }



        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            var basket = await RetrieveBasket(GetBuyerId()); // get basket
            if (basket == null) return NotFound();

            basket.RemoveItem(productId, quantity);  // remove item or reduce quantity (using method in Basket entity class)

            var result = await _context.SaveChangesAsync() > 0;  // save changes
            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem removing item from the basket" });
        }


        // 先在服务器上创建basket，然后建一个cookie，我们可以同时从这个端点返回一个响应BuyerId作为cookies返回(cookies存着buyerId)，cookies存在用户的browser中
        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            // if there is no such buyerId, then the method won't be invoked and return null
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            // if we have a buyerId, this will be the username or cookie, then return the basket associated with the buyId
            var basket = await _context.Baskets   // create a basket
                            .Include(i => i.Items)           // need item
                            .ThenInclude(p => p.Product)      // need product as well based on buyerID that we can retrieve from the cookies
                            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
            return basket;
        }
        private string GetBuyerId()
        {
            // check whether current buyer has logged in
            // 若用户已登录返回用户的身份名称，若用户未登录使用 ?? 运算符返回 从浏览器 Cookie 中读取买家 ID 的值
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }

        private Basket CreateBasket()
        {
            var buyerId = User.Identity?.Name; // in case the name is null
            if (string.IsNullOrEmpty(buyerId))
            {
                buyerId = Guid.NewGuid().ToString(); //Guid is a struct used to generate globally unique identifiers
                var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions); // 将上一行的实际buyerId值赋值给buyerId
            }
            var basket = new Basket { BuyerId = buyerId };  // 创建新的basket时我们需要添加的唯一属性是buyerId
            _context.Baskets.Add(basket);  // 进入context，给baskets添加刚才创建出的basket
            return basket;
        }

        private BasketDto MapBasketToDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }
    }
}