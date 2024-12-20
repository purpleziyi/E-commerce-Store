using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UserDto
    {
        public string Email {get; set;}  // user interface will display user's email
        public string Token { get; set; }
    }
}