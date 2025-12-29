import { Input as HeroUIInput } from '@heroui/react';
import type { ComponentProps } from 'react';

type InputProps = ComponentProps<typeof HeroUIInput>;

export const Input = ({ startContent, endContent, classNames, ...props }: InputProps) => {
  return (
    <HeroUIInput
      variant="bordered"
      startContent={startContent}
      endContent={endContent}
      classNames={{
        input: '!text-txt',
        inputWrapper: 'bg-bg border-silver/30 hover:border-primary/50 focus-within:!border-primary',
        label: 'text-txt-muted',
        base: 'text-txt',
        ...classNames
      }}
      {...props}
    />
  );
};
