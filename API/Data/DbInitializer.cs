
using System.ComponentModel;
using API.Entities;

namespace API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(StoreContext context)
        {
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