import React from 'react';
import ReactInputMask from 'react-input-mask';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, mask, ...props }, ref) => {
    return (
      <ReactInputMask mask={mask} {...props}>
        {(inputProps: any) => (
          <Input
            {...inputProps}
            ref={ref}
            className={cn("masked-input", className)}
          />
        )}
      </ReactInputMask>
    );
  }
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };