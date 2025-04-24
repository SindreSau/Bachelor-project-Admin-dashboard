import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function StatusBadge({ status, icon }: { status: string; icon?: string }) {
  const statusColor: { [key: string]: string } = {
    // Negative outcome - red
    Avslag: 'bg-destructive/70 hover:bg-destructive/70',

    // Not started - gray
    'Ikke påbegynt':
      'dark:bg-muted/70 dark:hover:bg-muted/70 bg-muted-foreground/80 hover:bg-muted/80',

    // Automatic Statuses:
    Påbegynt: 'bg-primary/80 hover:bg-primary/80',
    'Vurdert av alle': 'bg-primary/90 hover:bg-primary/90',

    // Interview Stages:
    'Kalles inn til intervju': 'bg-warning hover:bg-warning/80',
    'Intervju satt opp': 'bg-warning hover:bg-warning/80',
    'Intervju gjennomført': 'bg-warning hover:bg-warning/80',

    // Positive outcome - green
    'Tilbud sendt': 'bg-confirm/90 hover:bg-confirm/90',
    'Tilbud akseptert': 'bg-confirm/90 hover:bg-confirm/90',
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
      className={`max-w-full cursor-default rounded-sm px-1 py-1 text-xs whitespace-nowrap text-white ${statusColor[status]} `}
      style={{
        minWidth: 'min-content',
      }}
    >
      {status}
      {renderIcon()}
    </Badge>
  );
}
