using Directorio_Back.Interfaces;
using Directorio_Back.Models;
using Microsoft.AspNetCore.Mvc;

namespace Directorio_Back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class PersonsController : ControllerBase
    {
        private readonly IPersonService _service;

        public PersonsController(IPersonService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<List<Person>> GetAll() => _service.GetAll();

        [HttpGet("{id}")]
        public ActionResult<Person> Get(int id)
        {
            if (id <= 0)
                return BadRequest("The provided ID must be greater than zero.");

            var person = _service.GetById(id);

            if (person is null)
                return NotFound($"No user found with ID {id}.");

            return Ok(person);
        }


        [HttpGet("search")]
        public ActionResult<List<Person>> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("Search query cannot be empty.");

            var results = _service.Search(q);

            if (results == null || results.Count == 0)
                return NotFound($"No users found matching: '{q}'.");

            return Ok(results);
        }


        [HttpPost]
        [HttpPost]
        public ActionResult<Person> Create(Person person)
        {
            if (person == null)
                return BadRequest("User data must be provided.");

            if (string.IsNullOrWhiteSpace(person.Name) ||
                string.IsNullOrWhiteSpace(person.Address) ||
                string.IsNullOrWhiteSpace(person.Phone) ||
                string.IsNullOrWhiteSpace(person.Email) ||
                person.Age <= 0)
                return BadRequest("All fields must be filled out correctly. Age must be greater than 0.");

            if (_service.EmailExists(person.Email))
                return Conflict("Email already exists.");

            if (_service.PhoneExists(person.Phone))
                return Conflict("Phone number already exists.");

            var created = _service.Create(person);

            if (created == null)
                return StatusCode(500, "An error occurred while creating the user.");

            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }




        [HttpPut("{id}")]
        public IActionResult Update(int id, Person person)
        {
            if (id <= 0)
                return BadRequest("The provided ID must be greater than zero.");

            if (person == null)
                return BadRequest("User data must be provided.");

            if (string.IsNullOrWhiteSpace(person.Name) ||
                string.IsNullOrWhiteSpace(person.Address) ||
                string.IsNullOrWhiteSpace(person.Phone) ||
                string.IsNullOrWhiteSpace(person.Email) ||
                person.Age <= 0)
                return BadRequest("All fields must be filled out correctly. Age must be greater than 0.");

            if (_service.EmailExistsPut(person.Email,id))
                return Conflict("Email is already in use by another user.");

            if (_service.PhoneExistsPut(person.Phone,id))
                return Conflict("Phone number is already in use by another user.");

            var updated = _service.Update(id, person);

            if (!updated)
                return NotFound($"No user found with ID {id}.");

            return Ok(person);
        }


        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (id <= 0)
                return BadRequest("The provided ID must be greater than zero.");

            var deleted = _service.Delete(id);

            if (!deleted)
                return NotFound($"No user found with ID {id} to delete.");

            return NoContent();
        }

    }

}
