import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { getPositions, registerUser, type PositionsResponse } from '../../api/positionsApi';
import styles from './RegistrationForm.module.scss';
import { Alert, Button, TextField } from '@mui/material';
import { UploadPhoto } from './components/UploadPhoto';
import { PositionSelector } from './components/PositionSelector';

type FormValues = {
  name: string;
  email: string;
  phone: string;
  position_id: number;
  photo: FileList;
};

const MUI_styles = {
  helperText: {
    fontSize: "12px",
    lineHeight: "16px",
    marginTop: "4px",
    marginLeft: "16px",
  },

  radioLabel: {
    fontFamily: "Nunito, Arial, sans-serif",
    fontSize: '16px',
    lineHeight: '26px',
    color: 'rgba(0, 0, 0, 0.87)'
  }
}

const EMAIL_SAFE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegistrationForm({ onSuccess }: { onSuccess?: () => void }) {
  const [positions, setPositions] = useState<PositionsResponse['positions']>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingPositions(true);
        const data = await getPositions();
        if (alive) setPositions(data.positions);
      } finally {
        if (alive) setLoadingPositions(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '+380',
      position_id: undefined as unknown as number,
      photo: undefined as unknown as FileList,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setSubmitError(null);
    const fd = new FormData();
    fd.append('name', values.name);
    fd.append('email', values.email);
    fd.append('phone', values.phone);
    fd.append('position_id', String(values.position_id));
    fd.append('photo', values.photo[0]);

    try {
      await registerUser(fd);
      reset({
        name: '',
        email: '',
        phone: '+380',
        position_id: undefined as unknown as number,
        photo: undefined as unknown as FileList,
      });

      onSuccess?.();

      window.dispatchEvent(new CustomEvent('user:registered'));
    } catch (e: any) {
      setSubmitError(e?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <section className={styles.blockRegistration} id="sign-up-form">
      <h1>Working with POST request</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formGroup}>
        <TextField
          label="Your name"
          fullWidth
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Name must be at least 2 characters" },
            maxLength: { value: 60, message: "Name must be at most 60 characters" },
          })}
          error={!!errors.name}
          helperText={errors.name ? errors.name.message : ''}
          FormHelperTextProps={{ sx: MUI_styles.helperText }}
        />

        <TextField
          label="Email"
          type="email"
          fullWidth
          {...register("email", {
            required: "Email is required",
            pattern: { value: EMAIL_SAFE, message: "Email is invalid" },
            setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
          })}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ""}
        />

        <div className={styles.blockPhonePositionAvatar}>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Phone is required",
              pattern: { value: /^\+380\d{9}$/, message: "Phone must match +380XXXXXXXXX" },
            }}
            render={({ field }) => {
              const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
                const digits = e.target.value.replace(/\D/g, "");
                const tail = (digits.startsWith("380") ? digits.slice(3) : digits).slice(0, 9);
                field.onChange("+380" + tail);
              };

              return (
                <TextField
                  label="Phone"
                  type="tel"
                  fullWidth
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={handleBlur}
                  error={!!errors.phone}
                  helperText={errors.phone ? String(errors.phone.message) : "+38 (XXX) XXX - XX - XX"}
                  FormHelperTextProps={{ sx: MUI_styles.helperText }}
                  inputProps={{
                    inputMode: "numeric",
                    maxLength: 13,
                  }}
                />
              );
            }}
          />

          <div className={styles.blockPositionAvatar}>
            <PositionSelector<FormValues>
              control={control}
              name="position_id"
              positions={positions}
              loading={loadingPositions}
              labelSx={MUI_styles.radioLabel}
            />
            <UploadPhoto control={control} />
          </div>
        </div>

        {submitError && (
          <Alert
            severity="error"
            onClose={() => setSubmitError(null)} sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!isValid || isSubmitting || loadingPositions}
          sx={{
            minWidth: '100px',
            maxWidth: '100px',
            borderRadius: '22px',
            textTransform: 'none',
            backgroundColor: '#F4E041',
            color: '#000',
            '&:hover': { backgroundColor: '#FFE302' },

            '&.Mui-disabled': {
              backgroundColor: '#B4B4B4',
              color: 'rgba(255,255,255,0.87)',
            },
          }}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Submitting…' : 'Sign up'}
        </Button>
      </form>
    </section>
  );
}

