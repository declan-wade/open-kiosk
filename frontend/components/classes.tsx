"use client"
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Button 
} from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, AlertCircle, Loader2 } from 'lucide-react';
import { makeReservation } from '@/lib/api';

// TypeScript interfaces
interface Coach {
  ImgUrl: string;
  Name: string;
  Id: string;
}

interface CoachList {
  List: Coach[];
  EmptyListItem: Coach;
}

interface ClassItem {
  Id: string;
  Name: string;
  StartTime: string;
  EndTime: string;
  Status: string;
  IsWaitlisting: boolean;
  IsAvailable: boolean;
  CanSignin: boolean;
  ProgramId: string;
  WaitlistTypeId: string;
  ClassLimit: number;
  ClassReservationStatusId: string;
  Description: string;
  ReservationCount: number;
  WaitlistCount: number;
  CanCancelSignIn: boolean;
  OnlineMembershipSaleId: string;
  Coaches: CoachList;
}

interface ClassScheduleProps {
  classes: ClassItem[];
}

// Format time from "HH:MM:SS" to "h:MM AM/PM"
const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${period}`;
};

export default function ClassSchedule({ classes = [] }: ClassScheduleProps) {
  const [reservedClasses, setReservedClasses] = useState<string[]>([]);
  const [waitlistedClasses, setWaitlistedClasses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleReserve(classId: string){
    setIsLoading(true);
    const response = await makeReservation(classId);
    console.log(response);
    if(response.Error_Schedule.HasError){
      alert("Error occured when reserving class!");
    }
    else {
      alert("Successfully reserved class!");
      setReservedClasses([...reservedClasses, classId]);
    }
    setIsLoading(false);
  };

  const handleJoinWaitlist = (classId: string): void => {
    setWaitlistedClasses([...waitlistedClasses, classId]);
  };

  const handleCancelReservation = (classId: string): void => {
    setReservedClasses(reservedClasses.filter(id => id !== classId));
  };

  const handleCancelWaitlist = (classId: string): void => {
    setWaitlistedClasses(waitlistedClasses.filter(id => id !== classId));
  };
  
  return (
    <div className="container mx-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((classItem: ClassItem) => {
          const isReserved = reservedClasses.includes(classItem.Id) || classItem.Status === "Reserved";
          const isWaitlisted = waitlistedClasses.includes(classItem.Id);
          const startTime = formatTime(classItem.StartTime);
          const endTime = formatTime(classItem.EndTime);
          // Parse the time strings and compare with current time
          const today = new Date();
          const currentTime = today.getHours() * 60 + today.getMinutes();
          const [hours, minutes] = classItem.StartTime.split(':').map(Number);
          const classStartTime = hours * 60 + minutes;
          const isPastClass = currentTime > classStartTime;
                    
          return (
            <Card 
              key={classItem.Id} 
              className={`overflow-hidden ${isReserved ? 'border-green-500 border-2' : ''} ${isPastClass ? 'opacity-60' : ''}`}
            >
              <div className="px-4 pb-2 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{classItem.Name}</h2>
                  {!isPastClass && classItem.ProgramId === "6760" && (
                    <Badge className="bg-purple-500">SurgeFit</Badge>
                  )}
                </div>
                
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <Clock size={16} className="mr-1" />
                  <span>{startTime} - {endTime}</span>
                </div>
              </div>
              
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    <span className="text-sm">
                      {classItem.ReservationCount}/{classItem.ClassLimit} spots filled
                    </span>
                  </div>
                  
                  {!isPastClass && !classItem.IsAvailable && (
                    <Badge variant="destructive" className="ml-2">
                      Full
                    </Badge>
                  )}
                </div>
                
                {!isPastClass && classItem.IsWaitlisting && (
                  <div className="flex items-center mt-2 text-sm text-amber-600">
                    <AlertCircle size={16} className="mr-1" />
                    <span>Waitlist: {classItem.WaitlistCount} people</span>
                  </div>
                )}
                
                {!isPastClass && isReserved && (
                  <Badge className="mt-2 bg-green-500">Reserved</Badge>
                )}
                
                {!isPastClass && isWaitlisted && (
                  <Badge variant="outline" className="mt-2 border-amber-500 text-amber-500">
                    On Waitlist
                  </Badge>
                )}
  
                {isPastClass && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p>This class has already started</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                {isPastClass ? (
                  <Button
                    variant="secondary"
                    className="w-full"
                    disabled
                  >
                    Class Started
                  </Button>
                ) : isReserved ? (
                  <Button
                    variant="destructive" 
                    className="w-full"
                    disabled={isLoading}
                    onClick={() => handleCancelReservation(classItem.Id)}
                  >
                    Cancel Reservation
                    {isLoading && (<Loader2 className="ml-2 animate-spin" />)}
                  </Button>
                ) : !isWaitlisted ? (
                  <>
                    {classItem.IsAvailable ? (
                      <Button
                        disabled={isLoading}
                        className="w-full"
                        onClick={() => handleReserve(classItem.Id)}
                      >
                        Reserve Spot
                        {isLoading && (<Loader2 className="ml-2 animate-spin" />)}
                      </Button>
                    ) : classItem.IsWaitlisting ? (
                      <Button
                        variant="outline"
                        className="w-full border-amber-500 text-amber-500 hover:bg-amber-50"
                        onClick={() => handleJoinWaitlist(classItem.Id)}
                      >
                        Join Waitlist
                      </Button>
                    ) : (
                      <Button disabled className="w-full">
                        Class Full
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                    onClick={() => handleCancelWaitlist(classItem.Id)}
                  >
                    Leave Waitlist
                    {isLoading && (<Loader2 className="ml-2 animate-spin" />)}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}