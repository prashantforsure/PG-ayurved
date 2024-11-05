"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "./calender"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  setDateRange: React.Dispatch<React.SetStateAction<{
    from: Date | null;
    to: Date | null;
  }>>;
}

export function DatePickerWithRange({
  className,
  dateRange,
  setDateRange,
}: DatePickerWithRangeProps) {
  // Convert the null dates to undefined for react-day-picker
  const selectedRange: DateRange | undefined = dateRange.from 
    ? {
        from: dateRange.from,
        to: dateRange.to ?? undefined
      }
    : undefined;

  // Handle the date selection and convert undefined to null
  const handleSelect = (range: DateRange | undefined) => {
    setDateRange({
      from: range?.from ?? null,
      to: range?.to ?? null,
    });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
           
            mode="range"
            defaultMonth={dateRange.from ?? undefined}
            selected={selectedRange}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}