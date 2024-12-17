
using System.ComponentModel;
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(StoreContext context, UserManager<User> userManager)  // Task 是表示异步操作的类型, 表示该方法不返回任何具体值，但会完成一个异步任务
        {
            if (!userManager.Users.Any())  // check wether there is any user in the DB 
            {   // if there is no user, then create a new user-object 
                var user = new User
                {
                    UserName = "ziyi",
                    Email = "ziyi@test.com"
                };
                // CreateAsync 用于创建新用户并存储到数据库中
                await userManager.CreateAsync(user, "Pa$$w0rd");  // Pa$$w0rd 是新用户的初始密码
                await userManager.AddToRoleAsync(user, "Member");

                var admin = new User
                {
                    UserName = "admin",
                    Email = "admin@test.com"
                };

                await userManager.CreateAsync(admin, "Pa$$w0rd");
                await userManager.AddToRolesAsync(admin, new[] { "Admin", "Member" });

            }

                if (context.Products.Any()) return; // 检查集合（数据库表Products）中是否存在任何元素。如果有就返回

            // create a new product-list
            var products = new List<Product>
            {
                new Product
                {
                    Name = "AAA Purple Hat",
                    Description =
                        "Product's description...Nice Hat",
                    Price = 300,
                    PictureUrl = "/images/products/hat-purple.png",
                    Brand = "AAA",
                    Type = "Hats",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "AAA Pink Hat",
                    Description =
                        "Product's description...Nice Hat",
                    Price = 300,
                    PictureUrl = "/images/products/hat-pink.png",
                    Brand = "AAA",
                    Type = "Hats",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "BBB White Hat",
                    Description =
                        "Product's description...Nice Hat", 
                    Price = 500,
                    PictureUrl = "/images/products/hat-white.png",
                    Brand = "BBB",
                    Type = "Hats",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "BBB Black Gloves",
                    Description =
                        "Product's description...Nice winter gloves",
                    Price = 400,
                    PictureUrl = "/images/products/glove-black.png",
                    Brand = "BBB",
                    Type = "Gloves",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "CCC Purple Gloves",
                    Description =
                        "Product's description...Nice Gloves",
                    Price = 300,
                    PictureUrl = "/images/products/glove-purple.png",
                    Brand = "CCC",
                    Type = "Gloves",
                    QuantityInStock = 100
                },
                               
                new Product
                {
                    Name = "DDD purple Boots",
                    Description =
                        "Product's description...Nice Boots",
                    Price = 2500,
                    PictureUrl = "/images/products/boot-purple.png",
                    Brand = "DDD",
                    Type = "Boots",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "DDD Black Boots",
                    Description =
                        "Product's description...Nice Boots",
                    Price = 1899,
                    PictureUrl = "/images/products/boot-black.png",
                    Brand = "DDD",
                    Type = "Boots",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "DDD Beige Dress",
                    Description =
                        "Product's description...Nice Dress",
                    Price = 900,
                    PictureUrl = "/images/products/dress-beige.png",
                    Brand = "DDD",
                    Type = "Dress",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "DDD Blue Dress",
                    Description =
                        "Product's description...Nice Dress",
                    Price = 800,
                    PictureUrl = "/images/products/dress-blue.png",
                    Brand = "DDD",
                    Type = "Dress",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "EEE Black Smartphone",
                    Description =
                        "Product's description...greate smartphone",
                    Price = 21000,
                    PictureUrl = "/images/products/smartphone-black.png",
                    Brand = "EEE",
                    Type = "Smartphone",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "EEE Purple Smartphone",
                    Description =
                        "Product's description...greate smartphone",
                    Price = 18000,
                    PictureUrl = "/images/products/smartphone-purple.png",
                    Brand = "EEE",
                    Type = "Smartphone",
                    QuantityInStock = 100
                },
            };

            // add these products into DB
            foreach (var product in products)
            {
                context.Products.Add(product);
            }
            // context.Products.AddRange(products);   // alternative method 

            context.SaveChanges();
        }
    }
}