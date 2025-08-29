import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, Timer, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import FinalReport from "@/components/FinalReport";

interface Company {
  name: string;
  investment: number;
  lastChange: number;
  trend: 'up' | 'down' | 'neutral';
}

interface StockMarketProps {
  classId: '9A' | '9B';
  onBack: () => void;
}

const StockMarket = ({ classId, onBack }: StockMarketProps) => {
  const [roundTime, setRoundTime] = useState(40);
  const [currentEvent, setCurrentEvent] = useState<string | null>(null);
  const [isEventActive, setIsEventActive] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showFinalReport, setShowFinalReport] = useState(false);

  const companyData = {
    '9A': ['ECOSOL', 'MAXXIMINÉRIOS', 'AGROSOJA', 'FUTUROBANK', 'SMARTAL'],
    '9B': ['EOLION', 'GALINDOS\'S COFFEE', 'MINEX', 'SANTOS TECNOVA', 'ALFABANK']
  };

  const negativeEvents = [
    'Rompimento de barragem afeta mercado',
    'Estiagem prolongada impacta setores',
    'Vendaval causa danos estruturais',
    'Crise imobiliária abala confiança',
    'Falha em servidores de IA paralisa operações'
  ];

  useEffect(() => {
    const initialCompanies = companyData[classId].map(name => ({
      name,
      investment: 0,
      lastChange: 0,
      trend: 'neutral' as const
    }));
    setCompanies(initialCompanies);
  }, [classId]);

  useEffect(() => {
    if (roundTime <= 0) {
      setRoundTime(40);
      setRoundNumber(prev => prev + 1);
      if (roundNumber >= 8) {
        setShowFinalReport(true);
        toast({
          title: "Simulação Finalizada!",
          description: "Confira o relatório final com o desempenho das empresas."
        });
        return;
      }
    }

    if (roundTime === 10 && !isEventActive) {
      const randomEvent = negativeEvents[Math.floor(Math.random() * negativeEvents.length)];
      setCurrentEvent(randomEvent);
      setIsEventActive(true);
      
      setTimeout(() => {
        setCurrentEvent(null);
        setIsEventActive(false);
      }, 7000);
    }

    const timer = setTimeout(() => {
      if (!isEventActive) {
        setRoundTime(prev => prev - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [roundTime, isEventActive, roundNumber]);

  const handleInvestment = (companyIndex: number, amount: number) => {
    if (isEventActive) return;
    
    setCompanies(prev => prev.map((company, index) => {
      if (index === companyIndex) {
        const newInvestment = Math.max(0, company.investment + amount);
        const change = ((newInvestment - company.investment) / (company.investment || 1)) * 100;
        
        return {
          ...company,
          investment: newInvestment,
          lastChange: change,
          trend: amount > 0 ? 'up' : amount < 0 ? 'down' : 'neutral'
        };
      }
      return company;
    }));

    toast({
      title: amount > 0 ? "Investimento realizado!" : "Desinvestimento realizado!",
      description: `R$ ${Math.abs(amount).toLocaleString('pt-BR')} ${amount > 0 ? 'investidos' : 'retirados'}`,
    });
  };

  const progress = ((40 - roundTime) / 40) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold">Turma {classId}</h1>
            <p className="text-muted-foreground">Rodada {roundNumber} de 8</p>
          </div>
          
          <div className="market-timer flex items-center gap-2">
            <Timer className="h-5 w-5" />
            {roundTime}s
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="h-2" />

        {/* Event Alert */}
        {currentEvent && (
          <div className="event-alert flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{currentEvent}</span>
          </div>
        )}

        {/* Companies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <Card key={company.name} className="company-card">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{company.name}</h3>
                  {company.trend === 'up' && <TrendingUp className="h-5 w-5 text-bull" />}
                  {company.trend === 'down' && <TrendingDown className="h-5 w-5 text-bear" />}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Investimento Total:</span>
                    <span className="font-bold text-lg">
                      R$ {company.investment.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  
                  {company.lastChange !== 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Última variação:</span>
                      <span className={`font-medium ${company.lastChange > 0 ? 'text-bull' : 'text-bear'}`}>
                        {company.lastChange > 0 ? '+' : ''}{company.lastChange.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    className="investment-button bull flex-1"
                    onClick={() => handleInvestment(index, 1000)}
                    disabled={isEventActive}
                  >
                    +R$ 1k
                  </Button>
                  <Button
                    className="investment-button bull flex-1"
                    onClick={() => handleInvestment(index, 5000)}
                    disabled={isEventActive}
                  >
                    +R$ 5k
                  </Button>
                  <Button
                    className="investment-button bear flex-1"
                    onClick={() => handleInvestment(index, -1000)}
                    disabled={isEventActive || company.investment < 1000}
                  >
                    -R$ 1k
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {isEventActive && (
          <div className="text-center text-muted-foreground">
            <p>⏸️ Mercado pausado durante evento negativo</p>
          </div>
        )}
      </div>

      <FinalReport
        isOpen={showFinalReport}
        onClose={() => {
          setShowFinalReport(false);
          onBack();
        }}
        companies={companies}
        classId={classId}
      />
    </div>
  );
};

export default StockMarket;