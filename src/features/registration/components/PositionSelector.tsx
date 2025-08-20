import React from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  type SxProps,
  type Theme,
} from '@mui/material';

type Position = { id: number; name: string };

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  positions: Position[];
  loading?: boolean;
  label?: string;
  labelSx?: SxProps<Theme>;
  requiredMessage?: string;
};

export function PositionSelector<T extends FieldValues>({
  control,
  name,
  positions,
  loading = false,
  label = 'Select your position',
  labelSx,
  requiredMessage = 'Position is required',
}: Props<T>) {
  if (loading) {
    return (
      <FormControl component="fieldset" disabled>
        <FormLabel sx={labelSx}>{label}</FormLabel>
        <div style={{ padding: 8 }}>
          <CircularProgress size={24} aria-label="Loading positions..." />
        </div>
      </FormControl>
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: requiredMessage }}
      render={({ field, fieldState }) => (
        <FormControl error={!!fieldState.error} component="fieldset">
          <FormLabel sx={labelSx}>{label}</FormLabel>

          <RadioGroup
            value={field.value != null ? String(field.value) : ''}
            onChange={(_, value) => field.onChange(Number(value) as any)}
          >
            {positions.map((p) => (
              <FormControlLabel
                key={p.id}
                value={String(p.id)}
                control={
                  <Radio
                    disableRipple
                    color="default"
                    icon={<span className="radio20__icon" />}
                    checkedIcon={<span className="radio20__icon radio20__icon--checked" />}
                    sx={{
                      '& .radio20__icon': {
                        width: 20, height: 20,
                        borderRadius: '50%',
                        border: '1px solid #D0CFCF',
                        display: 'inline-block',
                        boxSizing: 'border-box',
                      },
                      '& .radio20__icon--checked': {
                        border: '1px solid #00BDD3',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          margin: 'auto',
                          width: 10, height: 10,
                          borderRadius: '50%',
                          background: '#00BDD3',
                        },
                      },
                      '&:hover .radio20__icon': { borderColor: '#BDBDBD' },
                      '&.Mui-focusVisible .radio20__icon': { outline: '2px solid #80DEEA' },
                    }}
                  />
                }
                label={p.name}
              />
            ))}
          </RadioGroup>

          <FormHelperText sx={{ fontSize: 12, lineHeight: '16px', ml: 2 }}>
            {fieldState.error?.message || ''}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}
