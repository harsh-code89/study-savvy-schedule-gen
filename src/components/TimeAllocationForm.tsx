
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { AvailableTime } from '@/types/studyPlanner';

interface TimeAllocationFormProps {
  availableTimes: AvailableTime[];
  setAvailableTimes: (times: AvailableTime[]) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  onGeneratePlan: () => void;
  disableGenerate: boolean;
}

const TimeAllocationForm: React.FC<TimeAllocationFormProps> = ({
  availableTimes,
  setAvailableTimes,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onGeneratePlan,
  disableGenerate
}) => {
  const handleHoursChange = (day: string, hours: number) => {
    const newAvailableTimes = availableTimes.map(time => 
      time.day === day ? { ...time, hours } : time
    );
    setAvailableTimes(newAvailableTimes);
  };

  return (
    <Card className="p-6 glass-card">
      <h2 className="text-xl font-bold mb-4 gradient-heading">Available Study Time</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={!startDate}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => !startDate || date < startDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Daily Available Hours</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 mt-2">
            {availableTimes.map((time) => (
              <div key={time.day} className="space-y-1">
                <Label htmlFor={`hours-${time.day}`} className="text-sm">
                  {time.day}
                </Label>
                <Input
                  id={`hours-${time.day}`}
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={time.hours}
                  onChange={(e) => handleHoursChange(time.day, parseFloat(e.target.value) || 0)}
                  className="h-9"
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={onGeneratePlan}
          className="w-full bg-study-primary hover:bg-study-secondary"
          disabled={disableGenerate || !startDate || !endDate}
        >
          Generate Study Plan
        </Button>
      </div>
    </Card>
  );
};

export default TimeAllocationForm;
