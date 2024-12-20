using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class LoginDto  // 用于定义用户在登录时需要提交的数据结构
    {
        public string Username {get; set;}

        public string Password {get; set;}
    }
}