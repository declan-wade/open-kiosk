'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import ClassSchedule from "@/components/classes";
import { getClasses, getWorkouts } from '@/lib/api';
import WorkoutComponents from '@/components/workout';

export default function Home() {
  // Set default date to today
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [classes, setClasses] = useState(null);
  const [workouts, setWorkouts] = useState(null);

  // Format date as ISO string (YYYY-MM-DD)
  const formatDateForApi = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };

  const fetchWorkoutData = async (selectedDate: Date) => {
    setIsLoading(true);
      let response = await getClasses(formatDateForApi(selectedDate));
      setClasses(response);
      response = await getWorkouts(formatDateForApi(selectedDate));
      setWorkouts(response);
      setIsLoading(false);
    }

  // Fetch data when component mounts or date changes
  useEffect(() => {
    fetchWorkoutData(date);
  }, [date]);

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family:var(--font-geist-sans)]">
      <div className="mb-4 justify-self-start">
      <div>
        <h1 className="text-3xl font-bold mb-6">Class Schedule</h1>
      </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button disabled={isLoading} variant="outline" className="w-[240px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, 'PPP')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <p>Loading schedule...</p>
        </div>
      ) : classes && workouts ? (
        <>
        <WorkoutComponents components={workouts} />
        <ClassSchedule classes={classes} />
        </>
      ) : (
        <p className="text-center">Unable to load class schedule. Please try again later.</p>
      )}
    </div>
  );
}