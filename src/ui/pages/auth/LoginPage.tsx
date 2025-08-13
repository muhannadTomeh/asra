import React from 'react'
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../../../utils/auth/AuthContext'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = React.useState<string | null>(null)

  const formik = useFormik({
    initialValues: { phoneNumber: '', password: '' },
    validationSchema: Yup.object({
      phoneNumber: Yup.string().required('رقم الهاتف مطلوب'),
      password: Yup.string().required('كلمة المرور مطلوبة')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError(null)
      try {
        await login(values.phoneNumber, values.password, true)
        navigate('/')
      } catch (e: any) {
        setError(e.message || 'فشل تسجيل الدخول')
      } finally {
        setSubmitting(false)
      }
    }
  })

  return (
    <Box maxWidth={420} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>تسجيل الدخول</Typography>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField label="رقم الهاتف" {...formik.getFieldProps('phoneNumber')} error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)} helperText={formik.touched.phoneNumber && formik.errors.phoneNumber} />
            <TextField label="كلمة المرور" type="password" {...formik.getFieldProps('password')} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>دخول</Button>
            <Stack direction="row" spacing={1} justifyContent="space-between">
              <Button component={RouterLink} to="/register">إنشاء حساب</Button>
              <Button component={RouterLink} to="/auth/change-password-request">نسيت كلمة المرور؟</Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}

export default LoginPage