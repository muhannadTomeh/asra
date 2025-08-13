import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../../utils/api'
import { Box, Button, Checkbox, FormControlLabel, Paper, Stack, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const CompanyEditPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initial, setInitial] = React.useState<any | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/companies/${id}`)
        setInitial(res.data)
      } catch (e: any) { setError(e.message) }
    })()
  }, [id])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initial || { name: '', address: '', isActive: true },
    validationSchema: Yup.object({
      name: Yup.string().required('الاسم مطلوب'),
      address: Yup.string().required('العنوان مطلوب')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError(null)
      try {
        await api.put(`/companies/${id}`, values)
        navigate(`/companies/${id}`)
      } catch (e: any) { setError(e.message) } finally { setSubmitting(false) }
    }
  })

  if (!initial) return <Typography>جارٍ التحميل...</Typography>

  return (
    <Box maxWidth={600} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>تعديل الشركة</Typography>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField label="الاسم" {...formik.getFieldProps('name')} error={formik.touched.name && Boolean(formik.errors.name)} helperText={formik.touched.name && formik.errors.name} />
            <TextField label="العنوان" {...formik.getFieldProps('address')} error={formik.touched.address && Boolean(formik.errors.address)} helperText={formik.touched.address && formik.errors.address} />
            <FormControlLabel control={<Checkbox checked={formik.values.isActive} onChange={(e) => formik.setFieldValue('isActive', e.target.checked)} />} label="نشطة" />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>حفظ</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}

export default CompanyEditPage