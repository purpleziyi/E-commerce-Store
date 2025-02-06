using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User: IdentityUser<int>  // type of primary key in User(aka Id) is int, default value is string
    {
        public UserAddress Address { get; set; }  // every user matches one address, one-to-one relationship

    }
}