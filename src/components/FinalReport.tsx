import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp, TrendingDown, BarChart3, ArrowLeft } from "lucide-react";

interface Company {
  name: string;
  investment: number;
  lastChange: number;
  trend: 'up' | 'down' | 'neutral';
}

interface FinalReportProps {
  isOpen: boolean;
  onClose: () => void;
  onNewSimulation: () => void;
  onBack: () => void;
  companies: Company[];
  classId: '9A' | '9B';
}

const FinalReport = ({ isOpen, onClose, onNewSimulation, onBack, companies, classId }: FinalReportProps) => {
  const sortedCompanies = [...companies].sort((a, b) => b.investment - a.investment);
  const totalInvestment = companies.reduce((sum, company) => sum + company.investment, 0);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Trophy className="h-5 w-5 text-amber-600" />;
    return <div className="h-5 w-5 bg-muted rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</div>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            Relatório Final - Turma {classId}
          </DialogTitle>
          <DialogDescription>
            Simulação da Bolsa de Valores do Futuro finalizada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo Geral */}
          <Card className="company-card">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold">Investimento Total da Turma</h3>
              <p className="text-3xl font-bold text-primary">
                R$ {totalInvestment.toLocaleString('pt-BR')}
              </p>
            </div>
          </Card>

          {/* Ranking das Empresas */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Ranking das Empresas
            </h3>
            
            <div className="space-y-3">
              {sortedCompanies.map((company, index) => (
                <Card key={company.name} className="company-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getRankIcon(index)}
                      <div>
                        <h4 className="font-bold text-lg">{company.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {index === 0 ? "🏆 Empresa mais valorizada" : 
                           index === sortedCompanies.length - 1 ? "📉 Menor valorização" : 
                           `${index + 1}º lugar no ranking`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="text-xl font-bold">
                        R$ {company.investment.toLocaleString('pt-BR')}
                      </p>
                      {company.lastChange !== 0 && (
                        <div className="flex items-center gap-1 justify-end">
                          {company.trend === 'up' && <TrendingUp className="h-4 w-4 text-bull" />}
                          {company.trend === 'down' && <TrendingDown className="h-4 w-4 text-bear" />}
                          <span className={`text-sm font-medium ${
                            company.lastChange > 0 ? 'text-bull' : 'text-bear'
                          }`}>
                            {company.lastChange > 0 ? '+' : ''}{company.lastChange.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Análise de Desempenho */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Análise de Desempenho</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="company-card text-center">
                <div className="space-y-2">
                  <TrendingUp className="h-8 w-8 text-bull mx-auto" />
                  <h4 className="font-bold">Melhor Performance</h4>
                  <p className="text-sm text-muted-foreground">{sortedCompanies[0]?.name || 'N/A'}</p>
                  <p className="text-lg font-bold text-bull">
                    R$ {sortedCompanies[0]?.investment.toLocaleString('pt-BR') || '0'}
                  </p>
                </div>
              </Card>

              <Card className="company-card text-center">
                <div className="space-y-2">
                  <BarChart3 className="h-8 w-8 text-primary mx-auto" />
                  <h4 className="font-bold">Investimento Médio</h4>
                  <p className="text-sm text-muted-foreground">Por empresa</p>
                  <p className="text-lg font-bold">
                    R$ {(totalInvestment / companies.length).toLocaleString('pt-BR')}
                  </p>
                </div>
              </Card>

              <Card className="company-card text-center">
                <div className="space-y-2">
                  <TrendingDown className="h-8 w-8 text-bear mx-auto" />
                  <h4 className="font-bold">Menor Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    {sortedCompanies[sortedCompanies.length - 1]?.name || 'N/A'}
                  </p>
                  <p className="text-lg font-bold text-bear">
                    R$ {sortedCompanies[sortedCompanies.length - 1]?.investment.toLocaleString('pt-BR') || '0'}
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-center pt-4">
            <Button 
              variant="secondary"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button 
              onClick={() => {
                onClose();
                onNewSimulation();
              }}
              className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
            >
              Nova Simulação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FinalReport;