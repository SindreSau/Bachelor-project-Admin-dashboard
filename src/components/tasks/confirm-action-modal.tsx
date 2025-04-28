import { JSX, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import Spinner from '@/components/common/spinner';
import { cn } from '@/lib/utils';

interface ConfirmActionModalProps {
  onAction: () => Promise<void | JSX.Element>;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  warning?: React.ReactNode;
  disabled?: boolean;
  actionButtonClassName?: string;
}

export default function ConfirmActionModal({
  onAction,
  trigger,
  title = 'Er du sikker?',
  description = 'Dette vil slette elementet permanent.',
  confirmText = 'Slett',
  cancelText = 'Avbryt',
  warning,
  disabled = false,
  actionButtonClassName = '',
}: ConfirmActionModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = async () => {
    setIsDeleting(true);
    try {
      await onAction();
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <span>
            <Button variant='default' disabled={disabled}>
              Open Modal
            </Button>
          </span>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          {warning}
        </DialogHeader>
        <DialogFooter className='sm:justify-start'>
          <Button
            onClick={handleAction}
            variant='default'
            className={cn(
              'inline-flex items-center disabled:cursor-not-allowed',
              actionButtonClassName
            )}
            size='sm'
            disabled={isDeleting || disabled}
          >
            {isDeleting ? (
              <>
                <Spinner size='xs' className='mr-2' />
                <span>Sletter...</span>
              </>
            ) : (
              confirmText
            )}
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            {cancelText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
