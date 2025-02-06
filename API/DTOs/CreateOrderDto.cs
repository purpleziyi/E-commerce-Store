using API.Entities.OrderAggregate;

namespace API.DTOs
{
    public class CreateOrderDto  
    {
        public bool SaveAddress { get; set; }
        public ShippingAddress ShippingAddress { get; set; }

        // no need to create Basket or Username which could get from server self(from API)- token,DB
    }
}