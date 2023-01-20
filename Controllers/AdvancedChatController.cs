using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;
using SignalRSample.Hubs;
using SignalRSample.Models.ViewModel;
using System.Security.Claims;

namespace SignalRSample.Controllers
{
    public class AdvancedChatController : Controller
    {
        private readonly ILogger<AdvancedChatController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<AdvancedChatHub> _hub;

        public AdvancedChatController(ILogger<AdvancedChatController> logger, ApplicationDbContext context, IHubContext<AdvancedChatHub> hub)
        {
            _logger = logger;
            _context = context;
            _hub = hub;
        }

        [Authorize]
        public IActionResult Index()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            ChatViewModel chatViewModel = new()
            {
                Rooms = _context.ChatRoom.ToList(),
                MaxRoomsAllowed = 4,
                UserId = userId,
            };

            return View(chatViewModel);
        }
    }
}
