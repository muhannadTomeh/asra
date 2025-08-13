import React from 'react'
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { api } from '../../../utils/api'
import { useNavigate, useSearchParams } from 'react-router-dom'

const ChangePasswordPage: React.FC = () => {
  const [params] = useSearchParams()
  const preToken = params.get('token') || ''
  const navigate = useNavigate()
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  const formik = useFormik({
    initialValues: { phoneNumber: '', token: preToken, newPassword: '', confirmNewPassword: '' },
    enableReinitialize: true,
    validationSchema: Yup.object({
      phoneNumber: Yup.string().required('رقم الهاتف مطلوب'),
      token: Yup.string().required('الرمز مطلوب'),
      newPassword: Yup.string().min(6, 'الحد الأدنى 6 أحرف').required('كلمة المرور الجديدة مطلوبة'),
      confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'كلمتا المرور غير متطابقتين').required('تأكيد كلمة المرور مطلوب')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError(null)
      try {
        await api.post('/auth/change-password', { phoneNumber: values.phoneNumber, token: values.token, newPassword: values.newPassword })
        setSuccess(true)
        setTimeout(() => navigate('/login'), 1500)
      } catch (e: any) {
        setError(e.message)
      } finally { setSubmitting(false) }
    }
  })

  return (
    <Box maxWidth={520} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>تغيير كلمة المرور</Typography>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField label="رقم الهاتف" {...formik.getFieldProps('phoneNumber')} error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)} helperText={formik.touched.phoneNumber && formik.errors.phoneNumber} />
            <TextField label="الرمز" {...formik.getFieldProps('token')} error={formik.touched.token && Boolean(formik.errors.token)} helperText={formik.touched.token && formik.errors.token} />
            <TextField label="كلمة المرور الجديدة" type="password" {...formik.getFieldProps('newPassword')} error={formik.touched.newPassword && Boolean(formik.errors.newPassword)} helperText={formik.touched.newPassword && formik.errors.newPassword} />
            <TextField label="تأكيد كلمة المرور" type="password" {...formik.getFieldProps('confirmNewPassword')} error={formik.touched.confirmNewPassword && Boolean(formik.errors.confirmNewPassword)} helperText={formik.touched.confirmNewPassword && formik.errors.confirmNewPassword} />
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="success.main">تم تغيير كلمة المرور بنجاح</Typography>}
            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>تغيير</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}

export default ChangePasswordPage