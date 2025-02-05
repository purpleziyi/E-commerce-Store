using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{
    // used as snapshop to record the historical property of the items in the cart
    [Owned]
    public class ProductItemOrdered
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string PictureUrl { get; set; }
    }
}