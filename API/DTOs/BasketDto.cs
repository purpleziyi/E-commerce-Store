namespace API.DTOs
{
    public class BasketDto  // 定义购物车的数据结构，用于客户端获取完整的购物车信息
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItemDto> Items { get; set; }
        public string PaymentIntentId { get; set; }
        public string ClientSecret { get; set; }

    }
}