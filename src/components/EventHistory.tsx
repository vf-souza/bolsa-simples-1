import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface EventRecord {
  time: string;
  event: string;
  type: 'positive' | 'negative';
  affectedCompanies: string[];
}

interface EventHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventRecord[];
}

const EventHistory = ({ isOpen, onClose, events }: EventHistoryProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📊 Histórico de Eventos do Mercado
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
          {events.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum evento registrado ainda.
            </p>
          ) : (
            events.map((event, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    event.type === 'positive' ? 'bg-bull/10' : 'bg-bear/10'
                  }`}>
                    {event.type === 'positive' ? (
                      <TrendingUp className="h-4 w-4 text-bull" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-bear" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={event.type === 'positive' ? 'secondary' : 'destructive'}>
                        {event.type === 'positive' ? 'Positivo' : 'Negativo'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {event.time}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium">{event.event}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-muted-foreground">Empresas afetadas:</span>
                      {event.affectedCompanies.map((company, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventHistory;