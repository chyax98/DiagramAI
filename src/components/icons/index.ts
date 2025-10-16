/**
 * 图标系统索引
 *
 * 包含:
 * 1. Lucide Icons - 第三方图标库
 * 2. Icon 组件 - 基于 public/icons 的统一图标组件
 */

// ========== Lucide Icons ==========

export {
  Menu as IconMenu,
  X as IconClose,
  ChevronDown as IconChevronDown,
  ChevronUp as IconChevronUp,
  ChevronLeft as IconChevronLeft,
  ChevronRight as IconChevronRight,
  MoreVertical as IconMoreVertical,
  MoreHorizontal as IconMoreHorizontal,
} from "lucide-react";

export {
  Plus as IconPlus,
  Minus as IconMinus,
  Edit as IconEdit,
  Trash2 as IconTrash,
  Copy as IconCopy,
  Download as IconDownload,
  Upload as IconUpload,
  Save as IconSave,
  RefreshCw as IconRefresh,
  RotateCcw as IconUndo,
  RotateCw as IconRedo,
  Maximize2 as IconMaximize,
  Minimize2 as IconMinimize,
  ZoomIn as IconZoomIn,
  ZoomOut as IconZoomOut,
} from "lucide-react";

export {
  Check as IconCheck,
  CheckCircle2 as IconCheckCircle,
  X as IconError,
  XCircle as IconErrorCircle,
  AlertCircle as IconAlert,
  Info as IconInfo,
  Loader2 as IconLoading,
  Circle as IconCircle,
} from "lucide-react";

export {
  Sparkles as IconSparkles,
  History as IconHistory,
  Settings as IconSettings,
  User as IconUser,
  Users as IconUsers,
  LogOut as IconLogout,
  LogIn as IconLogin,
  Search as IconSearch,
  Filter as IconFilter,
  SlidersHorizontal as IconAdjust,
  Code as IconCode,
  FileText as IconFile,
  FolderOpen as IconFolder,
  Image as IconImage,
  Link as IconLink,
  ExternalLink as IconExternalLink,
  Eye as IconEye,
  EyeOff as IconEyeOff,
  Sun as IconSun,
  Moon as IconMoon,
  Monitor as IconMonitor,
} from "lucide-react";

export {
  GitBranch as IconDiagram,
  Network as IconFlowchart,
  GitMerge as IconSequence,
  Database as IconDatabase,
  Boxes as IconClass,
  LayoutGrid as IconGrid,
  Workflow as IconWorkflow,
  Zap as IconActivity,
  Package as IconComponent,
} from "lucide-react";

export {
  Type as IconText,
  AlignLeft as IconAlignLeft,
  AlignCenter as IconAlignCenter,
  AlignRight as IconAlignRight,
  Bold as IconBold,
  Italic as IconItalic,
  Underline as IconUnderline,
  List as IconList,
  ListOrdered as IconOrderedList,
} from "lucide-react";

export {
  Share2 as IconShare,
  MessageSquare as IconComment,
  Mail as IconMail,
  Send as IconSend,
  Bell as IconNotification,
  BellOff as IconNotificationOff,
} from "lucide-react";

export {
  Play as IconPlay,
  Pause as IconPause,
  Square as IconStop,
  SkipBack as IconPrevious,
  SkipForward as IconNext,
} from "lucide-react";

export {
  ArrowUp as IconArrowUp,
  ArrowDown as IconArrowDown,
  ArrowLeft as IconArrowLeft,
  ArrowRight as IconArrowRight,
  Move as IconMove,
  Grip as IconDrag,
} from "lucide-react";

export {
  Star as IconStar,
  Heart as IconHeart,
  BookmarkPlus as IconBookmark,
  Flag as IconFlag,
  Tag as IconTag,
  Hash as IconHash,
  AtSign as IconAt,
  HelpCircle as IconHelp,
  ShieldCheck as IconSecurity,
  Lock as IconLock,
  Unlock as IconUnlock,
  Key as IconKey,
  Cpu as IconCpu,
  Layers as IconLayers,
  Box as IconBox,
} from "lucide-react";

// ========== 统一图标组件 (基于 public/icons) ==========

export { Icon, ProviderIcon, LanguageIcon, Logo, getProviderType, getLanguageType } from "./Icon";

export type {
  IconCategory,
  ProviderType,
  LanguageType,
  DiagramTypeIcon,
  AppIcon,
  IconName,
  IconProps,
  ProviderIconProps,
  LanguageIconProps,
  LogoProps,
} from "./Icon";
