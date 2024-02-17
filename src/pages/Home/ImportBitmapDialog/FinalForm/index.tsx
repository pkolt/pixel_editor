import { CheckBox } from '@/components/CheckBox';
import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { BitmapEntity } from '@/types/bitmap';
import { FormProvider, useForm } from 'react-hook-form';

interface FormData {
  ids: string[];
}

interface FinalFormProps {
  entities: BitmapEntity[];
  onClose: () => void;
}

export const FinalForm = ({ entities, onClose }: FinalFormProps) => {
  const { addBitmap } = useBitmapStore();

  const methods = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      ids: entities.map((it) => it.id),
    },
  });

  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = methods;

  const onSubmit = (data: FormData) => {
    entities.forEach((it) => {
      if (data.ids.includes(it.id)) {
        addBitmap(it);
      }
    });
    onClose();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
        <div>
          {entities.map((it) => (
            <CheckBox
              key={it.id}
              label={`${it.name} (${it.width}x${it.height})`}
              value={it.id}
              {...register('ids', { required: true })}
            />
          ))}
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary" disabled={!isValid}>
            Finish
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
