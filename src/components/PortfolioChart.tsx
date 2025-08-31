import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PortfolioHistoryPoint {
  time: string;
  value: number;
  change?: number;
}

interface PortfolioChartProps {
  isOpen: boolean;
  onClose: () => void;
  history: PortfolioHistoryPoint[];
}

const PortfolioChart = ({ isOpen, onClose, history }: PortfolioChartProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📈 Histórico da Carteira de Investimentos
          </DialogTitle>
        </DialogHeader>
        
        <div className="h-96">
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Nenhum histórico de carteira disponível.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="time" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                />
                <Tooltip 
                  formatter={(value: number) => [
                    `R$ ${value.toLocaleString('pt-BR')}`, 
                    'Valor da Carteira'
                  ]}
                  labelFormatter={(label) => `Tempo: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioChart;