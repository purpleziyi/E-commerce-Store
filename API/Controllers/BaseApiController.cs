using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController: ControllerBase  // 其他controller类以此为父类  可以使子类们免写root和apiController属性
    {
        
    }
}