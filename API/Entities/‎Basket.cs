
namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; } = new();

        // public string PaymentIntentId { get; set; }
        // public string ClientSecret { get; set; }

    public void AddItem(Product product, int quantity)  // 若basket没有该product，则Item中添加该产品
    {
        if (Items.All(item => item.ProductId != product.Id))
        {
            Items.Add(new BasketItem { Product = product, Quantity = quantity });
            return;
        }

        var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
        if (existingItem != null) existingItem.Quantity += quantity;
    }

    public void RemoveItem(int productId, int quantity)
    {
        var item = Items.FirstOrDefault(basketItem => basketItem.ProductId == productId);  // check if we have the item or not
        if (item == null) return;
        item.Quantity -= quantity;  // if we have the item,then reduce the quantity
        if (item.Quantity == 0) Items.Remove(item);  // if the quantity equals 0,then remove the item
        
    }

    }
}