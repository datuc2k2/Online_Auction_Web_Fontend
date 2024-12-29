'use client'
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NotificationPost } from './models/notification';
import UserNotification from './models/user_notification';
import { NotificationServices } from './services/notification';
import { UserServices } from './services/user_services';
import { NotificationType } from './utils/enum';
import { useSignalR } from './utils/SignalRContext';
import { openNotification } from '@/utility/Utility';

const CreateNotification: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    tag: ''
  });

  const [isGlobal, setIsGlobal] = useState(false);
  const [users, setUsers] = useState<UserNotification[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserNotification[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setIsGlobal(!isGlobal);
      if (checked) {
        setSelectedUsers([]);
      }
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const {notificationConnection} = useSignalR();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const notificationType = isGlobal ? NotificationType.SYSTEM : NotificationType.POST;

      if (!formData.title.trim() || !formData.body.trim()) {
        openNotification("error", "", "Vui lòng điền đầy đủ tiêu đề và nội dung thông báo");
        return;
      }

      if (!isGlobal && selectedUsers.length === 0) {
        openNotification("error", "", "Vui lòng chọn người nhận thông báo");
        return;
      }

      const payload = new NotificationPost(formData.title, formData.body, selectedUsers.map(user => user.userId), notificationType);
      const data = await NotificationServices.createNotification(payload);
      console.log("data", data);  
      notificationConnection?.invoke("SystemAppSendNotice", data);
      // Đặt lại biểu mẫu sau khi gửi thành công
      setFormData({
        title: '',
        body: '',
        tag: ''
      });
      setSelectedUsers([]);
      openNotification("success", "Thành công", "Tạo thông báo thành công");
   
    } catch (error) {
      console.error('Lỗi khi tạo thông báo:', error);
      openNotification("error", "", "Không thể tạo thông báo");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await UserServices.getUsers();
      setUsers(users);
    };
    fetchUsers();
  }, []);

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    console.log("userId", userId);
    const user = users.find(u => u.userId == userId);
    console.log("user", user);
    if (user && !selectedUsers.some(u => u.userId == user.userId)) {
      console.log(user);
      setSelectedUsers(prevUsers => [...prevUsers, user]);
    }
  };


  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 3 }}>
      <Typography
        variant="h5"
        sx={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 600,
          fontSize: "28px",
          color: "#000000",
          textTransform: "uppercase",
          letterSpacing: "1px",
          textAlign: "center",
          marginBottom: "24px",
        }}
      >
        Tạo Thông Báo Mới
      </Typography>

      <Card
        sx={{ backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      >
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Tiêu đề"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ marginBottom: 2 }}
            />

            <TextField
              fullWidth
              label="Nội dung"
              name="body"
              value={formData.body}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={4}
              sx={{ marginBottom: 2 }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "20px",
                backgroundColor: "#f7f7f7",
                borderRadius: "12px",
                marginBottom: "24px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isGlobal}
                    onChange={handleChange}
                    id="isGlobal"
                    name="isGlobal"
                    style={{
                      appearance: "none",
                      width: "20px",
                      height: "20px",
                      border: "2px solid #1976d2",
                      borderRadius: "4px",
                      cursor: "pointer",
                      position: "relative",
                      backgroundColor: isGlobal ? "#1976d2" : "transparent",
                    }}
                  />
                  {isGlobal && (
                    <span
                      style={{
                        position: "absolute",
                        left: "6px",
                        top: "2px",
                        width: "5px",
                        height: "10px",
                        border: "solid white",
                        borderWidth: "0 2px 2px 0",
                        transform: "rotate(45deg)",
                      }}
                    ></span>
                  )}
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#333",
                    }}
                  >
                    Mọi người
                  </span>
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!isGlobal}
                    onChange={handleChange}
                    id="isUrgent"
                    name="isUrgent"
                    style={{
                      appearance: "none",
                      width: "20px",
                      height: "20px",
                      border: "2px solid #1976d2",
                      borderRadius: "4px",
                      cursor: "pointer",
                      position: "relative",
                      backgroundColor: !isGlobal ? "#1976d2" : "transparent",
                    }}
                  />
                  {!isGlobal && (
                    <span
                      style={{
                        position: "absolute",
                        left: "6px",
                        top: "2px",
                        width: "5px",
                        height: "10px",
                        border: "solid white",
                        borderWidth: "0 2px 2px 0",
                        transform: "rotate(45deg)",
                      }}
                    ></span>
                  )}
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#333",
                    }}
                  >
                    Chỉ định người dùng
                  </span>
                </label>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <select
                    onChange={handleUserSelect}
                    name="userSelect"
                    disabled={isGlobal}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      backgroundColor: isGlobal ? "#f0f0f0" : "white",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      backgroundImage:
                        'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1em top 50%",
                      backgroundSize: "0.65em auto",
                      cursor: isGlobal ? "not-allowed" : "pointer",
                      opacity: isGlobal ? 0.5 : 1,
                      fontSize: "14px",
                      color: "#333",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <option value="">Chọn người dùng</option>
                    {users?.map((user) => (
                      <option key={user.userId} value={user.userId}>
                        {user.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <Box
              sx={{
                marginTop: 2,
                marginBottom: 2,
                padding: 2,
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                backgroundColor: "#f5f5f5",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 500,
                  marginBottom: 1,
                  color: "#424242",
                }}
              >
                Những người đã chọn
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedUsers.map((user) => (
                  <Button
                    key={user.userId}
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedUsers(
                        selectedUsers.filter((u) => u.userId !== user.userId)
                      );
                    }}
                    sx={{
                      backgroundColor: "#e3f2fd",
                      "&:hover": {
                        backgroundColor: "#bbdefb",
                      },
                      textTransform: "none",
                      margin: "2px",
                    }}
                  >
                    {user.email}
                  </Button>
                ))}
                {selectedUsers.length === 0 && (
                  <Typography
                    variant="body2"
                    sx={{ color: "#757575", fontStyle: "italic" }}
                  >
                    Chưa chọn người dùng nào
                  </Typography>
                )}
              </Box>
            </Box>

            <Button
              onClick={handleSubmit}
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#1976d2",
                color: "white",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
                padding: "12px",
              }}
            >
              Tạo Thông Báo
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateNotification;
