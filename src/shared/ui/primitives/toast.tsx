import { Toaster as Sonner, toast } from 'sonner';

export type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      dir="rtl"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-neutral-900 group-[.toaster]:text-neutral-100 group-[.toaster]:border-neutral-800 group-[.toaster]:shadow-2xl font-sans text-start',
          description: 'group-[.toast]:text-neutral-400',
          actionButton: 'group-[.toast]:bg-amber-500 group-[.toast]:text-neutral-950 font-bold',
          cancelButton: 'group-[.toast]:bg-neutral-800 group-[.toast]:text-neutral-300',
        },
      }}
      {...props}
    />
  );
}

export { toast };
