using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Imx.Models;

namespace Imx.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<Models.Person>> Get()
        {
            List<Models.Person> persons = new List<Person>();
            using (ImxContext db = new ImxContext())
            {
                persons.AddRange(db.Persons);
            }
            return persons;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post(Models.Person person)
        {
            using (ImxContext db = new ImxContext())
            {
                db.Add(person);
                db.SaveChanges();
            }
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
