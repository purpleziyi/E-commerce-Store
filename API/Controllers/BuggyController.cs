// bug控制器，简单返回http的错误响应

using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController // 继承父类后 删除root和apiController属性
    {
        [HttpGet("not-found")]
        public ActionResult GetNotFound()  // 404
        {
            return NotFound();
        }

        [HttpGet("bad-request")]
        public ActionResult GetBadRequest()  // 400
        {
            return BadRequest(new ProblemDetails { Title = "This is a bad request" });
        }

        [HttpGet("unauthorised")]
        public ActionResult GetUnauthorised() // 401 identity authentication
        {
            return Unauthorized();
        }

        [HttpGet("validation-error")]
        public ActionResult GetValidationError() // 如表单验证  400
        {
            ModelState.AddModelError("Problem1", "This is the first error");
            ModelState.AddModelError("Problem2", "This is the second error");
            return ValidationProblem();  // modelsState中有错误时，api会自动返回ValidationProblem()
        }

        [HttpGet("server-error")]
        public ActionResult GetServerError()  // 500
        {
            throw new Exception("This is a server error");
        }

    }
}