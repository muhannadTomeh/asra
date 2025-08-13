import React from 'react'
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { api } from '../../../utils/api'

const ChangePasswordRequestPage: React.FC = () => {
  const [token, setToken] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const formik = useFormik({
    initialValues: { phoneNumber: '' },
    validationSchema: Yup.object({ phoneNumber: Yup.string().required('رقم الهاتف مطلوب') }),
    onSubmit: async (values, { setSubmitting }) => {
      setError(null)
      try {
        const { data } = await api.post('/auth/change-password-request', { phoneNumber: values.phoneNumber })
        setToken(data.token)
      } catch (e: any) {
        setError(e.message)
      } finally { setSubmitting(false) }
    }
  })

  return (
    <Box maxWidth={480} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>طلب تغيير كلمة المرور</Typography>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField label="رقم الهاتف" {...formik.getFieldProps('phoneNumber')} error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)} helperText={formik.touched.phoneNumber && formik.errors.phoneNumber} />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>إرسال الرمز</Button>
          </Stack>
        </form>
        {token && (
          <Box mt={2}>
            <Typography variant="subtitle1">الرمز (للاختبار):</Typography>
            <Typography sx={{ direction: 'ltr' }}>{token}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default ChangePasswordRequestPage