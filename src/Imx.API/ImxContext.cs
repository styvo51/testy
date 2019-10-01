using System;
using Microsoft.EntityFrameworkCore;

namespace Imx.API
{
    public class ImxContext : DbContext
    {
        private readonly string _connString;
        
        public DbSet<Imx.Models.Person> Persons { get; set; }

        public ImxContext(string connString)
        {
            _connString = connString;
        }
        
        public ImxContext (DbContextOptions<ImxContext> options) : base(options)
        {
        }
        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_connString);
        }
    }
}