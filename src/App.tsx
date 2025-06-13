import React from 'react';
import { ConfigProvider, Card, Flex, Typography, Button, Tooltip, Space } from 'antd'; // Added Space
import {
  DashboardOutlined,
  UsergroupAddOutlined,
  FileTextOutlined,
  PrinterOutlined,
  BarChartOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  RightOutlined,
  ClockCircleOutlined, // For last activity
  ExclamationCircleOutlined, // For warnings/errors
  CheckCircleOutlined, // For completed items
  UploadOutlined // For file uploads
} from '@ant-design/icons';
import enUS from 'antd/lib/locale/en_US';

const { Title, Paragraph, Text } = Typography; // Added Text

// 1. Define the Ant Design theme configuration based on user's provided ConfigProvider
const appTheme = {
  token: {
    colorPrimary: "#7f35b2",
    fontFamily: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
    fontSize: 14,
    colorSuccessText: "#0B6951",
    colorSuccessBg: "#E9F7F2",
    colorErrorText: "#B2242E",
    colorErrorBg: "#FFF0F0",
    colorWarning: "#845200",
    colorWarningBg: "#FFF3D9",
    colorInfo: "#7f35b2",
    colorInfoText: "#074CAD",
    colorInfoBorder: "#074CAD",
    colorInfoBg: "#ECF5FF",
  },
  components: {
    Card: {
      colorBgContainer: "#fff",
      colorTextHeading: "black",
      colorText: "black",
      colorTextDescription: "black",
      bodyPadding: 18,
      headerPadding: 12,
      headerHeight: 42,
      headerBg: "#c2a8f0",
      extraColor: "#48086f",
      colorBorderSecondary: "rgba(127, 53, 178,0.2)",
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      borderRadius: 8,
    },
    Typography: {
      colorTextHeading: "black",
      colorText: "black",
      colorTextSecondary: "#595959",
    },
    Button: {
      colorPrimary: "#7f35b2",
      colorText: "#ffffff",
      defaultBg: "#f6f6f6",
      defaultBorderColor: "#d9d9d9",
      colorLink: '#7f35b2',
      colorLinkHover: '#a36dbd',
      colorLinkActive: '#5a2685',
    },
  },
};

// 2. Create a separate ThemeProvider component to wrap ConfigProvider
interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ConfigProvider locale={enUS} theme={appTheme}>
      {children}
    </ConfigProvider>
  );
};

// 3. Create a ShortcutCard component for individual tiles
interface ShortcutCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  infoContent?: string;
  quickActionText?: string;
  onClick: (path: string) => void;
  onQuickActionClick?: (path: string) => void;
  // New props for dynamic card details
  lastActivity?: string;
  keyMetric?: {
    value: string | number;
    label: string;
    type?: 'success' | 'warning' | 'error' | 'info'; // For color coding
    icon?: React.ReactNode; // Optional icon for the metric
  };
}

const ShortcutCard: React.FC<ShortcutCardProps> = ({
  title,
  description,
  icon,
  path,
  infoContent,
  quickActionText,
  onClick,
  lastActivity,
  keyMetric,
}) => {
  // Determine color for key metric based on its type
  let metricTextColor = appTheme.components?.Typography?.colorText;
  if (keyMetric?.type === 'success') {
    metricTextColor = appTheme.token?.colorSuccessText;
  } else if (keyMetric?.type === 'warning') {
    metricTextColor = appTheme.token?.colorWarning;
  } else if (keyMetric?.type === 'error') {
    metricTextColor = appTheme.token?.colorErrorText;
  } else if (keyMetric?.type === 'info') {
    metricTextColor = appTheme.token?.colorInfoText; // Using colorInfoText from user's theme for info type
  }

  return (
    <Card
      title={
        <Flex align="center" justify="space-between">
          <Title level={5} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: appTheme.components?.Card?.colorTextHeading }}>
            {icon} {title}
          </Title>
          {infoContent && (
            <Tooltip title={infoContent} placement="right">
              <InfoCircleOutlined style={{ color: appTheme.token?.colorInfo }} />
            </Tooltip>
          )}
        </Flex>
      }
      bordered={true}
      hoverable
      style={{
        width: 320,
        minHeight: 220, // Increased minHeight to accommodate new info
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: appTheme.components?.Card?.colorBgContainer,
      }}
      onClick={() => onClick(path)}
    >
      <Paragraph style={{ marginBottom: (quickActionText || lastActivity || keyMetric) ? '12px' : '0', color: appTheme.components?.Card?.colorText }}>
        {description}
      </Paragraph>

      {/* Unique informative details for each card */}
      <Flex direction="column" gap="small" style={{ marginBottom: quickActionText ? '16px' : '0' }}>
        {lastActivity && (
          <Text type="secondary" style={{ color: appTheme.components?.Typography?.colorTextSecondary }}>
            <ClockCircleOutlined style={{ marginRight: '4px' }} />
            Last Activity: {lastActivity}
          </Text>
        )}
        {keyMetric && (
          <Text style={{ color: metricTextColor, fontWeight: 'bold' }}>
            {keyMetric.icon && <span style={{ marginRight: '4px' }}>{keyMetric.icon}</span>}
            {keyMetric.value} <Text type="secondary" style={{ color: appTheme.components?.Typography?.colorTextSecondary }}>{keyMetric.label}</Text>
          </Text>
        )}
      </Flex>

      {quickActionText && (
        <Flex justify="flex-end" style={{ width: '100%' }}>
          <Button
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
            }}
            icon={<RightOutlined />}
            size="small"
            style={{ backgroundColor: appTheme.token?.colorPrimary, color: appTheme.components?.Button?.colorText }}
          >
            {quickActionText}
          </Button>
        </Flex>
      )}
    </Card>
  );
};

// 4. Main App component
const App: React.FC = () => {
  const shortcuts = [
    {
      title: 'Dashboard Overview',
      description: 'Quick insights into overall application status and key metrics.',
      icon: <DashboardOutlined style={{ fontSize: '24px' }} />,
      path: '/dashboard',
      infoContent: 'View aggregated data, pending tasks, and system health at a glance. Includes summaries for client forms and validation errors.',
      quickActionText: 'View Dashboard',
      lastActivity: 'Today, 2:30 PM',
      keyMetric: { value: '85%', label: 'Compliance Score', type: 'success', icon: <CheckCircleOutlined /> },
    },
    {
      title: 'Client Management',
      description: 'Manage client accounts, review client data, and handle validation errors.',
      icon: <UsergroupAddOutlined style={{ fontSize: '24px' }} />,
      path: '/client-management',
      infoContent: 'Access client profiles, update company details, and track ACA form statuses. Prioritize clients with severe validation errors.',
      quickActionText: 'Manage Clients',
      lastActivity: 'Yesterday, 4:00 PM',
      keyMetric: { value: 7, label: 'Clients with Errors', type: 'error', icon: <ExclamationCircleOutlined /> },
    },
    {
      title: 'File Management',
      description: 'Upload, process, and track ACA forms and related documents.',
      icon: <FileTextOutlined style={{ fontSize: '24px' }} />,
      path: '/file-management',
      infoContent: 'Manage all aspects of your ACA filings. Upload new forms, review submitted data, and resolve file-specific issues.',
      quickActionText: 'Go to Files',
      lastActivity: 'June 10, 2025',
      keyMetric: { value: 12, label: 'Files Awaiting Review', type: 'warning', icon: <UploadOutlined /> },
    },
    {
      title: 'Print/Filing',
      description: 'Generate, preview, and manage the printing and e-filing of forms.',
      icon: <PrinterOutlined style={{ fontSize: '24px' }} />,
      path: '/print-filing',
      infoContent: 'Prepare your forms for submission. Preview final layouts, manage printing queues, and initiate electronic filing processes.',
      quickActionText: 'Start Filing',
      lastActivity: 'May 28, 2025',
      keyMetric: { value: 250, label: 'Forms Ready to File', type: 'info', icon: <CheckCircleOutlined /> },
    },
    {
      title: 'Reporting',
      description: 'Access a variety of reports for compliance, data analysis, and auditing.',
      icon: <BarChartOutlined style={{ fontSize: '24px' }} />,
      path: '/reporting',
      infoContent: 'Generate detailed reports on client data, form submissions, validation trends, and compliance status for auditing and review.',
      quickActionText: 'View Reports',
      lastActivity: 'Today, 11:00 AM',
      keyMetric: { value: 15, label: 'New Reports Generated', type: 'info', icon: <BarChartOutlined /> },
    },
    {
      title: 'User Management',
      description: 'Administer user accounts, roles, and permissions within the system.',
      icon: <SettingOutlined style={{ fontSize: '24px' }} />,
      path: '/user-management',
      infoContent: 'Create new user accounts, modify existing user roles, and manage access privileges for different application modules.',
      quickActionText: 'Manage Users',
      lastActivity: 'June 12, 2025',
      keyMetric: { value: 3, label: 'Pending Access Requests', type: 'warning', icon: <UsergroupAddOutlined /> },
    },
  ];

  const handleTileClick = (path: string) => {
    console.log(`Navigating to main area: ${path}`);
    window.location.href = path;
  };

  const handleQuickAction = (path: string) => {
    console.log(`Performing quick action for: ${path}`);
    window.location.href = `${path}/quick-action`;
  };

  return (
    <ThemeProvider>
      <Flex
        justify="center"
        align="center"
        style={{
          minHeight: '100vh',
          padding: '40px',
          backgroundColor: appTheme.components?.Layout?.bodyBg,
          flexDirection: 'column',
        }}
      >
        <Flex
          gap="large"
          wrap="wrap"
          justify="center"
          style={{
            maxWidth: '1200px',
            width: '100%',
          }}
        >
          {shortcuts.map((shortcut, index) => (
            <ShortcutCard
              key={index}
              title={shortcut.title}
              description={shortcut.description}
              icon={shortcut.icon}
              path={shortcut.path}
              infoContent={shortcut.infoContent}
              quickActionText={shortcut.quickActionText}
              onClick={handleTileClick}
              onQuickActionClick={handleQuickAction}
              lastActivity={shortcut.lastActivity} // Pass new prop
              keyMetric={shortcut.keyMetric} // Pass new prop
            />
          ))}
        </Flex>
      </Flex>
    </ThemeProvider>
  );
};

export default App;
