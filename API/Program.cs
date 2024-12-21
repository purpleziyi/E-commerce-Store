using System.Text;
using API.Data;
using API.Entities;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();  // 容器中内容的顺序不重要
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>  // Configure the Swagger generator to generate API documentation
{
    // Include 'SecurityScheme' to use JWT Authentication
    var jwtSecurityScheme = new OpenApiSecurityScheme  // Define a JWT security scheme to support JWT authentication in Swagger
    {
        BearerFormat = "JWT",  // Specifies the token format is JWT
        Name = "Authorization", // Set the parameter name in the HTTP request header as 'Authorization'
        In = ParameterLocation.Header, // Specifies token be passed within the HTTP request header
        Type = SecuritySchemeType.ApiKey,  //设置认证方案的类型为 API 密钥（ApiKey）
        Scheme = JwtBearerDefaults.AuthenticationScheme,  // 设置认证方案为 JWT Bearer
        Description = "Put Bearer + your token in the box below",  // Tell users how to use Bearer Token

        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    // Add the defined JWT security scheme to the Swagger security definition
    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });

});


//  put DBContext into container , pass configuration-obj as param
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();  // 由于frontend用3000 port，backed用5000 port，所以解决 cross-domain
builder.Services.AddIdentityCore<User>(opt => 
{
    opt.User.RequireUniqueEmail = true; // enable unique email to prevent duplicated email stored in DB 
})
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<StoreContext>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme) // tell API use the JWT Bearer authentication scheme
    .AddJwtBearer (opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters  // specify how to verify the JWT
        {
            ValidateIssuer = false,  //the issuer of the token is not verified,  for simple scenarios or development stages
            ValidateAudience = false, // Audience of the token is not verified
            ValidateLifetime = true,  // Verify the token signing key is correct
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8  // we use same key to decrypt the signature
                .GetBytes(builder.Configuration["JWTSettings:TokenKey"])) // 使用对称加密密钥（从appsettings文件中读取TokenKey）来验证签名的真实性
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<TokenService>();  // when we process the http-request, the service keeps alive   


var app = builder.Build();

// Configure the HTTP request pipeline.    app中的middleware内容顺序比较重要
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())  // 中间件的顺序要在其他中间件之前
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true"); //no need to paste token when refreshing the browser
    });
}

app.UseCors(opt => {
    // request header from client to server, allow any method, specify origin is localhost 3000
    opt.AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:3000");  // 在编辑好basketDto相关代码后，在此加上AllowCredentials
});

app.UseAuthentication();  // firstly checking who these users are
app.UseAuthorization();  // then authorizing the user to access to our APP

app.MapControllers();


var scope = app.Services.CreateScope();  // create a scope and store into this scope-variable
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

try
{ 
    await context.Database.MigrateAsync();
    await DbInitializer.Initialize(context, userManager);   // 调用初始化方法
}
catch (Exception ex)
{
    logger.LogError(ex, "A problem occurred during migration");
}

app.Run();
