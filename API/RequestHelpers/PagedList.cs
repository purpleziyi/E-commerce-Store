using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    public class PagedList<T> : List<T>
    {
        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            MetaData = new MetaData
            {
                TotalCount = count,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize)
            };
            AddRange(items);  // 在一次操作中将多个元素添加到集合中
        }
        public MetaData MetaData { get; set; }

        public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
        {
            var count = await query.CountAsync(); // asynchronously retrieve the number of records in the result set
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync(); // Take(pageSize): Get the number of records in the current page
            return new PagedList<T>(items, count, pageNumber, pageSize);  // Create a new PagedList-object
        }
    }
}