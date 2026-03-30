useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser) return;

  fetch(`http://localhost:5000/api/messages/unread/${storedUser._id}`)
    .then(res => res.json())
    .then(data => setUnreadCount(data.unreadCount || 0));
}, []);
