
using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : IdentityDbContext<User, Role, int>  // 负责数据库交互、表映射、用户身份验证等功能
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

            builder.Entity<User>()
                .HasOne(a => a.Address)  // User 关联一个 Address
                .WithOne()        // Address 也是一对一关系
                .HasForeignKey<UserAddress>(a => a.Id)   // Address 的 Id 作为外键
                .OnDelete(DeleteBehavior.Cascade);    // 级联删除

            // 当我们创建data migration时，我们希望在DB中添加一些data，所以我们将从AspNet Identity中获得身份role
            builder.Entity<Role>() 
                .HasData(  // 在该方法中我们可以创建IdentityRole的new instance
                           // 当创建migrations时，我们将使用一些sql命令将data插入table中，而这个table将是我们的roles  
                    new Role { Id = 1, Name = "Member", NormalizedName = "MEMBER" },
                    new Role { Id = 2, Name = "Admin", NormalizedName = "ADMIN" }
                );
        }

    }
}