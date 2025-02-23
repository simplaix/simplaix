interface TicketsHeaderProps {
  ticketCount: number;
  onClose: () => void;
}

export function TicketsHeader({ ticketCount, onClose }: TicketsHeaderProps) {
  return (
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 mt-1">
            {ticketCount} ticket{ticketCount !== 1 ? 's' : ''} created
          </p>
        </div>
      </div>
  );
}
