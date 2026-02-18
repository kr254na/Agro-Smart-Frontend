import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Radio,
  Brain,
  Cloud,
  Users,
  Check,
  CheckCheck,
  Filter,
  Trash2,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

type NotificationType = 'sensor' | 'ai' | 'weather' | 'community' | 'system';
type NotificationSeverity = 'info' | 'warning' | 'critical';

interface Notification {
  id: number;
  type: NotificationType;
  severity: NotificationSeverity;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLink?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'sensor',
    severity: 'critical',
    title: 'Low Soil Moisture Detected',
    message: 'Critical moisture level (32%) detected in North Field Farm, Zone A. Immediate irrigation recommended.',
    timestamp: '10 minutes ago',
    read: false,
    actionLink: '/sensors',
  },
  {
    id: 2,
    type: 'weather',
    severity: 'warning',
    title: 'Heavy Rainfall Warning',
    message: 'Heavy rainfall expected tomorrow evening (80-120mm). Prepare drainage systems.',
    timestamp: '2 hours ago',
    read: false,
    actionLink: '/weather',
  },
  {
    id: 3,
    type: 'ai',
    severity: 'info',
    title: 'New AI Recommendation Available',
    message: 'Plant Maize in North Field Farm. Optimal conditions detected with 92% confidence.',
    timestamp: '3 hours ago',
    read: false,
    actionLink: '/analysis',
  },
  {
    id: 4,
    type: 'sensor',
    severity: 'warning',
    title: 'High Temperature Alert',
    message: 'Temperature has reached 35°C in East Valley Ranch. Monitor crop stress and ensure adequate irrigation.',
    timestamp: '5 hours ago',
    read: true,
    actionLink: '/sensors',
  },
  {
    id: 5,
    type: 'ai',
    severity: 'warning',
    title: 'Disease Risk Detected',
    message: 'Early Blight risk detected in East Valley Ranch with 78% confidence. Consider preventive measures.',
    timestamp: '6 hours ago',
    read: true,
    actionLink: '/analysis',
  },
  {
    id: 6,
    type: 'community',
    severity: 'info',
    title: 'New Community Post',
    message: 'John Smith shared tips on organic pest control. Check it out in the community section.',
    timestamp: '8 hours ago',
    read: true,
    actionLink: '/community',
  },
  {
    id: 7,
    type: 'system',
    severity: 'info',
    title: 'Sensor Calibration Complete',
    message: 'All sensors in Sunset Acres have been successfully calibrated and are now online.',
    timestamp: '1 day ago',
    read: true,
    actionLink: '/sensors',
  },
  {
    id: 8,
    type: 'weather',
    severity: 'info',
    title: 'Favorable Planting Conditions',
    message: 'Weather conditions are optimal for planting over the next 5 days. Soil temperature is ideal.',
    timestamp: '1 day ago',
    read: true,
    actionLink: '/weather',
  },
  {
    id: 9,
    type: 'sensor',
    severity: 'critical',
    title: 'Sensor Offline',
    message: 'Soil moisture sensor SM-03 in Sunset Acres has gone offline. Check connection.',
    timestamp: '2 days ago',
    read: true,
    actionLink: '/sensors',
  },
  {
    id: 10,
    type: 'ai',
    severity: 'info',
    title: 'Fertilizer Recommendation',
    message: 'Apply nitrogen-rich fertilizer to North Field Farm. Soil analysis reveals deficiency.',
    timestamp: '2 days ago',
    read: true,
    actionLink: '/analysis',
  },
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'sensor':
      return <Radio className="h-5 w-5 text-blue-400" />;
    case 'ai':
      return <Brain className="h-5 w-5 text-purple-400" />;
    case 'weather':
      return <Cloud className="h-5 w-5 text-cyan-400" />;
    case 'community':
      return <Users className="h-5 w-5 text-green-400" />;
    case 'system':
      return <Bell className="h-5 w-5 text-gray-400" />;
  }
};

const getSeverityColor = (severity: NotificationSeverity) => {
  switch (severity) {
    case 'critical':
      return 'border-red-500/20 bg-red-500/5';
    case 'warning':
      return 'border-yellow-500/20 bg-yellow-500/5';
    case 'info':
      return 'border-green-500/20 bg-green-500/5';
  }
};

const getSeverityBadge = (severity: NotificationSeverity) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/20 text-red-400';
    case 'warning':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'info':
      return 'bg-green-500/20 text-green-400';
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const navigate = useNavigate();

  const filteredNotifications = notifications.filter((notif) => {
    if (filterType !== 'all' && notif.type !== filterType) return false;
    if (filterSeverity !== 'all' && notif.severity !== filterSeverity) return false;
    return true;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sortBy === 'date') {
      return a.id - b.id; // Higher ID = more recent
    } else if (sortBy === 'severity') {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return 0;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    if (notification.actionLink) {
      navigate(notification.actionLink);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl text-white font-bold leading-tight">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-[#48D87D] text-black text-sm px-3 py-1 rounded-full font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-gray-400">
              Stay updated on your farms, crops, and environment
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              className="border-gray-700 text-black hover:bg-[#1a1a1a] hover:text-[#48D87D] sm:w-auto font-medium"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="bg-[#1a1a1a] border-gray-800 text-white focus:border-[#48D87D]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-gray-800">
              <SelectItem value="all" className="text-white focus:bg-[#2a2a2a]">All Types</SelectItem>
              <SelectItem value="sensor" className="text-white focus:bg-[#2a2a2a]">Sensor Alerts</SelectItem>
              <SelectItem value="ai" className="text-white focus:bg-[#2a2a2a]">AI Recommendations</SelectItem>
              <SelectItem value="weather" className="text-white focus:bg-[#2a2a2a]">Weather Updates</SelectItem>
              <SelectItem value="community" className="text-white focus:bg-[#2a2a2a]">Community</SelectItem>
              <SelectItem value="system" className="text-white focus:bg-[#2a2a2a]">System</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="bg-[#1a1a1a] border-gray-800 text-white focus:border-[#48D87D]">
              <SelectValue placeholder="Filter by Severity" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-gray-800">
              <SelectItem value="all" className="text-white focus:bg-[#2a2a2a]">All Severities</SelectItem>
              <SelectItem value="critical" className="text-white focus:bg-[#2a2a2a]">Critical</SelectItem>
              <SelectItem value="warning" className="text-white focus:bg-[#2a2a2a]">Warning</SelectItem>
              <SelectItem value="info" className="text-white focus:bg-[#2a2a2a]">Info</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-[#1a1a1a] border-gray-800 text-white focus:border-[#48D87D]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-gray-800">
              <SelectItem value="date" className="text-white focus:bg-[#2a2a2a]">Most Recent</SelectItem>
              <SelectItem value="severity" className="text-white focus:bg-[#2a2a2a]">By Severity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notifications List */}
      {sortedNotifications.length > 0 ? (
        <div className="space-y-3">
          {sortedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`${getSeverityColor(
                notification.severity
              )} border rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all ${
                !notification.read ? 'border-l-4 border-l-[#48D87D]' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-4">
                <div className="bg-[#1a1a1a] p-3 rounded-lg">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-medium">{notification.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getSeverityBadge(
                          notification.severity
                        )} font-semibold`}
                      >
                        {notification.severity}
                      </span>
                      {!notification.read && (
                        <span className="bg-[#48D87D] text-black text-xs px-2 py-1 rounded-full font-bold">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{notification.message}</p>
                  <p className="text-gray-500 text-xs">{notification.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-12 text-center shadow-xl">
          <Bell className="h-12 w-12 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2 font-semibold">No Notifications</h3>
          <p className="text-gray-400">
            {filterType !== 'all' || filterSeverity !== 'all'
              ? 'No notifications match your current filters'
              : "You're all caught up! No new notifications at the moment."}
          </p>
        </div>
      )}
    </div>
  );
}
