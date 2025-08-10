import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Eye, EyeOff } from "lucide-react";

interface EnhancedFormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'select';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helpText?: string;
  required?: boolean;
  options?: { value: string; label: string; }[];
  disabled?: boolean;
}

export function EnhancedFormField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helpText,
  required = false,
  options = [],
  disabled = false
}: EnhancedFormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  const renderInput = () => {
    const commonProps = {
      id: name,
      name,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      disabled,
      className: `
        peer w-full pt-6 pb-2 px-3 text-sm bg-transparent border border-input rounded-md
        transition-all duration-200 focus-enhanced
        ${error ? 'border-destructive focus:border-destructive' : 'focus:border-primary'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `,
      placeholder: isFocused ? placeholder : ''
    };

    switch (type) {
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            rows={4}
            className={commonProps.className + ' resize-none'}
          />
        );
      
      case 'select':
        return (
          <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className={commonProps.className}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      default:
        return (
          <div className="relative">
            <Input
              {...commonProps}
              type={type === 'password' && showPassword ? 'text' : type}
            />
            {type === 'password' && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        {renderInput()}
        
        {/* Floating Label */}
        <Label
          htmlFor={name}
          className={`
            absolute left-3 transition-all duration-200 pointer-events-none
            ${isFloating 
              ? 'top-2 text-xs text-primary' 
              : 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground'
            }
            ${error ? 'text-destructive' : ''}
          `}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>

      {/* Help Text & Error */}
      <div className="flex items-center justify-between mt-1 min-h-[20px]">
        <div className="flex items-center gap-2">
          {helpText && (
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">{helpText}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {helpText && !error && (
            <p className="text-xs text-muted-foreground">{helpText}</p>
          )}
        </div>
        
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
}