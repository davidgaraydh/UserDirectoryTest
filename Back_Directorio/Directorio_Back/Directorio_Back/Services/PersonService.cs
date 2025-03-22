using Directorio_Back.Interfaces;
using Directorio_Back.Models;
using System.Xml.Linq;

namespace Directorio_Back.Services
{

    public class PersonService : IPersonService
    {
        private readonly List<Person> _persons = new();
        private int _nextId = 1;

        public List<Person> GetAll() => _persons;

        public Person? GetById(int id) =>
            _persons.FirstOrDefault(p => p.Id == id);

        public bool EmailExists(string email) =>
            _persons.Any(p => p.Email.Equals(email, StringComparison.OrdinalIgnoreCase));

        public bool PhoneExists(string phone) =>
            _persons.Any(p => p.Phone.Equals(phone, StringComparison.OrdinalIgnoreCase));

        public bool EmailExistsPut(string email, int excludeId) =>
    _persons.Any(p => p.Email.Equals(email, StringComparison.OrdinalIgnoreCase) && p.Id != excludeId);

        public bool PhoneExistsPut(string phone, int excludeId) =>
            _persons.Any(p => p.Phone.Equals(phone, StringComparison.OrdinalIgnoreCase) && p.Id != excludeId);


        public List<Person> Search(string query) =>
            _persons.Where(p =>
                (!string.IsNullOrEmpty(p.Name) && p.Name.Contains(query, StringComparison.OrdinalIgnoreCase)) ||
                (!string.IsNullOrEmpty(p.Address) && p.Address.Contains(query, StringComparison.OrdinalIgnoreCase)) ||
                (!string.IsNullOrEmpty(p.Phone) && p.Phone.Contains(query, StringComparison.OrdinalIgnoreCase)) ||
                (!string.IsNullOrEmpty(p.Email) && p.Email.Contains(query, StringComparison.OrdinalIgnoreCase)) ||
                p.Age.ToString() == query
            ).ToList();

        public Person Create(Person person)
        {
            person.Id = _nextId++;
            _persons.Add(person);
            return person;
        }

        public bool Update(int id, Person person)
        {
            var index = _persons.FindIndex(p => p.Id == id);
            if (index == -1) return false;

            person.Id = id;
            _persons[index] = person;
            return true;
        }

        public bool Delete(int id)
        {
            var person = GetById(id);
            if (person == null) return false;

            _persons.Remove(person);
            return true;
        }



    }


}
