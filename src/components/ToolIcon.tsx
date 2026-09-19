import React from 'react';
import {
  MessageSquare,
  Bot,
  Sparkles,
  Compass,
  Cpu,
  Brain,
  Zap,
  BookOpen,
  Palette,
  Type,
  Flame,
  Layout,
  Feather,
  Wand2,
  Scissors,
  Sliders,
  Video,
  Film,
  UserCheck,
  FileText,
  Mic,
  Radio,
  Volume2,
  FileAudio,
  CheckCircle,
  Check,
  RefreshCw,
  Award,
  PenTool,
  Globe,
  Code2,
  Terminal,
  Layers,
  Heart,
  CheckSquare,
  Trello,
  Network,
  Share2,
  Search,
  TrendingUp,
  Monitor,
  Presentation,
  GitCommit,
  Tv,
  ExternalLink,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  MessageSquare,
  Bot,
  Sparkles,
  Compass,
  Cpu,
  Brain,
  Zap,
  BookOpen,
  Palette,
  Type,
  Flame,
  Layout,
  Feather,
  Wand2,
  Scissors,
  Sliders,
  Video,
  Film,
  UserCheck,
  FileText,
  Mic,
  Radio,
  Volume2,
  FileAudio,
  CheckCircle,
  Check,
  RefreshCw,
  Award,
  PenTool,
  Globe,
  Code2,
  Terminal,
  Layers,
  Heart,
  CheckSquare,
  Trello,
  Network,
  Share2,
  Search,
  TrendingUp,
  Monitor,
  Presentation,
  GitCommit,
  Tv,
  ExternalLink
};

interface ToolIconProps {
  iconName: string;
  className?: string;
  brandColor?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ iconName, className = 'w-6 h-6', brandColor }) => {
  const IconComponent = iconMap[iconName] || Sparkles;

  return (
    <div
      className="relative flex items-center justify-center rounded-xl p-2.5 transition-transform duration-200 group-hover:scale-105"
      style={{
        backgroundColor: brandColor ? `${brandColor}18` : 'rgba(245, 158, 11, 0.12)',
        color: brandColor || '#F59E0B'
      }}
    >
      <IconComponent className={className} />
    </div>
  );
};
