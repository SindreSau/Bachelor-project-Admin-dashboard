import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function StatusBadge({ status, icon }: { status: string; icon?: string }) {
  const statusColor: { [key: string]: string } = {
    // Negative outcome - red
    Avslag: 'bg-destructive hover:bg-destructive text-destructive-foreground',

    // Not started - gray
    'Ikke påbegynt':
      'dark:bg-muted dark:hover:bg-muted bg-muted-foreground/10 hover:bg-muted-foreground/10 text-muted-foreground dark:text-muted-foreground',

    // Started - blue
    Påbegynt: 'bg-primary/70 hover:bg-primary/70 text-primary-foreground',

    // Reviewed - purple
    'Vurdert av alle': 'bg-secondary hover:bg-secondary text-secondary-foreground',

    // Interview Stages - purple (deepening)
    'Kalles inn til intervju':
      'bg-secondary text-secondary-foreground hover:bg-secondary text-secondary-foreground',
    'Intervju satt opp':
      'bg-secondary text-secondary-foreground hover:bg-secondary text-secondary-foreground',
    'Intervju gjennomført':
      'bg-secondary text-secondary-foreground hover:bg-secondary text-secondary-foreground',

    // Offer stages - green (accent)
    'Tilbud sendt': 'bg-confirm/70 hover:bg-confirm/70 text-confirm-foreground',
    'Tilbud akseptert': 'bg-confirm hover:bg-confirm text-confirm-foreground',
  };

  const renderIcon = () => {
    if (icon === 'open') {
      return <ChevronDown className='ml-1 h-4 w-4' />;
    } else if (icon === 'close') {
      return <ChevronUp className='ml-1 h-4 w-4' />;
    }
    return null;
  };

  return (
    <Badge
      className={`max-w-full cursor-default rounded-sm px-1 py-1 text-xs whitespace-nowrap ${statusColor[status]}`}
      style={{ minWidth: 'min-content' }}
    >
      {status}
      {renderIcon()}
    </Badge>
  );
}
