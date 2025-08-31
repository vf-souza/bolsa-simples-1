import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, Timer, ArrowLeft, BarChart3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import FinalReport from "@/components/FinalReport";
import StockChart from "@/components/StockChart";

interface Company {
  name: string;
  investment: number;
  lastChange: number;
  trend: 'up' | 'down' | 'neutral';
  initialInvestment: number;
  history: Array<{
    time: string;
    value: number;
  }>;
}

interface StockMarketProps {
  classId: '9A' | '9B';
  onBack: () => void;
}

const StockMarket = ({ classId, onBack }: StockMarketProps) => {
  const [roundTime, setRoundTime] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<string | null>(null);
  const [isEventActive, setIsEventActive] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showFinalReport, setShowFinalReport] = useState(false);
  const [lastEventTime, setLastEventTime] = useState(0);
  const [isMarketActive, setIsMarketActive] = useState(true);
  const [totalPortfolio, setTotalPortfolio] = useState(0);
  const [userBalance, setUserBalance] = useState(2000);
  const [initialPortfolioValue, setInitialPortfolioValue] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showChart, setShowChart] = useState(false);

  const companyData = {
    '9A': ['ECOSOL', 'MAXXIMINÉRIOS', 'AGROSOJA', 'FUTUROBANK', 'SMARTAL'],
    '9B': ['EOLION', 'GALINDOS\'S COFFEE', 'MINEX', 'SANTOS TECNOVA', 'ALFABANK']
  };

  const negativeEvents = [
    'Rompimento de barragem afeta mercado',
    'Estiagem prolongada impacta setores',
    'Vendaval causa danos estruturais',
    'Crise imobiliária abala confiança',
    'Falha em servidores de IA paralisa operações',
    'Aumento súbito de impostos sobre empresas',
    'Greve geral paralisa transportes e logística',
    'Cyberataques comprometem dados financeiros',
    'Regulamentações ambientais restringem operações',
    'Crise energética eleva custos operacionais'
  ];

  const positiveEvents = [
    'Descoberta de novos recursos naturais impulsiona setor',
    'Inovação tecnológica revoluciona mercado',
    'Parcerias estratégicas aceleram crescimento',
    'Certificação ambiental valoriza empresas sustentáveis',
    'Expansão internacional abre novos mercados',
    'Investimento em pesquisa gera breakthrough científico',
    'Redução de taxas governamentais estimula economia',
    'Acordos comerciais internacionais facilitam exportações',
    'Investimentos em infraestrutura digital aceleram negócios',
    'Políticas de incentivo fiscal beneficiam empresas'
  ];

  const negativeEventImpacts = {
    '9A': {
      'Rompimento de barragem afeta mercado': ['MAXXIMINÉRIOS'],
      'Estiagem prolongada impacta setores': ['AGROSOJA'],
      'Vendaval causa danos estruturais': ['ECOSOL'],
      'Crise imobiliária abala confiança': ['FUTUROBANK'],
      'Falha em servidores de IA paralisa operações': ['SMARTAL'],
      'Aumento súbito de impostos sobre empresas': ['FUTUROBANK'],
      'Greve geral paralisa transportes e logística': ['AGROSOJA'],
      'Cyberataques comprometem dados financeiros': ['SMARTAL'],
      'Regulamentações ambientais restringem operações': ['ECOSOL'],
      'Crise energética eleva custos operacionais': ['MAXXIMINÉRIOS']
    },
    '9B': {
      'Rompimento de barragem afeta mercado': ['MINEX'],
      'Estiagem prolongada impacta setores': ['GALINDOS\'S COFFEE'],
      'Vendaval causa danos estruturais': ['EOLION'],
      'Crise imobiliária abala confiança': ['ALFABANK'],
      'Falha em servidores de IA paralisa operações': ['SANTOS TECNOVA'],
      'Aumento súbito de impostos sobre empresas': ['ALFABANK'],
      'Greve geral paralisa transportes e logística': ['GALINDOS\'S COFFEE'],
      'Cyberataques comprometem dados financeiros': ['SANTOS TECNOVA'],
      'Regulamentações ambientais restringem operações': ['EOLION'],
      'Crise energética eleva custos operacionais': ['MINEX']
    }
  };

  const positiveEventImpacts = {
    '9A': {
      'Descoberta de novos recursos naturais impulsiona setor': ['MAXXIMINÉRIOS'],
      'Inovação tecnológica revoluciona mercado': ['SMARTAL'],
      'Parcerias estratégicas aceleram crescimento': ['AGROSOJA'],
      'Certificação ambiental valoriza empresas sustentáveis': ['ECOSOL'],
      'Expansão internacional abre novos mercados': ['FUTUROBANK'],
      'Investimento em pesquisa gera breakthrough científico': ['SMARTAL'],
      'Redução de taxas governamentais estimula economia': ['FUTUROBANK'],
      'Acordos comerciais internacionais facilitam exportações': ['AGROSOJA'],
      'Investimentos em infraestrutura digital aceleram negócios': ['SMARTAL'],
      'Políticas de incentivo fiscal beneficiam empresas': ['ECOSOL']
    },
    '9B': {
      'Descoberta de novos recursos naturais impulsiona setor': ['MINEX'],
      'Inovação tecnológica revoluciona mercado': ['SANTOS TECNOVA'],
      'Parcerias estratégicas aceleram crescimento': ['GALINDOS\'S COFFEE'],
      'Certificação ambiental valoriza empresas sustentáveis': ['EOLION'],
      'Expansão internacional abre novos mercados': ['ALFABANK'],
      'Investimento em pesquisa gera breakthrough científico': ['SANTOS TECNOVA'],
      'Redução de taxas governamentais estimula economia': ['ALFABANK'],
      'Acordos comerciais internacionais facilitam exportações': ['GALINDOS\'S COFFEE'],
      'Investimentos em infraestrutura digital aceleram negócios': ['SANTOS TECNOVA'],
      'Políticas de incentivo fiscal beneficiam empresas': ['EOLION']
    }
  };

  useEffect(() => {
    const total = companies.reduce((sum, company) => sum + company.investment, 0);
    setTotalPortfolio(total);
    
    // Se é a primeira vez que o portfólio tem valor, salvar como valor inicial
    if (initialPortfolioValue === 0 && total > 0) {
      setInitialPortfolioValue(total);
    }
  }, [companies, initialPortfolioValue]);

  useEffect(() => {
    const initialCompanies = companyData[classId].map(name => ({
      name,
      investment: 0,
      lastChange: 0,
      trend: 'neutral' as const,
      initialInvestment: 0,
      history: []
    }));
    setCompanies(initialCompanies);
    setLastEventTime(0);
  }, [classId]);

  const applyEventImpact = (eventName: string, isPositive: boolean) => {
    const impactMap = isPositive ? positiveEventImpacts : negativeEventImpacts;
    const affectedCompanies = impactMap[classId][eventName];
    if (!affectedCompanies) return;

    setCompanies(prev => prev.map(company => {
      if (affectedCompanies.includes(company.name) && company.investment > 0) {
        const impactPercentage = 0.01 + Math.random() * 0.03; // 1-4% de variação
        const multiplier = isPositive ? (1 + impactPercentage) : (1 - impactPercentage);
        const newInvestment = isPositive 
          ? company.investment * multiplier
          : Math.max(0, company.investment * multiplier);
        const change = (multiplier - 1) * 100;
        
        const timeString = `${Math.floor(roundTime / 60)}:${(roundTime % 60).toString().padStart(2, '0')}`;
        
        return {
          ...company,
          investment: newInvestment,
          lastChange: change,
          trend: isPositive ? 'up' as const : 'down' as const,
          history: [...company.history, { time: timeString, value: newInvestment }]
        };
      }
      return company;
    }));
    
    // Adicionar R$ 500 ao saldo do usuário a cada evento
    setUserBalance(prev => prev + 500);
  };

  const handleEndMarket = () => {
    setIsMarketActive(false);
    setShowFinalReport(true);
    toast({
      title: "Mercado Encerrado!",
      description: "Confira o relatório final com o desempenho das empresas."
    });
  };

  const handleNewSimulation = () => {
    setIsMarketActive(true);
    setRoundTime(0);
    setLastEventTime(0);
    setCurrentEvent(null);
    setIsEventActive(false);
    setShowFinalReport(false);
    setUserBalance(2000);
    setInitialPortfolioValue(0);
    const initialCompanies = companyData[classId].map(name => ({
      name,
      investment: 0,
      lastChange: 0,
      trend: 'neutral' as const,
      initialInvestment: 0,
      history: []
    }));
    setCompanies(initialCompanies);
  };

  useEffect(() => {
    if (!isMarketActive) return;

    // Verificar se deve disparar um evento (a cada 15 segundos de mercado)
    if (roundTime > 0 && roundTime >= lastEventTime + 15 && !isEventActive) {
      // Decidir aleatoriamente se será evento positivo ou negativo (60% negativo, 40% positivo)
      const isPositive = Math.random() < 0.4;
      const eventList = isPositive ? positiveEvents : negativeEvents;
      const randomEvent = eventList[Math.floor(Math.random() * eventList.length)];
      
      setCurrentEvent(randomEvent);
      setIsEventActive(true);
      setLastEventTime(roundTime);
      
      // Aplicar impacto imediatamente quando o evento aparece
      applyEventImpact(randomEvent, isPositive);
      
      // Remover aviso após 7 segundos, mas mercado continua pausado
      setTimeout(() => {
        setCurrentEvent(null);
        setIsEventActive(false);
      }, 7000);
    }

    const timer = setTimeout(() => {
      if (!isEventActive && isMarketActive) {
        setRoundTime(prev => prev + 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [roundTime, isEventActive, isMarketActive, lastEventTime, classId]);

  const handleInvestment = (companyIndex: number, amount: number) => {
    if (isEventActive) return;
    
    // Verificar se o usuário tem saldo suficiente para comprar
    if (amount > 0 && userBalance < amount) {
      toast({
        title: "Saldo insuficiente!",
        description: `Você precisa de R$ ${amount.toLocaleString('pt-BR')} mas possui apenas R$ ${userBalance.toLocaleString('pt-BR')}.`,
        variant: "destructive"
      });
      return;
    }
    
    setCompanies(prev => prev.map((company, index) => {
      if (index === companyIndex) {
        const newInvestment = Math.max(0, company.investment + amount);
        const timeString = `${Math.floor(roundTime / 60)}:${(roundTime % 60).toString().padStart(2, '0')}`;
        
        // Ao comprar ou vender, não alterar lastChange - apenas manter trend
        if (amount > 0) {
          return {
            ...company,
            investment: newInvestment,
            initialInvestment: company.initialInvestment + amount,
            trend: 'up',
            history: [...company.history, { time: timeString, value: newInvestment }]
          };
        } else {
          return {
            ...company,
            investment: newInvestment,
            trend: 'down',
            history: [...company.history, { time: timeString, value: newInvestment }]
          };
        }
      }
      return company;
    }));

    // Atualizar saldo do usuário
    setUserBalance(prev => prev - amount);

    toast({
      title: amount > 0 ? "Investimento realizado!" : "Desinvestimento realizado!",
      description: `R$ ${Math.abs(amount).toLocaleString('pt-BR')} ${amount > 0 ? 'investidos' : 'retirados'}`,
    });
  };

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    setShowChart(true);
  };

  const calculatePortfolioChange = () => {
    if (initialPortfolioValue === 0) return 0;
    return ((totalPortfolio - initialPortfolioValue) / initialPortfolioValue) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with all elements aligned */}
        <div className="flex items-center justify-between gap-4">
          <Button variant="secondary" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          
          <Card className="flex-1 max-w-sm">
            <div className="p-3 space-y-1">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                📊 Carteira de Investimentos
              </h3>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Total:</span>
                <span className="font-bold text-sm text-primary">
                  R$ {totalPortfolio.toLocaleString('pt-BR')}
                </span>
              </div>
              {initialPortfolioValue > 0 && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Variação:</span>
                  <span className={`font-medium text-xs ${calculatePortfolioChange() >= 0 ? 'text-bull' : 'text-bear'}`}>
                    {calculatePortfolioChange() >= 0 ? '+' : ''}{calculatePortfolioChange().toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </Card>

          <Card className="w-fit">
            <div className="p-3 space-y-1">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                💰 Saldo Disponível
              </h3>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-primary">
                  R$ {userBalance.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </Card>
          
          <div className="text-center">
            <h1 className="text-xl font-bold">Turma {classId}</h1>
            <p className="text-sm text-muted-foreground">Mercado Ativo - {Math.floor(roundTime / 60)}:{(roundTime % 60).toString().padStart(2, '0')}</p>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={handleEndMarket}
            disabled={!isMarketActive}
            className="flex items-center gap-2"
          >
            Encerrar Mercado
          </Button>
        </div>

        {/* Event Alert */}
        {currentEvent && (
          <div className={`event-alert flex items-center gap-3 ${
            positiveEvents.includes(currentEvent) ? 'bg-event-positive/10 border-event-positive/20' : 'bg-event-negative/10 border-event-negative/20'
          } border rounded-lg p-4`}>
            <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${
              positiveEvents.includes(currentEvent) ? 'text-event-positive' : 'text-event-negative'
            }`} />
            <span className="font-medium">{currentEvent}</span>
          </div>
        )}

        {/* Companies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <Card key={company.name} className="company-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCompanyClick(company)}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{company.name}</h3>
                  <div className="flex items-center gap-2">
                    {company.trend === 'up' && <TrendingUp className="h-5 w-5 text-bull" />}
                    {company.trend === 'down' && <TrendingDown className="h-5 w-5 text-bear" />}
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </div>
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

                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    className="investment-button bull flex-1"
                    onClick={() => handleInvestment(index, 100)}
                    disabled={isEventActive || !isMarketActive || userBalance < 100}
                  >
                    +R$ 100
                  </Button>
                  <Button
                    className="investment-button bull flex-1"
                    onClick={() => handleInvestment(index, 500)}
                    disabled={isEventActive || !isMarketActive || userBalance < 500}
                  >
                    +R$ 500
                  </Button>
                  <Button
                    className="investment-button bear flex-1"
                    onClick={() => handleInvestment(index, -100)}
                    disabled={isEventActive || !isMarketActive || company.investment < 100}
                  >
                    -R$ 100
                  </Button>
                  <Button
                    className="investment-button bear flex-1"
                    onClick={() => handleInvestment(index, -500)}
                    disabled={isEventActive || !isMarketActive || company.investment < 500}
                  >
                    -R$ 500
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {isEventActive && (
          <div className="text-center text-muted-foreground">
            <p>⏸️ Mercado pausado durante evento</p>
          </div>
        )}
      </div>

      <FinalReport
        isOpen={showFinalReport}
        onClose={() => setShowFinalReport(false)}
        onNewSimulation={handleNewSimulation}
        onBack={onBack}
        companies={companies}
        classId={classId}
      />

      <StockChart
        isOpen={showChart}
        onClose={() => setShowChart(false)}
        companyName={selectedCompany?.name || ''}
        history={selectedCompany?.history || []}
      />
    </div>
  );
};

export default StockMarket;