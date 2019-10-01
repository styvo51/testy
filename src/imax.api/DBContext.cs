using imx.Models;
using Microsoft.EntityFrameworkCore;

namespace imx
{
    public class ImxContext : DbContext
    {
        private readonly string _connString;
        
        internal DbSet<GPIB.Repository.SQLite.Models.Address> Address { get; set; }
        
        internal DbSet<Deposit> Deposit { get; set; }
        
        internal DbSet<Transfer> Transfer { get; set; }
        
        internal DbSet<DepositHint> DepositHints { get; set; }
        
        internal DbSet<Sms> Sms { get; set; }

        public GPIBContext(string connString)
        {
            _connString = connString;
        }
        
        public GPIBContext (DbContextOptions<GPIBContext> options) : base(options)
        {
        }
        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_connString);
        }
    }
}