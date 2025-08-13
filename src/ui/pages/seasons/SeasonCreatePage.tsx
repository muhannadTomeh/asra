import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../../utils/api'
import { Box, Button, Grid, Paper, Stack, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const SeasonCreatePage: React.FC = () => {
  const { companyId } = useParams()
  const navigate = useNavigate()
  const [error, setError] = React.useState<string | null>(null)

  const formik = useFormik({
    initialValues: {
      companyId: Number(companyId),
      ridPercentage: 0,
      plasticTankCost: 0,
      plasticTankWeight: 0,
      steelTankCost: 0,
      steelTankWeight: 0,
      serviceCostPerKg: 0,
      oilSellingCost: 0,
      oilBuyingCost: 0,
      isActiveSeason: true
    },
    validationSchema: Yup.object({
      ridPercentage: Yup.number().min(0).max(100).required('مطلوب'),
      plasticTankCost: Yup.number().min(0).required('مطلوب'),
      plasticTankWeight: Yup.number().min(0).required('مطلوب'),
      steelTankCost: Yup.number().min(0).required('مطلوب'),
      steelTankWeight: Yup.number().min(0).required('مطلوب'),
      serviceCostPerKg: Yup.number().min(0).required('مطلوب'),
      oilSellingCost: Yup.number().min(0).required('مطلوب'),
      oilBuyingCost: Yup.number().min(0).required('مطلوب')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError(null)
      try {
        const { data } = await api.post(`/companies/${companyId}/seasons`, values)
        navigate(`/seasons/${data.seasonId}`)
      } catch (e: any) { setError(e.message) } finally { setSubmitting(false) }
    }
  })

  return (
    <Box maxWidth={800} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>موسم جديد</Typography>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="نسبة الريد" type="number" {...formik.getFieldProps('ridPercentage')} error={formik.touched.ridPercentage && Boolean(formik.errors.ridPercentage)} helperText={formik.touched.ridPercentage && formik.errors.ridPercentage as any} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="تكلفة خزان البلاستيك" type="number" {...formik.getFieldProps('plasticTankCost')} error={formik.touched.plasticTankCost && Boolean(formik.errors.plasticTankCost)} helperText={formik.touched.plasticTankCost && formik.errors.plasticTankCost as any} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="وزن خزان البلاستيك" type="number" {...formik.getFieldProps('plasticTankWeight')} error={formik.touched.plasticTankWeight && Boolean(formik.errors.plasticTankWeight)} helperText={formik.touched.plasticTankWeight && formik.errors.plasticTankWeight as any} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="تكلفة خزان الحديد" type="number" {...formik.getFieldProps('steelTankCost')} error={formik.touched.steelTankCost && Boolean(formik.errors.steelTankCost)} helperText={formik.touched.steelTankCost && formik.errors.steelTankCost as any} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="وزن خزان الحديد" type="number" {...formik.getFieldProps('steelTankWeight')} error={formik.touched.steelTankWeight && Boolean(formik.errors.steelTankWeight)} helperText={formik.touched.steelTankWeight && formik.errors.steelTankWeight as any} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="تكلفة الخدمة/كغم" type="number" {...formik.getFieldProps('serviceCostPerKg')} error={formik.touched.serviceCostPerKg && Boolean(formik.errors.serviceCostPerKg)} helperText={formik.touched.serviceCostPerKg && formik.errors.serviceCostPerKg as any} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="سعر بيع الزيت" type="number" {...formik.getFieldProps('oilSellingCost')} error={formik.touched.oilSellingCost && Boolean(formik.errors.oilSellingCost)} helperText={formik.touched.oilSellingCost && formik.errors.oilSellingCost as any} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="سعر شراء الزيت" type="number" {...formik.getFieldProps('oilBuyingCost')} error={formik.touched.oilBuyingCost && Boolean(formik.errors.oilBuyingCost)} helperText={formik.touched.oilBuyingCost && formik.errors.oilBuyingCost as any} /></Grid>
            <Grid item xs={12}><FormControlLabel control={<Checkbox checked={formik.values.isActiveSeason} onChange={(e) => formik.setFieldValue('isActiveSeason', e.target.checked)} />} label="نشط" /></Grid>
          </Grid>
          {error && <Typography color="error" mt={2}>{error}</Typography>}
          <Stack direction="row" spacing={2} mt={2}>
            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>إنشاء</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}

export default SeasonCreatePage