using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignalRSample.Data;
using SignalRSample.Models;
using System.Security.Claims;

namespace SignalRSample.Controllers
{
    public class ChatRoomsController : Controller
    {

        private readonly ILogger<ChatRoomsController> _logger;
        private readonly ApplicationDbContext _context;

        public ChatRoomsController(ILogger<ChatRoomsController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        [Route("/[controller]/ListChatRooms")]
        public async Task<ActionResult<IEnumerable<ChatRoom>>> ListChatRooms()
        {
            if (_context.ChatRoom == null)
            {
                return NotFound("No results");
            }

            return await _context.ChatRoom.ToListAsync();
        }

        [HttpGet]
        [Route("/[controller]/ListChatUsers")]
        public async Task<ActionResult<object>> ListChatUsers()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            //if (_context.Users == null)
            //    return NotFound();

            var users = await _context.Users.ToListAsync();

            return users.Where(x => x.Id != userId).Select(u => new { u.Id, u.UserName }).ToList();
        }

        [HttpPost]
        [Route("/[controller]/Post")]
        public async Task<IActionResult> Post([FromBody] ChatRoom chatRoom)
        {
            _context.ChatRoom.Add(chatRoom);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ChatRoom), chatRoom);
        }

        [HttpDelete("/[controller]/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var chatRoom = await _context.ChatRoom.FindAsync(id);

            if (chatRoom == null)
            {
                return NotFound("Id não encontrado");
            }

            _context.Remove(chatRoom);
            await _context.SaveChangesAsync();

            var room = await _context.ChatRoom.FirstOrDefaultAsync();

            return Ok(new { deleted = id, selected = (room == null ? 0 : room.Id) });
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
