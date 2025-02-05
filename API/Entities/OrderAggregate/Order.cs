using System.ComponentModel.DataAnnotations;

namespace API.Entities.OrderAggregate;

public class Order
{
    public int Id { get; set; }
    public string BuyerId { get; set; }  // username

    [Required]
    public ShippingAddress ShippingAddress { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public List<OrderItem> OrderItems { get; set; }
    public long Subtotal { get; set; }
    public long DeliveryFee { get; set; }
    public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;  // initial value of order status
    public string PaymentIntentId { get; set; }

    public long GetTotal()
    {
        return Subtotal + DeliveryFee;
    }
}