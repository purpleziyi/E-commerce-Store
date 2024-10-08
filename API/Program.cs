using API.Data;
using API.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();  // 容器中内容的顺序不重要
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//  put DBContext into container , pass configuration-obj as param
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();  // 由于frontend用3000 port，backed用5000 port，所以解决 cross-domain

var app = builder.Build();

// Configure the HTTP request pipeline.    app中的middleware内容顺序比较重要
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(opt => {
    // request header from client to server, allow any method, specify origin is localhost 3000
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");  // 在编辑好basketDto相关代码后，在此加上AllowCredentials
});

app.UseAuthentication();

app.MapControllers();


var scope = app.Services.CreateScope();  // create a scope and store into this scope-variable
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

try
{ 
    context.Database.Migrate();
    DbInitializer.Initialize(context);   // 调用初始化方法
}
catch (Exception ex)
{
    logger.LogError(ex, "A problem occurred during migration");
}

app.Run();
