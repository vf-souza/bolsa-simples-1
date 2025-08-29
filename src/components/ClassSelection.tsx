import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users } from "lucide-react";

interface ClassSelectionProps {
  onSelectClass: (classId: '9A' | '9B') => void;
}

const ClassSelection = ({ onSelectClass }: ClassSelectionProps) => {
  const classes = [
    {
      id: '9A' as const,
      name: 'Turma 9A',
      companies: ['ECOSOL', 'MAXXIMINÉRIOS', 'AGROSOJA', 'FUTUROBANK', 'SMARTAL'],
      color: 'from-primary to-primary/80'
    },
    {
      id: '9B' as const,
      name: 'Turma 9B', 
      companies: ['EOLION', 'GALINDOS\'S COFFEE', 'MINEX', 'SANTOS TECNOVA', 'ALFABANK'],
      color: 'from-secondary to-accent'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Escola do Futuro
              </h1>
              <h2 className="text-2xl font-semibold text-muted-foreground mt-1">
                Bolsa de Valores do Futuro
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground text-lg">
            Escolha sua turma para começar a investir no mercado
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {classes.map((classInfo) => (
            <Card key={classInfo.id} className="company-card group cursor-pointer" onClick={() => onSelectClass(classInfo.id)}>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">{classInfo.name}</h2>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground font-medium">Empresas disponíveis:</p>
                  <div className="space-y-2">
                    {classInfo.companies.map((company) => (
                      <div key={company} className="flex items-center gap-2 p-2 bg-investment-bg rounded-lg">
                        <div className="w-2 h-2 bg-neutral rounded-full"></div>
                        <span className="font-medium text-sm">{company}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className={`w-full bg-gradient-to-r ${classInfo.color} hover:opacity-90 transition-opacity investment-button`}
                  size="lg"
                >
                  Entrar na {classInfo.name}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassSelection;