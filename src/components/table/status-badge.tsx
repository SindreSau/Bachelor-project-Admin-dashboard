/* eslint-disable prettier/prettier */
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';


export default function StatusBadge({ status, icon }: { status: string, icon?: string }) {
  const statusColor: { [key: string]: string } = {
    'Avslag': 'bg-destructive/70 hover:bg-destructive/30',
    'Ikke begynt': 'bg-gray-500 hover:bg-gray-400',
    'Påbegynt': 'bg-warning/80 hover:bg-warning/70',
    'Kalles inn til intervju': 'bg-warning/80 hover:bg-warning/70',
    'Intervju satt opp': 'bg-warning/80 hover:bg-warning/70',
    'Intervju gjennomført': 'bg-warning/80 hover:bg-warning/70',
    'Tilbud sendt': 'bg-confirm hover:bg-confirm/70',
    'Tilbud akseptert': 'bg-warning/80 hover:bg-warning/70',
  };

  const renderIcon = () => {
    if (icon === 'open') {
      return <ChevronDown className='h-4 w-4' />;
    }

    else if (icon === 'close') {
      return <ChevronUp className='h-4 w-4' />;
    }
    return null;
  };

  return (
    <Badge
      className={`rounded-sm gap-2 px-1 py-1 text-xs font-light text-white ${statusColor[status]}`}
    >
      {status}
      {renderIcon()}
    </Badge>
  );
}
