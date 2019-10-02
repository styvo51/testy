using System;
using Microsoft.EntityFrameworkCore;

namespace Imx.API
{
    public class ImxContext : DbContext
    {
        private readonly string _connString;
        
        public DbSet<Imx.Models.Person> Persons { get; set; }

        // public ImxContext(string connString)
        // {
        //     _connString = connString;
        // }
        
        // public ImxContext (DbContextOptions<ImxContext> options) : base(options)
        // {
        // }

        public ImxContext()
        {
            Database.EnsureCreated();
        }
        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.UseSqlServer(_connString);
            optionsBuilder.UseSqlite("Data Source=imx.db");
        }
    }
}