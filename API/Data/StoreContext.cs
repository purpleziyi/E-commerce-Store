
using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : IdentityDbContext<User>
    {
        public StoreContext(DbContextOptions options) : base(options)
        {  // constructor

        }

        public DbSet<Product> Products { get; set; }

        public DbSet<Basket> Baskets { get; set; }

        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)  // 这是DBContext中的可用方法
        {
            base.OnModelCreating(builder);  // 从IdentityDbContext中调用base.OnModelCreating类，并将builder设为参数

            // 当我们创建data migration时，我们希望在DB中添加一些data，所以我们将从AspNet Identity中获得身份role
            builder.Entity<IdentityRole>() 
                .HasData(  // 在该方法中我们可以创建IdentityRole的new instance
                    // 当创建migrations时，我们将使用一些sql命令将data插入table中，而这个table将是我们的roles  
                    new IdentityRole { Name = "Member", NormalizedName = "MEMBER" },
                    new IdentityRole { Name = "Admin", NormalizedName = "ADMIN" }
                );
        }

    }
}