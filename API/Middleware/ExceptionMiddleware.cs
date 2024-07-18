using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;  // 执行下一个方法
        private readonly ILogger<ExceptionMiddleware> _logger;   // 日志
        private readonly IHostEnvironment _env;  // host environment，判断当前环境是开发环境还是生产环境
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {  //core method，接收一个 HttpContext 对象
            try
            {
                await _next(context);
            }
            catch (Exception ex)  // 如果发生异常，记录错误日志，设置 HTTP 响应的内容类型为 JSON，并设置状态码为 500
            {  
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 500;

                var response = new ProblemDetails // 创建一个 ProblemDetails 对象来表示错误信息
                {
                    Status = 500,
                    Detail = _env.IsDevelopment() ? ex.StackTrace?.ToString() : null,  //根据当前环境是否为开发环境来决定是否包含堆栈跟踪信息
                    Title = ex.Message
                };

                // 将 ProblemDetails 对象序列化为 JSON 字符串，并将其写入 HTTP 响应
                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}