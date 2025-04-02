import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function StatusBadge({ status, icon }: { status: string; icon?: string }) {
  const statusColor: { [key: string]: string } = {
    // Negative outcome - red
    Avslag: 'bg-destructive/70 hover:bg-destructive/50',

    // Not started - gray
    'Ikke påbegynt': 'bg-gray-500 hover:bg-gray-400',

    // Automatic Statuses:
    Påbegynt: 'bg-purple-400 hover:bg-purple-400/70',
    'Vurdert av alle': 'bg-purple-500 hover:bg-purple-500/70',

    // Interview Stages:
    'Kalles inn til intervju': 'bg-warning hover:bg-warning/70',
    'Intervju satt opp': 'bg-warning hover:bg-warning/70',
    'Intervju gjennomført': 'bg-warning hover:bg-warning/70',

    // Positive outcome - green
    'Tilbud sendt': 'bg-confirm/90 hover:bg-confirm/70',
    'Tilbud akseptert': 'bg-confirm/90 hover:bg-confirm/70',
  };

  const renderIcon = () => {
    if (icon === 'open') {
      return <ChevronDown className='h-4 w-4' />;
    } else if (icon === 'close') {
      return <ChevronUp className='h-4 w-4' />;
    }
    return null;
  };

  return (
    <Badge
      className={`max-w-full rounded-sm px-1 py-1 text-xs whitespace-nowrap text-white ${statusColor[status]} `}
      style={{
        minWidth: 'min-content',
      }}
    >
      {status}
      {renderIcon()}
    </Badge>
  );
}
