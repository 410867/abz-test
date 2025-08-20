import * as React from 'react';
import { Controller, type Control } from 'react-hook-form';
import { Box, Button, FormControl, FormHelperText, TextField } from '@mui/material';

type Props = {
  control: Control<any>;
};

export const UploadPhoto = ({ control }: Props) => {
  async function validatePhotoFile(file?: File) {
    if (!file) return 'Photo is required';
    const isJpeg = /jpe?g$/i.test(file.type) || /\.(jpe?g)$/i.test(file.name);
    if (!isJpeg) return 'The photo format must be jpeg/jpg type.';
    if (file.size > 5 * 1024 * 1024) return 'The photo size must not be greater than 5 Mb.';

    const dims = await new Promise<{ w: number; h: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
    if (dims.w < 70 || dims.h < 70) return 'Minimum size of photo 70x70px.';
    return true;
  }

  return (
    <Controller
      name="photo"
      control={control}
      rules={{ validate: async (files: FileList | undefined) => validatePhotoFile(files?.[0]) }}
      render={({ field, fieldState }) => {
        const file = field.value?.[0] as File | undefined;
        const hasError = !!fieldState.error;

        return (
          <FormControl error={hasError} fullWidth>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'stretch',
                height: 54,
                borderRadius: 1,
                border: '1px solid rgba(0, 0, 0, 0.87)',
                borderColor: hasError ? '#CB3D40' : '#D0CFCF',
                overflow: 'hidden',
              }}
            >
              <Button
                component="label"
                disableElevation
                variant="text"
                sx={{
                  px: 3,
                  border: '1px solid',
                  borderColor: hasError ? '#CB3D40' : 'rgba(0, 0, 0, 0.87)',
                  borderRadius: '4px 0 0 4px',
                  color: '#000',
                  textTransform: 'none',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '26px',
                  fontFamily: 'Nunito Sans, sans-serif',
                  '&:hover': { background: 'transparent' },
                }}
              >
                Upload
                <input
                  hidden
                  type="file"
                  accept="image/jpeg,image/jpg"
                  onChange={(e) => {
                    const files = e.target.files || undefined;
                    field.onChange(files);
                  }}
                />
              </Button>

              <TextField
                placeholder="Upload your photo"
                value={file?.name ?? ''}
                variant="outlined"
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{
                  '& .MuiOutlinedInput-root': { height: 54, borderRadius: 0 },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                }}
              />
            </Box>

            <FormHelperText sx={{ ml: 2 }}>
              {fieldState.error?.message}
            </FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}
