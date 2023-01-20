using Microsoft.AspNetCore.SignalR;

namespace SignalRSample.Hubs
{
    public class HouseGrupHubs: Hub
    {
        public static List<string> GroupsJoined { get; set; } = new List<string>();

        public async Task JoinHouse(string houseName)
        {
            var idPlusGroup = Context.ConnectionId + ":" + houseName;
            if (!GroupsJoined.Contains(idPlusGroup))
            {
                GroupsJoined.Add(idPlusGroup);

                string houseList = "";
                foreach (var item in GroupsJoined)
                {
                    if (item.Contains(Context.ConnectionId))
                    {
                        houseList += item.Split(':')[1] + " ";
                    }
                }

                await Clients.Caller.SendAsync("subscriptionStatus", houseList, houseName.ToLower(), true);
                await Clients.Others.SendAsync("newMemberAddedToHouse", houseName.ToLower());

                await Groups.AddToGroupAsync(Context.ConnectionId, houseName);
            }
        }

        public async Task LeaveHouse(string houseName)
        {
            var idPlusGroup = Context.ConnectionId + ":" + houseName;
            if (GroupsJoined.Contains(idPlusGroup))
            {
                GroupsJoined.Remove(idPlusGroup);

                string houseList = "";
                foreach (var item in GroupsJoined)
                {
                    if (item.Contains(Context.ConnectionId))
                    {
                        houseList += item.Split(':')[1] + " ";
                    }
                }

                await Clients.Caller.SendAsync("subscriptionStatus", houseList, houseName.ToLower(), false);
                await Clients.Others.SendAsync("newMemberRemovedFromHouse", houseName.ToLower());

                await Groups.RemoveFromGroupAsync(Context.ConnectionId, houseName);
            }
        }

        public async Task TriggerHouseNotify(string houseName)
        {
            await Clients.Group(houseName).SendAsync("triggerHouseNotification", houseName);
        }
    }
}
