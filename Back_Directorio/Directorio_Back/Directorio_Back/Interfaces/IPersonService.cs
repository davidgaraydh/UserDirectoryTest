using Directorio_Back.Models;

namespace Directorio_Back.Interfaces
{

    public interface IPersonService
    {
        List<Person> GetAll();
        Person? GetById(int id);
        List<Person> Search(string query);
        Person Create(Person person);
        bool Update(int id, Person person);
        bool Delete(int id);

        bool EmailExists(string email);
        bool PhoneExists(string phone);
        bool EmailExistsPut(string email, int excludeId);
        bool PhoneExistsPut(string phone, int excludeId);

    }


}
