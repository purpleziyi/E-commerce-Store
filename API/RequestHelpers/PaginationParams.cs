using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.RequestHelpers
{
    public class PaginationParams
    {
        private const int maxPageSize = 50;

        public int PageNumber { get; set;} = 1;  // default page = 1

        private int _pageSize = 6; // default size = 6

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = value > maxPageSize ? maxPageSize : value;
        }
    }
}