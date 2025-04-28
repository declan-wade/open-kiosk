import { Show } from 'react-smart-conditional';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Timer, TrendingUp } from 'lucide-react';

// TypeScript interfaces
interface TotalWeightLiftingComponent {
  List: string[];
  EmptyListItem: string;
}

interface WorkoutComponentResult {
  ClassId: string;
  StartTime: string;
  HasResultsForClass: boolean;
  PerformanceResultKey: string;
  FullyFormattedResult: string;
  IsRx: boolean;
  IsRxPlus: boolean;
  HasBeenScored: boolean;
}

interface WorkoutComponentResults {
  List: WorkoutComponentResult[];
  EmptyListItem: WorkoutComponentResult;
}

interface WorkoutComponent {
  Id: string;
  IsSection: boolean;
  IsVideoURL: boolean;
  IsImage: boolean;
  IsWarmup: boolean;
  IsGymnastics: boolean;
  IsWeightlifting: boolean;
  IsMetcon: boolean;
  IsWeightliftingTotal: boolean;
  Name: string;
  Comment: string;
  VideoURL: string;
  VideoURLComment: string;
  ImageURL: string;
  ImageFilename: string;
  ImageComment: string;
  PrefixText: string;
  MeasureIsMaxEffort: boolean;
  MeasureRepScheme: string;
  Description: string;
  Rounds: number;
  ResultTypeId: number;
  IsResultTypeEachRound: boolean;
  IsResultTypeNoMeasure: boolean;
  IsResultTypeCheckmark: boolean;
  EachRoundTypeLabel: string;
  ScalingId: number;
  ComponentId: string;
  ComponentExternalURL: string;
  ComponentSystemComment: string;
  TotalWeightLiftingComponents: TotalWeightLiftingComponent;
  WorkoutComponentResults: WorkoutComponentResults;
  HasPerformedAtLeastOnce: boolean;
  HasAtLeastOneWorkoutComponentResult: boolean;
}

interface WorkoutComponentsProps {
  components: WorkoutComponent[];
}

// Helper function to parse HTML content safely
const createMarkup = (html: string) => {
  return { __html: html };
};

export default function WorkoutComponents({ components = [] }: WorkoutComponentsProps) {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Today's Workout</h1>
      
      <Show>
        <Show.If condition={components.length === 0}>
            <div className="flex justify-center">
                <p>No workouts available for today.</p>
            </div>
        </Show.If>
        <Show.Else>
      <div className="space-y-4">
        {components.map((component) => {
          const componentType = component.IsWeightlifting 
            ? 'weightlifting' 
            : component.IsMetcon 
              ? 'metcon' 
              : component.IsGymnastics 
                ? 'gymnastics' 
                : component.IsWarmup 
                  ? 'warmup' 
                  : 'other';
          
          return (
            <Card key={component.Id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold">{component.Name}</CardTitle>
                  <ComponentBadge type={componentType} />
                </div>
                
                {component.MeasureRepScheme && (
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Timer size={16} className="mr-1" />
                    <span>{component.MeasureRepScheme}</span>
                  </div>
                )}
              </CardHeader>
              
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {component.Comment && (
                    <AccordionItem value="instructions">
                      <AccordionTrigger className="text-base font-medium">
                        Description
                      </AccordionTrigger>
                      <AccordionContent>
                        <div 
                          className="prose prose-sm max-w-none text-gray-700"
                          dangerouslySetInnerHTML={createMarkup(component.Comment)} 
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {component.Description && (
                    <AccordionItem value="workout">
                      <AccordionTrigger className="text-base font-medium">
                        Workout Details
                      </AccordionTrigger>
                      <AccordionContent>
                        <div 
                          className="prose prose-sm max-w-none text-gray-700"
                          dangerouslySetInnerHTML={createMarkup(component.Description)} 
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>
      </Show.Else>
      </Show>
    </div>
  );
}

// Component for workout type badge
function ComponentBadge({ type }: { type: string }) {
  switch (type) {
    case 'weightlifting':
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          <Dumbbell size={14} className="mr-1" /> Weightlifting
        </Badge>
      );
    case 'metcon':
      return (
        <Badge className="bg-red-500 hover:bg-red-600">
          <Timer size={14} className="mr-1" /> Metcon
        </Badge>
      );
    case 'gymnastics':
      return (
        <Badge className="bg-purple-500 hover:bg-purple-600">
          <TrendingUp size={14} className="mr-1" /> Gymnastics
        </Badge>
      );
    case 'warmup':
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          Warm-up
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-500 hover:bg-gray-600">
          Other
        </Badge>
      );
  }
}